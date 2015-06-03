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
 * @package    MageWorx_CurrencySwitcher
 * @copyright  Copyright (c) 2013 MageWorx (http://www.mageworx.com/)
 * @license    http://www.mageworx.com/LICENSE-1.0.html
 */

/**
 * Currency Auto Switcher extension
 * Exception class
 *
 * @category   MageWorx
 * @package    MageWorx_CurrencySwitcher
 * @author     MageWorx Dev Team <dev@mageworx.com>
 */

class MageWorx_CurrencySwitcher_Model_Switcher extends Mage_Core_Model_Abstract
{
    /**
     * Checks if currency auto switch is allowed
     *
     * @return bool
     */
    public function isAllowed()
    {
        if (!Mage::helper('currencyswitcher')->isEnabled() || Mage::app()->getStore()->isAdmin()) {
            return false;
        }

        $userAgentList = Mage::helper('currencyswitcher')->getUserAgentList();
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

        $request = Mage::app()->getRequest();
        $exceptionUrls = Mage::helper('currencyswitcher')->getExceptionUrls();
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

        return true;
    }

    /**
     * Returns currency code for auto-switch
     *
     * @param string $countryCode
     * @return string
     */
    public function getCurrency($countryCode)
    {
        $currency = Mage::helper('currencyswitcher')->getCurrency($countryCode);

        $customCurrency = Mage::getModel('currencyswitcher/relations')->getCountryCurrency($countryCode);
        if ($customCurrency) {
            $currency = $customCurrency;
        }

        return $currency;
    }
}