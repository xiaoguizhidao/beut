<?php

/*
 * @copyright  Copyright (c) 2011 by  ESS-UA.
 */

class Ess_M2ePro_Model_Amazon_Order_Proxy extends Ess_M2ePro_Model_Order_Proxy
{
    /** @var $order Ess_M2ePro_Model_Amazon_Order */
    protected $order = NULL;

    // ########################################

    /**
     * @param Ess_M2ePro_Model_Order_Item_Proxy[] $items
     * @throws Exception
     */
    protected function mergeItems(array &$items)
    {
        foreach ($items as $key => $item) {
            if ($item->getPrice() <= 0) {
                unset($items[$key]);
            }
        }

        if (count($items) == 0) {
            throw new Exception('Every item in order has zero price.');
        }

        parent::mergeItems($items);
    }

    // ########################################

    public function getCheckoutMethod()
    {
        if ($this->order->getAmazonAccount()->isMagentoOrdersCustomerPredefined() ||
            $this->order->getAmazonAccount()->isMagentoOrdersCustomerNew()) {
            return self::CHECKOUT_REGISTER;
        }

        return self::CHECKOUT_GUEST;
    }

    public function getBuyerEmail()
    {
        return $this->order->getBuyerEmail();
    }

    public function getCustomer()
    {
        $customer = Mage::getModel('customer/customer');

        if ($this->order->getAmazonAccount()->isMagentoOrdersCustomerPredefined()) {
            $customer->load($this->order->getAmazonAccount()->getMagentoOrdersCustomerId());

            if (is_null($customer->getId())) {
                throw new Exception('Customer with ID specified in Amazon account settings does not exist.');
            }
        }

        if ($this->order->getAmazonAccount()->isMagentoOrdersCustomerNew()) {
            $customerInfo = $this->getAddressData();

            $customer->setWebsiteId($this->order->getAmazonAccount()->getMagentoOrdersCustomerNewWebsiteId());
            $customer->loadByEmail($customerInfo['email']);

            if (!is_null($customer->getId())) {
                return $customer;
            }

            $customerInfo['website_id'] = $this->order->getAmazonAccount()->getMagentoOrdersCustomerNewWebsiteId();
            $customerInfo['group_id'] = $this->order->getAmazonAccount()->getMagentoOrdersCustomerNewGroupId();
            $customerInfo['is_subscribed'] = $this->order->getAmazonAccount()->isMagentoOrdersCustomerNewSubscribed();

            /** @var $customerBuilder Ess_M2ePro_Model_Magento_Customer */
            $customerBuilder = Mage::getModel('M2ePro/Magento_Customer')->setData($customerInfo);
            $customerBuilder->buildCustomer();

            $customer = $customerBuilder->getCustomer();

            if ($this->order->getAmazonAccount()->isMagentoOrdersCustomerNewNotifyWhenCreated()) {
                $customer->sendNewAccountEmail();
            }
        }

        return $customer;
    }

    public function getCurrency()
    {
        return $this->order->getCurrency();
    }

    public function getPaymentData()
    {
        $paymentData = array(
            'method'            => Mage::getSingleton('M2ePro/Magento_Payment')->getCode(),
            'component_mode'    => Ess_M2ePro_Helper_Component_Amazon::NICK,
            'payment_method'    => '',
            'channel_order_id'  => $this->order->getAmazonOrderId(),
            'channel_final_fee' => 0,
            'transactions'      => array()
        );

        return $paymentData;
    }

    public function getShippingData()
    {
        return array(
            'shipping_method' => $this->order->getShippingService(),
            'shipping_price'  => $this->order->getShippingPrice(),
            'carrier_title'   => Mage::helper('M2ePro')->__('Amazon Shipping')
        );
    }

    // ########################################

    public function getTaxRate()
    {
        if ($this->order->getPaidAmount() == 0) {
            return 0;
        }

        $taxRate = -1 / (($this->order->getTaxAmount() / $this->order->getPaidAmount()) - 1) - 1;

        return round($taxRate * 100, 2);
    }

    public function hasVat()
    {
        return $this->order->getTaxAmount() == 0;
    }

    public function hasTax()
    {
        return $this->order->getTaxAmount() != 0;
    }

    public function isShippingPriceIncludesTax()
    {
        return $this->order->getTaxAmount() == 0;
    }

    public function isTaxModeNone()
    {
        return $this->order->getAmazonAccount()->isMagentoOrdersTaxModeNone();
    }

    public function isTaxModeMagento()
    {
        return $this->order->getAmazonAccount()->isMagentoOrdersTaxModeMagento();
    }

    public function isTaxModeChannel()
    {
        return $this->order->getAmazonAccount()->isMagentoOrdersTaxModeChannel();
    }

    // ########################################
}