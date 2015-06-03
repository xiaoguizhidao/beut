<?php

/*
 * @copyright  Copyright (c) 2011 by  ESS-UA.
 */

class Ess_M2ePro_Block_Adminhtml_Ebay_Order_View_Form extends Mage_Adminhtml_Block_Widget_Container
{
    public $shippingAddress = array();

    public $realMagentoOrderId = NULL;

    public function __construct()
    {
        parent::__construct();

        // Initialization block
        //------------------------------
        $this->setId('ebayOrderViewForm');
        $this->setTemplate('M2ePro/ebay/order.phtml');
        //------------------------------

        /** @var $order Ess_M2ePro_Model_Order */
        $this->order = Mage::helper('M2ePro')->getGlobalValue('temp_data');
    }

    protected function _beforeToHtml()
    {
        // Magento order data
        // ---------------
        $this->realMagentoOrderId = NULL;

        $magentoOrder = $this->order->getMagentoOrder();
        if (!is_null($magentoOrder)) {
            $this->realMagentoOrderId = $magentoOrder->getRealOrderId();
        }
        // ---------------

        // Shipping data
        // ---------------
        /** @var $shippingAddress Ess_M2ePro_Model_Ebay_Order_ShippingAddress */
        $shippingAddress = $this->order->getShippingAddress();

        $this->shippingAddress = $shippingAddress->getData();
        $this->shippingAddress['country_name'] = $shippingAddress->getCountryName();
        // ---------------

        $this->setChild('item', $this->getLayout()->createBlock('M2ePro/adminhtml_ebay_order_view_item'));
        $this->setChild('log', $this->getLayout()->createBlock('M2ePro/adminhtml_order_view_log'));
        $this->setChild('external_transaction', $this->getLayout()->createBlock(
            'M2ePro/adminhtml_ebay_order_view_externalTransaction'
        ));

        return parent::_beforeToHtml();
    }

    public function getTaxSuffix()
    {
        if ($this->order->getChildObject()->hasVat()) {
            return ' (' . Mage::helper('M2ePro')->__('Incl. Tax') .') ';
        } else if ($this->order->getChildObject()->hasTax()) {
            return ' (' . Mage::helper('M2ePro')->__('Excl. Tax') .') ';
        }
        return '';
    }

    public function getShippingTaxSuffix()
    {
        $ebayOrder = $this->order->getChildObject();

        if ($ebayOrder->isShippingPriceIncludesTax()) {
            return ' (' . Mage::helper('M2ePro')->__('Incl. Tax') . ') ';
        } else if ($ebayOrder->getTaxRate() > 0) {
            return ' (' . Mage::helper('M2ePro')->__('Excl. Tax') . ') ';
        }

        return '';
    }

    private function getStore()
    {
        if (is_null($this->order->getData('store_id'))) {
            return null;
        }

        try {
            $store = Mage::app()->getStore($this->order->getData('store_id'));
        } catch (Exception $e) {
            return null;
        }

        return $store;
    }

    public function isCurrencyAllowed()
    {
        $store = $this->getStore();

        if (is_null($store)) {
            return true;
        }

        /** @var $currencyHelper Ess_M2ePro_Model_Currency */
        $currencyHelper = Mage::getSingleton('M2ePro/Currency');

        return $currencyHelper->isAllowed($this->order->getChildObject()->getCurrency(), $store);
    }

    public function hasCurrencyConversionRate()
    {
        $store = $this->getStore();

        if (is_null($store)) {
            return true;
        }

        /** @var $currencyHelper Ess_M2ePro_Model_Currency */
        $currencyHelper = Mage::getSingleton('M2ePro/Currency');

        return $currencyHelper->getConvertRateFromBase($this->order->getChildObject()->getCurrency(), $store) != 0;
    }
}