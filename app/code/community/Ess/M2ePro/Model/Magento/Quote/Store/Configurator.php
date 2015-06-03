<?php

/*
 * @copyright  Copyright (c) 2011 by  ESS-UA.
 */

class Ess_M2ePro_Model_Magento_Quote_Store_Configurator
{
    /** @var $quoteBuilder Ess_M2ePro_Model_Magento_Quote */
    private $quoteBuilder = NULL;

    // ########################################

    public function __construct(Ess_M2ePro_Model_Magento_Quote $quoteBuilder)
    {
        $this->quoteBuilder = $quoteBuilder;
    }

    // ########################################

    public function getOriginalStoreConfig()
    {
        $keys = array(
            Mage_Tax_Model_Config::CONFIG_XML_PATH_PRICE_INCLUDES_TAX,
            Mage_Tax_Model_Config::CONFIG_XML_PATH_SHIPPING_INCLUDES_TAX,
            Mage_Tax_Model_Config::CONFIG_XML_PATH_SHIPPING_TAX_CLASS,
            $this->getOriginCountryIdXmlPath()
        );

        $config = array();

        foreach ($keys as $key) {
            $config[$key] = $this->getStoreConfig($key);
        }

        return $config;
    }

    // ########################################

    /**
     * Prepare store config according to channel tax information and account settings
     */
    public function prepareStoreConfigForOrder()
    {
        // catalog prices
        // --------------------
        $this->getTaxConfig()->setNeedUsePriceExcludeTax(false); // reset flag, use store config instead
        $this->setStoreConfig(Mage_Tax_Model_Config::CONFIG_XML_PATH_PRICE_INCLUDES_TAX, $this->isPriceIncludesTax());
        // --------------------

        // shipping prices
        // --------------------
        $isShippingPriceIncludesTax = $this->isShippingPriceIncludesTax();
        if (method_exists($this->getTaxConfig(), 'setShippingPriceIncludeTax')) {
            $this->getTaxConfig()->setShippingPriceIncludeTax($isShippingPriceIncludesTax);
        } else {
            $this->setStoreConfig(
                Mage_Tax_Model_Config::CONFIG_XML_PATH_SHIPPING_INCLUDES_TAX, $isShippingPriceIncludesTax
            );
        }
        // --------------------

        // store shipping tax class & origin country id
        // --------------------
        $this->setStoreConfig(
            Mage_Tax_Model_Config::CONFIG_XML_PATH_SHIPPING_TAX_CLASS, $this->getShippingTaxClassId()
        );
        $this->setStoreConfig($this->getOriginCountryIdXmlPath(), $this->getOriginCountryId());
        // --------------------
    }

    // ########################################

    /**
     * Check whether channel price should include tax
     *
     * @return bool
     */
    private function isPriceIncludesTax()
    {
        $isPriceIncludesTax = (bool)$this->getStoreConfig(Mage_Tax_Model_Config::CONFIG_XML_PATH_PRICE_INCLUDES_TAX);

        if ($this->getProxyOrder()->isTaxModeMagento()) {
            return $isPriceIncludesTax;
        }

        if ($this->getProxyOrder()->hasTax()) {
            return false;
        }

        $cacheIsProductPriceIncludesTax = Mage::helper('M2ePro/Module')
            ->getConfig()
                ->getGroupValue('/cache/order/', 'product_price_includes_tax');

        if ($cacheIsProductPriceIncludesTax) {
            return true;
        }

        if ($this->getProxyOrder()->getTaxRate() == 0 && !$isPriceIncludesTax) {
            return false;
        }

        return true;
    }

    // ########################################

    /**
     * Check whether channel shipping price should include tax
     *
     * @return bool
     */
    private function isShippingPriceIncludesTax()
    {
        $isShippingPriceIncludesTax = (bool)$this->getStoreConfig(
            Mage_Tax_Model_Config::CONFIG_XML_PATH_SHIPPING_INCLUDES_TAX
        );

        if ($this->getProxyOrder()->isTaxModeMagento()) {
            return $isShippingPriceIncludesTax;
        }

        if ($this->getProxyOrder()->getTaxRate() > 0 && !$this->getProxyOrder()->isShippingPriceIncludesTax()) {
            return false;
        }

        $cacheIsShippingPriceIncludesTax = Mage::helper('M2ePro/Module')
            ->getConfig()
                ->getGroupValue('/cache/order/', 'shipping_price_includes_tax');

        if ($cacheIsShippingPriceIncludesTax) {
            return true;
        }

        if ($this->getProxyOrder()->getTaxRate() == 0 && !$isShippingPriceIncludesTax) {
            return false;
        }

        return true;
    }

    // ########################################

    /**
     * Return tax class id for shipping
     *
     * @return int
     */
    private function getShippingTaxClassId()
    {
        $proxyOrder = $this->getProxyOrder();
        $hasRatesForCountry = Mage::getSingleton('M2ePro/Magento_Tax_Helper')->hasRatesForCountry(
            $this->quoteBuilder->getQuote()->getShippingAddress()->getCountryId()
        );

        if ($proxyOrder->isTaxModeNone()
            || ($proxyOrder->isTaxModeChannel() && $proxyOrder->getTaxRate() == 0)
            || ($proxyOrder->isTaxModeMagento() && !$hasRatesForCountry)
        ) {
            return Ess_M2ePro_Model_Magento_Product::TAX_CLASS_ID_NONE;
        }

        if ($proxyOrder->isTaxModeMagento()
            || $proxyOrder->getTaxRate() == 0
            || $proxyOrder->getTaxRate() == $this->getStoreShippingTaxRate($this->getStore())
        ) {
            return $this->getTaxConfig()->getShippingTaxClass($this->getStore());
        }

        // Create tax rule according to channel tax rate
        // -------------------------
        /** @var $taxRuleBuilder Ess_M2ePro_Model_Magento_Tax_Rule_Builder */
        $taxRuleBuilder = Mage::getModel('M2ePro/Magento_Tax_Rule_Builder');
        $taxRuleBuilder->buildTaxRule(
            $proxyOrder->getTaxRate(),
            $this->quoteBuilder->getQuote()->getShippingAddress()->getCountryId(),
            $this->quoteBuilder->getQuote()->getCustomerTaxClassId()
        );

        $taxRule = $taxRuleBuilder->getRule();
        $productTaxClasses = $taxRule->getProductTaxClasses();
        // -------------------------

        return array_shift($productTaxClasses);
    }

    // ########################################

    /**
     * Return store origin country id
     *
     * @return string
     */
    private function getOriginCountryId()
    {
        if ($this->getProxyOrder()->isTaxModeNone()) {
            return '';
        }

        $originCountryId = $this->getStoreConfig($this->getOriginCountryIdXmlPath());

        if ($this->getProxyOrder()->isTaxModeMagento()) {
            return $originCountryId;
        }

        if ($this->getProxyOrder()->isTaxModeChannel()) {

            if ($this->getProxyOrder()->getTaxRate() == 0) {
                return '';
            }

            if ($this->getTaxConfig()->shippingPriceIncludesTax($this->getStore()) &&
                $this->getProxyOrder()->getTaxRate() != $this->getStoreShippingTaxRate($this->getStore())) {
                return '';
            }

            return $originCountryId;

        }

        // Mixed tax mode

        if ($this->getProxyOrder()->getTaxRate() == 0) {
            return $originCountryId;
        }

        if ($this->getTaxConfig()->shippingPriceIncludesTax($this->getStore()) &&
            $this->getProxyOrder()->getTaxRate() != $this->getStoreShippingTaxRate($this->getStore())) {
            return '';
        }

        return $originCountryId;
    }

    // ########################################

    /**
     * Return store tax rate for shipping
     *
     * @param Mage_Core_Model_Store $store
     * @return float
     */
    public function getStoreShippingTaxRate($store)
    {
        $request = new Varien_Object();
        $request->setProductClassId($this->getTaxConfig()->getShippingTaxClass($store));

        /** @var $taxCalculator Mage_Tax_Model_Calculation */
        $taxCalculator = Mage::getSingleton('tax/calculation');

        return $taxCalculator->getStoreRate($request, $store);
    }

    // ########################################

    private function getProxyOrder()
    {
        return $this->quoteBuilder->getProxyOrder();
    }

    /**
     * Return tax config object
     *
     * @return Mage_Tax_Model_Config
     */
    private function getTaxConfig()
    {
        return Mage::getSingleton('tax/config');
    }

    /**
     * Return xml path in config for origin country id
     *
     * @return string
     */
    private function getOriginCountryIdXmlPath()
    {
        // Magento 1.4.x backward compatibility
        return defined('Mage_Shipping_Model_Config::XML_PATH_ORIGIN_COUNTRY_ID')
            ? Mage_Shipping_Model_Config::XML_PATH_ORIGIN_COUNTRY_ID
            : 'shipping/origin/country_id';
    }

    private function getStore()
    {
        return $this->quoteBuilder->getQuote()->getStore();
    }

    /**
     * Set config value for store object without saving
     *
     * @param $key
     * @param $value
     */
    private function setStoreConfig($key, $value)
    {
        $this->getStore()->setConfig($key, $value);
    }

    /**
     * Get config value from store object
     *
     * @param $key
     * @return null|string
     */
    private function getStoreConfig($key)
    {
        return $this->getStore()->getConfig($key);
    }

    // ########################################
}