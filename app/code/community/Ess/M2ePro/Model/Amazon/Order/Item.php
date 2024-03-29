<?php

/*
 * @copyright  Copyright (c) 2011 by  ESS-UA.
 */

/**
 * @method Ess_M2ePro_Model_Order_Item getParentObject()
 */
class Ess_M2ePro_Model_Amazon_Order_Item extends Ess_M2ePro_Model_Component_Child_Amazon_Abstract
{
    // ->__('Product import is disabled in Amazon Account settings.');
    // ->__('Product for Amazon Item "%id%" was created in Magento catalog.');
    // ->__('Product for Amazon Item "%title%" was created in Magento catalog.');

    // ########################################

    /** @var $amazonItem Ess_M2ePro_Model_Amazon_Item */
    private $amazonItem = NULL;

    // ########################################

    public function _construct()
    {
        parent::_construct();
        $this->_init('M2ePro/Amazon_Order_Item');
    }

    // ########################################

    public function getProxy()
    {
        return Mage::getModel('M2ePro/Amazon_Order_Item_Proxy', $this);
    }

    // ########################################

    /**
     * @return Ess_M2ePro_Model_Amazon_Order
     */
    public function getAmazonOrder()
    {
        return $this->getParentObject()->getOrder()->getChildObject();
    }

    public function getAmazonAccount()
    {
        return $this->getAmazonOrder()->getAmazonAccount();
    }

    // ########################################

    public function getAmazonItem()
    {
        if (is_null($this->amazonItem)) {
            $this->amazonItem = Mage::getModel('M2ePro/Amazon_Item')->getCollection()
                ->addFieldToFilter('account_id', $this->getParentObject()->getOrder()->getAccountId())
                ->addFieldToFilter('marketplace_id', $this->getParentObject()->getOrder()->getMarketplaceId())
                ->addFieldToFilter('sku', $this->getSku())
                ->setOrder('create_date', Varien_Data_Collection::SORT_ORDER_DESC)
                ->getFirstItem();
        }

        return !is_null($this->amazonItem->getId()) ? $this->amazonItem : NULL;
    }

    // ########################################

    public function getItemId()
    {
        return $this->getData('item_id');
    }

    public function getTitle()
    {
        return $this->getData('title');
    }

    public function getSku()
    {
        return $this->getData('sku');
    }

    public function getGeneralId()
    {
        return $this->getData('general_id');
    }

    public function getIsIsbnGeneralId()
    {
        return (int)$this->getData('is_isbn_general_id');
    }

    public function getPrice()
    {
        return (float)$this->getData('price');
    }

    public function getGiftPrice()
    {
        return (float)$this->getData('gift_price');
    }

    public function getGiftType()
    {
        return $this->getData('gift_type');
    }

    public function getGiftMessage()
    {
        return $this->getData('gift_message');
    }

    public function getTaxAmount()
    {
        return (float)$this->getData('tax_amount');
    }

    public function getDiscountAmount()
    {
        return (float)$this->getData('discount_amount');
    }

    public function getCurrency()
    {
        return $this->getData('currency');
    }

    public function getQtyPurchased()
    {
        return (int)$this->getData('qty_purchased');
    }

    // ########################################

    public function getAssociatedStoreId()
    {
        // Item was listed by M2E
        // ----------------
        if (!is_null($this->getAmazonItem())) {
            return $this->getAmazonAccount()->isMagentoOrdersListingsStoreCustom()
                ? $this->getAmazonAccount()->getMagentoOrdersListingsStoreId()
                : $this->getAmazonItem()->getStoreId();
        }
        // ----------------

        return $this->getAmazonAccount()->getMagentoOrdersListingsOtherStoreId();
    }

    // ########################################

    public function getAssociatedProductId()
    {
        $this->validate();

        // Item was listed by M2E
        // ----------------
        if (!is_null($this->getAmazonItem())) {
            return $this->getAmazonItem()->getProductId();
        }
        // ----------------

        // 3rd party Item
        // ----------------
        $sku = $this->getSku();
        if ($sku != '' && strlen($sku) <= 64) {
            $product = Mage::getModel('catalog/product')
                ->getCollection()
                    ->addAttributeToSelect('sku')
                    ->addAttributeToFilter('sku', $sku)
                    ->getFirstItem();

            if ($product->getId()) {
                Mage::dispatchEvent('m2epro_associate_amazon_order_item_to_product', array(
                    'product_id'     => $product->getId(),
                    'sku'            => $sku,
                    'account_id'     => $this->getParentObject()->getOrder()->getAccountId(),
                    'marketplace_id' => $this->getParentObject()->getOrder()->getMarketplaceId()
                ));

                return $product->getId();
            }
        }
        // ----------------

        $product = $this->createProduct();

        Mage::dispatchEvent('m2epro_associate_amazon_order_item_to_product', array(
            'product_id'     => $product->getId(),
            'sku'            => $sku,
            'account_id'     => $this->getParentObject()->getOrder()->getAccountId(),
            'marketplace_id' => $this->getParentObject()->getOrder()->getMarketplaceId()
        ));

        return $product->getId();
    }

    private function validate()
    {
        $amazonItem = $this->getAmazonItem();

        if (!is_null($amazonItem) && !$this->getAmazonAccount()->isMagentoOrdersListingsModeEnabled()) {
            throw new Exception(
                'Magento Order creation for items listed by M2E Pro is disabled in Account settings.'
            );
        }

        if (is_null($amazonItem) && !$this->getAmazonAccount()->isMagentoOrdersListingsOtherModeEnabled()) {
            throw new Exception(
                'Magento Order creation for items listed by 3rd party software is disabled in Account settings.'
            );
        }
    }

    private function createProduct()
    {
        if (!$this->getAmazonAccount()->isMagentoOrdersListingsOtherProductImportEnabled()) {
            throw new Exception('Product import is disabled in Amazon Account settings.');
        }

        $storeId = $this->getAmazonAccount()->getMagentoOrdersListingsOtherStoreId();
        if ($storeId == 0) {
            $storeId = Mage::helper('M2ePro/Magento')->getDefaultStoreId();
        }

        $sku = $this->getSku();
        if (strlen($sku) > 64) {
            $sku = substr($sku, strlen($sku) - 64, 64);

            // Try to find exist product with truncated sku
            // ----------------
            $product = Mage::getModel('catalog/product')
                ->getCollection()
                    ->addAttributeToSelect('sku')
                    ->addAttributeToFilter('sku', $sku)
                    ->getFirstItem();

            if ($product->getId()) {
                return $product;
            }
            // ----------------
        }

        $productData = array(
            'title'             => $this->getTitle(),
            'sku'               => $sku,
            'description'       => '',
            'short_description' => '',
            'qty'               => $this->getQtyForNewProduct(),
            'price'             => $this->getPrice(),
            'store_id'          => $storeId,
            'tax_class_id'      => $this->getAmazonAccount()->getMagentoOrdersListingsOtherProductTaxClassId()
        );

        // Create product in magento
        // ----------------
        /** @var $productBuilder Ess_M2ePro_Model_Magento_Product_Builder */
        $productBuilder = Mage::getModel('M2ePro/Magento_Product_Builder')->setData($productData);
        $productBuilder->buildProduct();
        // ----------------

        $this->getParentObject()->getOrder()->addSuccessLog(
            'Product for Amazon Item "%title%" was created in Magento catalog.', array('!title' => $this->getTitle())
        );

        return $productBuilder->getProduct();
    }

    private function getQtyForNewProduct()
    {
        $otherListing = Mage::helper('M2ePro/Component_Amazon')->getCollection('Listing_Other')
            ->addFieldToFilter('account_id', $this->getParentObject()->getOrder()->getAccountId())
            ->addFieldToFilter('marketplace_id', $this->getParentObject()->getOrder()->getMarketplaceId())
            ->addFieldToFilter('sku', $this->getSku())
            ->getFirstItem();

        if ((int)$otherListing->getOnlineQty() > $this->getQtyPurchased()) {
            return $otherListing->getOnlineQty();
        }

        return $this->getQtyPurchased();
    }

    // ########################################
}