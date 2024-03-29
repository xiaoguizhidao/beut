<?php

/*
 * @copyright  Copyright (c) 2011 by  ESS-UA.
 */

class Ess_M2ePro_Model_Buy_Order_Proxy extends Ess_M2ePro_Model_Order_Proxy
{
    /** @var $order Ess_M2ePro_Model_Buy_Order */
    protected $order = NULL;

    // ########################################

    public function getCheckoutMethod()
    {
        if ($this->order->getBuyAccount()->isMagentoOrdersCustomerPredefined() ||
            $this->order->getBuyAccount()->isMagentoOrdersCustomerNew()) {
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
        /** @var $customer Mage_Customer_Model_Customer */
        $customer = Mage::getModel('customer/customer');

        if ($this->order->getBuyAccount()->isMagentoOrdersCustomerPredefined()) {
            $customer->load($this->order->getBuyAccount()->getMagentoOrdersCustomerId());

            if (is_null($customer->getId())) {
                throw new Exception('Customer with ID specified in Rakuten.com account settings does not exist.');
            }
        }

        if ($this->order->getBuyAccount()->isMagentoOrdersCustomerNew()) {
            $customerInfo = $this->getAddressData();

            $customer->setWebsiteId($this->order->getBuyAccount()->getMagentoOrdersCustomerNewWebsiteId());
            $customer->loadByEmail($customerInfo['email']);

            if (!is_null($customer->getId())) {
                return $customer;
            }

            $customerInfo['website_id'] = $this->order->getBuyAccount()->getMagentoOrdersCustomerNewWebsiteId();
            $customerInfo['group_id'] = $this->order->getBuyAccount()->getMagentoOrdersCustomerNewGroupId();
            $customerInfo['is_subscribed'] = $this->order->getBuyAccount()->isMagentoOrdersCustomerNewSubscribed();

            /** @var $customerBuilder Ess_M2ePro_Model_Magento_Customer */
            $customerBuilder = Mage::getModel('M2ePro/Magento_Customer')->setData($customerInfo);
            $customerBuilder->buildCustomer();

            $customer = $customerBuilder->getCustomer();

            if ($this->order->getBuyAccount()->isMagentoOrdersCustomerNewNotifyWhenCreated()) {
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
            'component_mode'    => Ess_M2ePro_Helper_Component_Buy::NICK,
            'payment_method'    => '',
            'channel_order_id'  => $this->order->getBuyOrderId(),
            'channel_final_fee' => 0, // todo
            'transactions'      => array()
        );

        return $paymentData;
    }

    public function getShippingData()
    {
        return array(
            'shipping_method' => $this->order->getShippingMethod(),
            'shipping_price'  => $this->order->getShippingPrice(),
            'carrier_title'   => Mage::helper('M2ePro')->__('Rakuten.com Shipping')
        );
    }

    // ########################################

    public function getTaxRate()
    {
        return 0; // todo
    }

    public function hasVat()
    {
        return false; // todo
    }

    public function hasTax()
    {
        return false; // todo
    }

    public function isShippingPriceIncludesTax()
    {
        return false; // todo
    }

    public function isTaxModeNone()
    {
        return $this->order->getBuyAccount()->isMagentoOrdersTaxModeNone();
    }

    public function isTaxModeChannel()
    {
        return $this->order->getBuyAccount()->isMagentoOrdersTaxModeChannel();
    }

    public function isTaxModeMagento()
    {
        return $this->order->getBuyAccount()->isMagentoOrdersTaxModeMagento();
    }

    // ########################################
}