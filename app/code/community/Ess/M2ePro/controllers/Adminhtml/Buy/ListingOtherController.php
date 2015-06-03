<?php

/*
 * @copyright  Copyright (c) 2012 by  ESS-UA.
 */

class Ess_M2ePro_Adminhtml_Buy_ListingOtherController extends Ess_M2ePro_Controller_Adminhtml_MainController
{
    //#############################################

    protected function _initAction()
    {
        $this->loadLayout()
            ->_setActiveMenu('m2epro/listings')
            ->_title(Mage::helper('M2ePro')->__('M2E Pro'))
            ->_title(Mage::helper('M2ePro')->__('Manage Listings'))
            ->_title(Mage::helper('M2ePro')->__('3rd Party Listings'));

        return $this;
    }

    protected function _isAllowed()
    {
        return Mage::getSingleton('admin/session')->isAllowed('m2epro/listings/listing_other');
    }

    //#############################################

    public function indexAction()
    {
        if (!$this->getRequest()->isXmlHttpRequest()) {
            $this->_redirect('*/adminhtml_listingOther/index');
        }

        /** @var $block Ess_M2ePro_Block_Adminhtml_Listing_Other */
        $block = $this->loadLayout()->getLayout()->createBlock('M2ePro/adminhtml_listing_other');
        $block->enableBuyTab();

        $this->getResponse()->setBody($block->getBuyTabHtml());
    }

    public function gridAction()
    {
        $response = $this->loadLayout()->getLayout()
            ->createBlock('M2ePro/adminhtml_buy_listing_other_grid')->toHtml();
        $this->getResponse()->setBody($response);
    }

    //#############################################

    public function mapToProductAction()
    {
        $productId = $this->getRequest()->getPost('productId');
        $sku = $this->getRequest()->getPost('sku');
        $productOtherId = $this->getRequest()->getPost('otherProductId');

        if ((!$productId && !$sku) || !$productOtherId) {
            exit();
        }

        $collection = Mage::getModel('catalog/product')->getCollection()
            ->joinField('qty',
            'cataloginventory/stock_item',
            'qty',
            'product_id=entity_id',
            '{{table}}.stock_id=1',
            'left');

        $productId && $collection->addFieldToFilter('entity_id', $productId);
        $sku && $collection->addFieldToFilter('sku', $sku);

        $tempData = $collection->getSelect()->query()->fetch();
        $tempData || exit('1');

        $productId || $productId = $tempData['entity_id'];

        $productOtherInstance = Mage::helper('M2ePro/Component_Buy')
            ->getModel('Listing_Other')
            ->load($productOtherId);

        $magentoProduct = Mage::getModel('M2ePro/Magento_Product');
        $magentoProduct->setProductId($productId);

        if ($magentoProduct->isProductWithVariations()) {

            $messageString = Mage::getModel('M2ePro/Log_Abstract')->encodeDescription(
     'Item was not mapped as the chosen %id% Simple Product has Custom Options. Please, choose another Simple Product.',
                array('!id'=>$productId)
            );

            $logModel = Mage::getModel('M2ePro/Listing_Other_Log');
            $logModel->setComponentMode(Ess_M2ePro_Helper_Component_Buy::NICK);
            $logModel->addProductMessage($productOtherInstance->getId(),
                Ess_M2ePro_Model_Log_Abstract::INITIATOR_EXTENSION,
                NULL,
                Ess_M2ePro_Model_Listing_Other_Log::ACTION_MAP_LISTING,
                $messageString,
                Ess_M2ePro_Model_Log_Abstract::TYPE_ERROR,
                Ess_M2ePro_Model_Log_Abstract::PRIORITY_MEDIUM);

            exit('3');
        }

        $productOtherInstance->mapProduct($productId, Ess_M2ePro_Model_Log_Abstract::INITIATOR_USER);

        exit('0');
    }

    public function mapAutoToProductAction()
    {
        $productIds = $this->getRequest()->getParam('product_ids');

        if (empty($productIds)) {
            exit ('You should select one or more products');
        }

        $productIds = explode(',', $productIds);

        $productsForMapping = array();
        foreach ($productIds as $productId) {

            /** @var $listingOther Ess_M2ePro_Model_Listing_Other */
            $listingOther = Mage::helper('M2ePro/Component_Buy')
                ->getObject('Listing_Other',$productId);

            if ($listingOther->getProductId()) {
                continue;
            }

            $productsForMapping[] = $listingOther;
        }

        /** @var $mappingModel Ess_M2ePro_Model_Buy_Listing_Other_Mapping */
        $mappingModel = Mage::getModel('M2ePro/Buy_Listing_Other_Mapping');
        $mappingModel->initialize();

        if (!$mappingModel->autoMapOtherListingsProducts($productsForMapping)) {
            exit('1');
        }
    }

    public function unmapToProductAction()
    {
        $listingOtherProductId = $this->getRequest()->getParam('id');

        if(!$listingOtherProductId) {
            $this->_getSession()->addError(Mage::helper('M2ePro')->__('Id required.'));
            return $this->_redirect('*/adminhtml_listingOther/index/tab/buy/');
        }

        $listingOtherProductInstance = Mage::getModel('M2ePro/Listing_Other')
            ->load($listingOtherProductId);

        if(!$listingOtherProductInstance->getId()) {
            $this->_getSession()->addError(Mage::helper('M2ePro')->__('Product does not exist.'));
            return $this->_redirect('*/adminhtml_listingOther/index/tab/buy/');
        }

        if(is_null($listingOtherProductInstance->getData('product_id'))) {
            $this->_getSession()->addError(Mage::helper('M2ePro')->__('The item has not mapped product.'));
            return $this->_redirect('*/adminhtml_listingOther/index/tab/buy/');
        }

        $listingOtherProductInstance->unmapProduct(Ess_M2ePro_Model_Log_Abstract::INITIATOR_USER);

        $this->_getSession()->addSuccess(Mage::helper('M2ePro')->__('Product was successfully unmapped.'));
        return $this->_redirect('*/adminhtml_listingOther/index/tab/buy/');
    }

    //#############################################

    public function tryToMoveToListingAction()
    {
        $selectedProducts = (array)json_decode($this->getRequest()->getParam('selectedProducts'));
        $listingId = (int)$this->getRequest()->getParam('listingId');

        $listingInstance = Mage::helper('M2ePro/Component_Buy')
            ->getModel('Listing')
            ->load($listingId);

        $failedProducts = array();
        foreach ($selectedProducts as $selectedProduct) {
            $otherListingProductInstance = Mage::helper('M2ePro/Component_Buy')
                ->getModel('Listing_Other')
                ->load($selectedProduct);

            if (!$listingInstance->addProduct($otherListingProductInstance->getProductId(),true) &&
                in_array($otherListingProductInstance->getProductId(),$failedProducts) === false) {
                $failedProducts[] = $otherListingProductInstance->getProductId();
            }
        }

        count($failedProducts) == 0 && exit(json_encode(array(
            'result' => 'success'
        )));

        exit(json_encode(array(
            'result' => 'fail',
            'failed_products' => $failedProducts
        )));
    }

    public function moveToListingAction()
    {
        $selectedProducts = (array)json_decode($this->getRequest()->getParam('selectedProducts'));
        $listingId = (int)$this->getRequest()->getParam('listingId');

        $listingInstance = Mage::helper('M2ePro/Component_Buy')
            ->getModel('Listing')
            ->load($listingId);

        $otherLogModel = Mage::getModel('M2ePro/Listing_Other_Log');
        $otherLogModel->setComponentMode(Ess_M2ePro_Helper_Component_Buy::NICK);

        $listingLogModel = Mage::getModel('M2ePro/Listing_Log');
        $listingLogModel->setComponentMode(Ess_M2ePro_Helper_Component_Buy::NICK);

        $errors = 0;
        foreach ($selectedProducts as $otherListingProduct) {

            $otherListingProductInstance = Mage::helper('M2ePro/Component_Buy')
                ->getModel('Listing_Other')
                ->load($otherListingProduct);

            $listingProductInstance = $listingInstance
                ->addProduct($otherListingProductInstance->getData('product_id'));

            if (!($listingProductInstance instanceof Ess_M2ePro_Model_Listing_Product)) {

                $otherLogModel->addProductMessage(
                    $otherListingProductInstance->getId(),
                    Ess_M2ePro_Model_Log_Abstract::INITIATOR_USER,
                    NULL,
                    Ess_M2ePro_Model_Listing_Other_Log::ACTION_MOVE_LISTING,
                    // Parser hack -> Mage::helper('M2ePro')->__('Product already exists in M2E listing(s).');
                    'Product already exists in M2E listing(s).',
                    Ess_M2ePro_Model_Log_Abstract::TYPE_ERROR,
                    Ess_M2ePro_Model_Log_Abstract::PRIORITY_MEDIUM
                );

                $errors++;
                continue;
            }

            $productId = $listingProductInstance->getProductId();

            // Set listing store id to Buy Item
            //---------------------------------
            $itemsCollection = Mage::getModel('M2ePro/Buy_Item')->getCollection();
            $itemsCollection->addFieldToFilter(
                'account_id', $otherListingProductInstance->getChildObject()->getAccountId()
            );
            $itemsCollection->addFieldToFilter(
                'marketplace_id', $otherListingProductInstance->getChildObject()->getMarketplaceId()
            );
            $itemsCollection->addFieldToFilter(
                'sku', $otherListingProductInstance->getChildObject()->getSku()
            );
            $itemsCollection->addFieldToFilter(
                'product_id', $productId
            );
            if ($itemsCollection->getSize() > 0) {
                $itemsCollection->getFirstItem()->setData('store_id', $listingInstance->getStoreId())->save();
            } else {
                $dataForAdd = array(
                    'account_id' => $otherListingProductInstance->getChildObject()->getAccountId(),
                    'marketplace_id' => $otherListingProductInstance->getChildObject()->getMarketplaceId(),
                    'sku' => $otherListingProductInstance->getChildObject()->getSku(),
                    'product_id' => $productId,
                    'store_id' => $listingInstance->getStoreId()
                );
                Mage::getModel('M2ePro/Buy_Item')->setData($dataForAdd)->save();
            }
            //---------------------------------

            $dataForUpdate = array(
                'general_id' => $otherListingProductInstance->getChildObject()->getGeneralId(),
                'sku' => $otherListingProductInstance->getChildObject()->getSku(),
                'online_price' => $otherListingProductInstance->getChildObject()->getOnlinePrice(),
                'online_qty' => $otherListingProductInstance->getChildObject()->getOnlineQty(),
                'condition' => $otherListingProductInstance->getChildObject()->getCondition(),
                'condition_note' => $otherListingProductInstance->getChildObject()->getConditionNote(),
                'shipping_standard_rate'=>$otherListingProductInstance->getChildObject()->getShippingStandardRate(),
                'shipping_expedited_mode'=>$otherListingProductInstance->getChildObject()->getShippingExpeditedMode(),
                'shipping_expedited_rate'=>$otherListingProductInstance->getChildObject()->getShippingExpeditedRate(),
                'end_date' => $otherListingProductInstance->getChildObject()->getEndDate(),
                'status' => $otherListingProductInstance->getStatus(),
                'status_changer' => $otherListingProductInstance->getStatusChanger()
            );

            $listingProductInstance->addData($dataForUpdate)->save();

            $otherLogModel->addProductMessage(
                $otherListingProductInstance->getId(),
                Ess_M2ePro_Model_Log_Abstract::INITIATOR_USER,
                NULL,
                Ess_M2ePro_Model_Listing_Other_Log::ACTION_MOVE_LISTING,
                // Parser hack -> Mage::helper('M2ePro')->__('Item was successfully moved');
                'Item was successfully moved',
                Ess_M2ePro_Model_Log_Abstract::TYPE_NOTICE,
                Ess_M2ePro_Model_Log_Abstract::PRIORITY_MEDIUM
            );

            $listingLogModel->addProductMessage(
                $listingId,
                $otherListingProductInstance->getProductId(),
                $otherListingProductInstance->getId(),
                Ess_M2ePro_Model_Log_Abstract::INITIATOR_USER,
                NULL,
                Ess_M2ePro_Model_Listing_Log::ACTION_MOVE_FROM_OTHER_LISTING,
                // Parser hack -> Mage::helper('M2ePro')->__('Item was successfully moved');
                'Item was successfully moved',
                Ess_M2ePro_Model_Log_Abstract::TYPE_NOTICE,
                Ess_M2ePro_Model_Log_Abstract::PRIORITY_MEDIUM
            );

            $otherListingProductInstance->deleteInstance();
        };

        ($errors == 0)
            ? exit(json_encode(array('result'=>'success')))
            : exit(json_encode(array('result'=>'error',
            'errors'=>$errors)));
    }

    //#############################################
}
