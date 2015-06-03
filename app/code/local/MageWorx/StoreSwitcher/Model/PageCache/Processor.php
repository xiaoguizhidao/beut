<?php
/**
 * Magento Enterprise Edition
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Magento Enterprise Edition License
 * that is bundled with this package in the file LICENSE_EE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.magentocommerce.com/license/enterprise-edition
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@magentocommerce.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Magento to newer
 * versions in the future. If you wish to customize Magento for your
 * needs please refer to http://www.magentocommerce.com for more information.
 *
 * @category    Enterprise
 * @package     Enterprise_PageCache
 * @copyright   Copyright (c) 2012 Magento Inc. (http://www.magentocommerce.com)
 * @license     http://www.magentocommerce.com/license/enterprise-edition
 */

class MageWorx_StoreSwitcher_Model_PageCache_Processor extends MageWorx_StoreSwitcher_Model_PageCache_Processor_Abstract // Enterprise_PageCache_Model_Processor
{
    /**
     * Load geoip modules
     *
     * @return bool
     */
    protected function _loadGeoipModules()
    {
        $config = Mage::getConfig();
        $modulesDir = $config->getOptions()->getEtcDir() . DS . 'modules' . DS;
        $moduleFiles = array(
            $modulesDir . 'MageWorx_Adminhtml.xml',
            $modulesDir . 'MageWorx_GeoIP.xml',
            $modulesDir . 'MageWorx_StoreSwitcher.xml',
            $modulesDir . 'MageWorx_CurrencySwitcher.xml'
        );

        Varien_Profiler::start('config/load-modules-declaration');

        $unsortedConfig = new Mage_Core_Model_Config_Base();
        $unsortedConfig->loadString('<config/>');
        $fileConfig = new Mage_Core_Model_Config_Base();

        foreach ($moduleFiles as $file) {
            if(!file_exists($file)){
                continue;
            }
            $fileConfig->loadFile($file);
            $unsortedConfig->extend($fileConfig);
        }

        $config->extend($unsortedConfig);
        $config->loadModulesConfiguration(array('config.xml', 'system.xml'), $config);

        Varien_Profiler::stop('config/load-modules-declaration');

        return true;
    }

    /**
     * Return "force store veiw" config value
     *
     * @return bool
     */
    protected function _getForceStoreView()
    {
        $anyStore = Mage::getModel('core/store')->getCollection()->getFirstItem();
        $config = Mage::getModel('core/config_data')->getCollection();
        $config->getSelect()->where('path = "' . MageWorx_StoreSwitcher_Helper_Data::XML_GEOIP_FORCE_STORE_VIEW . '" AND scope_id = 0');
        if($config->getFirstItem() && $config->getFirstItem()->getConfigId()) {
            $forceStoreView = $config->getFirstItem()->getValue();
        } else {
            $forceStoreView = Mage::getStoreConfigFlag('mageworx_customers/storeswitcher/force_store_view', $anyStore->getId());
        }

        return $forceStoreView;
    }

    protected function _getConfigValue($path, $storeId = null)
    {
        $anyStore = Mage::getModel('core/store')->getCollection()->getFirstItem();
        if(is_null($storeId)){
            $storeId = $anyStore->getId();
        }

        $config = Mage::getModel('core/config_data')->getCollection();
        $config->getSelect()->where('path = "' . $path . '"');
        if($config->getFirstItem() && $config->getFirstItem()->getConfigId()) {
            $forceStoreView = $config->getFirstItem()->getValue();
        } else {
            $forceStoreView = Mage::getStoreConfigFlag('mageworx_customers/storeswitcher/force_store_view', $storeId);
        }

        return $forceStoreView;
    }

    /**
     * Populate request ids
     *
     * @return Enterprise_PageCache_Model_Processor
     */
    protected function _createRequestIds()
    {
        $this->_loadGeoipModules();

        if (!Mage::helper('mwgeoip')
            || !Mage::helper('mwgeoip')->isModuleEnabled()
            || !Mage::helper('storeswitcher')
            || !Mage::helper('storeswitcher')->isModuleEnabled()
            || !$this->_getConfigValue(MageWorx_StoreSwitcher_Helper_Data::XML_GEOIP_ENABLE_STORE_SWITCHER)
        ) {
            return parent::_createRequestIds();
        }

        $geoipStore = Mage::helper('mwgeoip')->getCookie('geoip_store_code');
        if (!$geoipStore) {
            $this->_requestCacheId = false;
            $this->_requestId = false;
            return $this;
        }

        if ($this->_getForceStoreView()) {
            Mage::helper('mwgeoip')->setCookie('store', $geoipStore, false);
        }
        if (isset($_COOKIE['currency_code'])) {
            Mage::helper('mwgeoip')->setCookie('currency', base64_decode($_COOKIE['currency_code']), false);
        }

        return parent::_createRequestIds();
    }

    public function extractContent($content)
    { 
        if(!version_compare(Mage::getVersion(), '1.10.0', '>=')){
            return false;
        }
        return parent::extractContent($content);
    }
}