<?php
/**
 * MageWorx
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the MageWorx EULA that is bundled with
 * this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.mageworx.com/LICENSE-1.0.html
 *
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@mageworx.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade the extension
 * to newer versions in the future. If you wish to customize the extension
 * for your needs please refer to http://www.mageworx.com/ for more information
 * or send an email to sales@mageworx.com
 *
 * @category   MageWorx
 * @package    MageWorx_StoreSwitcher
 * @copyright  Copyright (c) 2013 MageWorx (http://www.mageworx.com/)
 * @license    http://www.mageworx.com/LICENSE-1.0.html
 */

/**
 * Store Auto Switcher extension
 * Exception class
 *
 * @category   MageWorx
 * @package    MageWorx_StoreSwitcher
 * @author     MageWorx Dev Team <dev@mageworx.com>
 */

class MageWorx_StoreSwitcher_Model_Switcher
{
    protected $_customerStoreCode = null;
    protected $_availableStores = null;

    /**
     * Checks if store auto switch is available
     *
     * @param null $request
     * @return bool
     */
    public function isAllowed($request = null)
    {
        if (Mage::app()->getStore()->isAdmin()) {
            return false;
        }

        $helper = Mage::helper('storeswitcher');
        if (!$request) {
            $request = Mage::app()->getRequest();
        }

        if (!$helper->isStoreSwitcherEnabled()) {
            return false;
        }

        if ($request->getQuery('_store_switcher_') == $helper->getDisableKey() || $request->getCookie('_store_switcher_') == $helper->getDisableKey()) {
            return false;
        }

        $exceptionUrls = $helper->getExceptionUrls();
        if (!empty($exceptionUrls)) {
            if (!is_array($exceptionUrls)) {
                $exceptionUrls = explode('\n', $exceptionUrls);
            }
            $requestString = $request->getRequestString();
            foreach ($exceptionUrls as $url) {
                $url = str_replace('*', '.*?', $url);
                if (preg_match('!^' . $url . '$!i', $requestString)) {
                    return false;
                }
            }
        }

        $ipList = $helper->getIpList();
        if (!empty($ipList)) {
            foreach ($ipList as $ip) {
                $ip = str_replace(array('*', '.'), array('\d+', '\.'), $ip);
                if (preg_match("/^{$ip}$/", Mage::helper('mwgeoip')->getCustomerIp())) {
                    return false;
                }
            }
        }

        $userAgentList = $helper->getUserAgentList();
        $userAgent = Mage::helper('mwgeoip/http')->getHttpUserAgent();
        if (!empty($userAgentList) && $userAgent) {
            foreach ($userAgentList as $agent) {
                $agent = str_replace('*', '.*', $agent);
                $agent = str_replace('/', '\/', $agent);
                if (preg_match("/{$agent}$/i", $userAgent)) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Returns store code by country code
     *
     * @param string $customerCountryCode
     * @param bool|string $customerRegion
     * @return bool|string
     */
    public function getStoreCodeByCountry($customerCountryCode, $customerRegion = false)
    {
        $helper = Mage::helper('storeswitcher');
        $stores = $this->getAvailableStores();

        $customerStoreCode = false;
        foreach ($stores as $k => $store) {
            $storeCountryCodes = $helper->prepareCountryCode($store->getGeoipCountryCode());
            if (is_array($storeCountryCodes) && !empty($storeCountryCodes[$customerCountryCode])) {

                $storeRegions = $storeCountryCodes[$customerCountryCode];
                if (!Mage::helper('mwgeoip')->isCityDbType()
                    || !$customerRegion
                    || !is_array($storeRegions)
                    || empty($storeRegions)
                    || in_array($customerRegion, $storeRegions)
                ) {
                    $customerStoreCode = $store->getCode();
                    break;
                }
            }
        }

        return $customerStoreCode;
    }

    /**
     * Returns store code according to current customer location
     *
     * @return bool|null|string
     */
    public function getCustomerStoreCode()
    {
        $geoipCountry = Mage::app()->getRequest()->getParam('geoip_country', 0);
        $allowedCountries = explode(',', Mage::getStoreConfig('general/country/allow'));
        if(!in_array($geoipCountry, $allowedCountries)){
            $geoipCountry = false;
        }

        if (is_null($this->_customerStoreCode) || $geoipCountry) {

            $stores = $this->getAvailableStores();
            if (!count($stores)) {
                return false;
            } elseif (count($stores) === 1) {
                $storeModel = current($stores);
                return $storeModel->getCode();
            }

            $helper = Mage::helper('storeswitcher');

            $geoip = Mage::getSingleton('mwgeoip/geoip')->getCurrentLocation();

            if (!$geoipCountry) {
                $code = $geoip->getCode();
            } else {
                $code = $geoipCountry;
            }
            $customerCountryCode = $helper->prepareCode($code);

            if (empty($customerCountryCode)) {
                return false;
            }

            $region = $geoip->getRegion() ? $geoip->getRegion() : false;
            $customerStoreCode = $this->getStoreCodeByCountry($customerCountryCode, $region);

            if (!$customerStoreCode) {
                $store = reset($stores);
                $customerStoreCode = $store->getCode();
            }

            if ($geoipCountry) {
                $session = Mage::getSingleton('customer/session');
                if ($location = $session->getCustomerLocation()) {
                    $location->setCode($geoipCountry);
                    $session->setCustomerLocation($location);
                }
                return $customerStoreCode;
            }

            $this->_customerStoreCode = $customerStoreCode;

        }

        return $this->_customerStoreCode;
    }

    /**
     * Retruns all stores, available for auto-switch
     *
     * @return null
     */
    public function getAvailableStores()
    {
        if (is_null($this->_availableStores)) {

            $websiteId = Mage::app()->getStore()->getWebsiteId();

            foreach (Mage::app()->getStores() as $store) {
                if ($store->getIsActive() == 1) {
                    if (Mage::helper('storeswitcher')->isWebsiteScope() && $store->getWebsiteId() != $websiteId) {
                        continue;
                    }
                    $stores[$store->getCode()] = $store;
                }
            }

            $this->_availableStores = $stores;

        }

        return $this->_availableStores;
    }

    /**
     * Returns redirect url if it is needed
     *
     * @param string $customerStoreCode
     * @return bool|string
     */
    public function getRedirectUrl($customerStoreCode)
    {
        $stores  = $this->getAvailableStores();
        $request = Mage::app()->getRequest();
        $store   = $stores[$customerStoreCode];
        $storeId = $store->getStoreId();

        if ($request->getControllerName() == 'product' && $request->getActionName() == 'view' && ($productId = $request->getParam('id'))) {
            $product = Mage::getModel('catalog/product')->setStoreId($storeId)->load($productId);
            $redirectUrl = $product->getProductUrl();
        } else {
            $redirectUrl = Mage::app()->getStore($customerStoreCode)->getBaseUrl() . ltrim($request->getRequestString(), '/');
        }

        $getParams = explode('?', $request->getRequestUri(), 2);
        if (!empty($getParams[1])) {
            $redirectUrl .= '?' . $getParams[1];
        }

        $clearCurrentUrl = str_replace(array('/index.php'), '', Mage::helper('core/url')->getCurrentUrl());
        $clearRedirectUrl = str_replace(array('/index.php'), '', $redirectUrl);

        if ($clearCurrentUrl !== $clearRedirectUrl) {
            return $redirectUrl;
        }

        return false;
    }
}