<?php

/*
 * @copyright  Copyright (c) 2011 by  ESS-UA.
 */

/**
 * @method Ess_M2ePro_Model_Order_Item getParentObject()
 */
class Ess_M2ePro_Model_Ebay_Order_Item extends Ess_M2ePro_Model_Component_Child_Ebay_Abstract
{
    // ->__('Product import is disabled in eBay Account settings.');
    // ->__('Data obtaining for eBay Item failed. Please try again later.');
    // ->__('Product for eBay Item #%id% was created in Magento catalog.');

    const UNPAID_ITEM_PROCESS_NOT_OPENED = 0;
    const UNPAID_ITEM_PROCESS_OPENED     = 1;

    const DISPUTE_EXPLANATION_BUYER_HAS_NOT_PAID = 'BuyerNotPaid';
    const DISPUTE_REASON_BUYER_HAS_NOT_PAID      = 'BuyerHasNotPaid';

    // ########################################

    /** @var $ebayItem Ess_M2ePro_Model_Ebay_Item */
    private $ebayItem = NULL;

    // ########################################

    public function _construct()
    {
        parent::_construct();
        $this->_init('M2ePro/Ebay_Order_Item');
    }

    // ########################################

    public function getProxy()
    {
        return Mage::getModel('M2ePro/Ebay_Order_Item_Proxy', $this);
    }

    // ########################################

    /**
     * @return Ess_M2ePro_Model_Ebay_Order
     */
    public function getEbayOrder()
    {
        return $this->getParentObject()->getOrder()->getChildObject();
    }

    public function getEbayAccount()
    {
        return $this->getEbayOrder()->getEbayAccount();
    }

    // ########################################

    public function getEbayItem()
    {
        if (is_null($this->ebayItem)) {
            $this->ebayItem = Mage::getModel('M2ePro/Ebay_Item')->load($this->getItemId(), 'item_id');
        }

        return !is_null($this->ebayItem->getId()) ? $this->ebayItem : NULL;
    }

    // ########################################

    public function getTransactionId()
    {
        return $this->getData('transaction_id');
    }

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

    public function getConditionDisplayName()
    {
        return $this->getData('condition_display_name');
    }

    public function getPrice()
    {
        return (float)$this->getData('price');
    }

    public function getBuyItNowPrice()
    {
        return (float)$this->getData('buy_it_now_price');
    }

    public function getCurrency()
    {
        return $this->getData('currency');
    }

    public function getQtyPurchased()
    {
        return (int)$this->getData('qty_purchased');
    }

    public function getVariation()
    {
        // compatibility with M2E 3.x
        // -------------
        $tempVariation = @unserialize($this->getData('variation'));
        $tempVariation === false && $tempVariation = json_decode($this->getData('variation'), true);
        $tempVariation = is_array($tempVariation) ? $tempVariation : array();
        // -------------

        return $tempVariation;
    }

    public function getAutoPay()
    {
        return (bool)$this->getData('auto_pay');
    }

    public function getListingType()
    {
        return $this->getData('listing_type');
    }

    // ########################################

    public function getAssociatedStoreId()
    {
        // Item was listed by M2E
        // ----------------
        if (!is_null($this->getEbayItem())) {
            return $this->getEbayAccount()->isMagentoOrdersListingsStoreCustom()
                ? $this->getEbayAccount()->getMagentoOrdersListingsStoreId()
                : $this->getEbayItem()->getStoreId();
        }
        // ----------------

        return $this->getEbayAccount()->getMagentoOrdersListingsOtherStoreId();
    }

    // ########################################

    public function getAssociatedProductId()
    {
        $this->validate();

        // Item was listed by M2E
        // ----------------
        if (!is_null($this->getEbayItem())) {
            return $this->getEbayItem()->getProductId();
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
                $this->associateWithProduct($product);
                return $product->getId();
            }
        }
        // ----------------

        $product = $this->createProduct();
        $this->associateWithProduct($product);

        return $product->getId();
    }

    private function validate()
    {
        $ebayItem = $this->getEbayItem();

        if (!is_null($ebayItem) && !$this->getEbayAccount()->isMagentoOrdersListingsModeEnabled()) {
            throw new Exception(
                'Magento Order creation for items listed by M2E Pro is disabled in Account settings.'
            );
        }

        if (is_null($ebayItem) && !$this->getEbayAccount()->isMagentoOrdersListingsOtherModeEnabled()) {
            throw new Exception(
                'Magento Order creation for items listed by 3rd party software is disabled in Account settings.'
            );
        }
    }

    private function createProduct()
    {
        if (!$this->getEbayAccount()->isMagentoOrdersListingsOtherProductImportEnabled()) {
            throw new Exception('Product import is disabled in Account settings.');
        }

        $order = $this->getParentObject()->getOrder();

        /** @var $itemImporter Ess_M2ePro_Model_Ebay_Order_Item_Importer */
        $itemImporter = Mage::getModel('M2ePro/Ebay_Order_Item_Importer', $this);

        $rawItemData = $itemImporter->getDataFromChannel();

        if (empty($rawItemData)) {
            throw new Exception('Data obtaining for eBay Item failed. Please try again later.');
        }

        $productData = $itemImporter->prepareDataForProductCreation($rawItemData);

        // Try to find exist product with sku from eBay
        // ----------------
        $product = Mage::getModel('catalog/product')
                ->getCollection()
                    ->addAttributeToSelect('sku')
                    ->addAttributeToFilter('sku', $productData['sku'])
                    ->getFirstItem();

        if ($product->getId()) {
            return $product;
        }
        // ----------------

        $storeId = $this->getEbayAccount()->getMagentoOrdersListingsOtherStoreId();
        if ($storeId == 0) {
            $storeId = Mage::helper('M2ePro/Magento')->getDefaultStoreId();
        }

        $productData['store_id'] = $storeId;
        $productData['tax_class_id'] = $this->getEbayAccount()->getMagentoOrdersListingsOtherProductTaxClassId();

        // Create product in magento
        // ----------------
        /** @var $productBuilder Ess_M2ePro_Model_Magento_Product_Builder */
        $productBuilder = Mage::getModel('M2ePro/Magento_Product_Builder')->setData($productData);
        $productBuilder->buildProduct();
        // ----------------

        // Create eBay item
        // ----------------
        $ebayItem = Mage::getModel('M2ePro/Ebay_Item');
        $ebayItem->setData('item_id', $this->getItemId());
        $ebayItem->setData('product_id', $productBuilder->getProduct()->getId());
        $ebayItem->setData('store_id', $storeId);
        // ----------------

        $order->addSuccessLog(
            'Product for eBay Item #%id% was created in Magento catalog.', array('!id' => $this->getItemId())
        );

        return $productBuilder->getProduct();
    }

    private function associateWithProduct(Mage_Catalog_Model_Product $product)
    {
        if (count($this->getVariation()) == 0) {
            Mage::dispatchEvent('m2epro_associate_ebay_order_item_to_product', array(
                'product_id' => $product->getId(),
                'item_id'    => $this->getItemId()
            ));
        }
    }

    // ########################################

    public function deleteInstance()
    {
        return $this->delete();
    }

    // ########################################
}