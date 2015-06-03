<?php

/*
 * @copyright  Copyright (c) 2011 by  ESS-UA.
 */

abstract class Ess_M2ePro_Model_Connector_Server_Amazon_Product_Requester
    extends Ess_M2ePro_Model_Connector_Server_Amazon_Requester
{
    protected $logsActionId = NULL;
    protected $neededRemoveLocks = array();

    protected $isProcessingItems = false;
    protected $status = Ess_M2ePro_Model_Amazon_Connector_Product_Requester::STATUS_SUCCESS;

    protected $listingsProducts = array();
    protected $listingProductRequestsData = array();

    // ########################################

    public function __construct(array $params = array(), array $listingsProducts)
    {
        $defaultParams = array(
            'status_changer' => Ess_M2ePro_Model_Listing_Product::STATUS_CHANGER_UNKNOWN
        );
        $params = array_merge($defaultParams, $params);

        if (isset($params['logs_action_id'])) {
            $this->logsActionId = (int)$params['logs_action_id'];
            unset($params['logs_action_id']);
        } else {
            $this->logsActionId = Mage::getModel('M2ePro/Listing_Log')->getNextActionId();
        }

        if (count($listingsProducts) == 0) {
            throw new Exception('Product connector has received empty array');
        }

        foreach($listingsProducts as $listingProduct) {
            if (!($listingProduct instanceof Ess_M2ePro_Model_Listing_Product)) {
                throw new Exception('Product connector has received invalid product data type');
            }
        }

        /** @var $generalTemplate Ess_M2ePro_Model_Template_General */
        $generalTemplate = $listingsProducts[0]->getGeneralTemplate();

        $accountObj = $generalTemplate->getAccount();
        $marketplaceObj = $generalTemplate->getMarketplace();

        foreach($listingsProducts as $listingProduct) {
            /** @var $listingProduct Ess_M2ePro_Model_Listing_Product */
            if ($accountObj->getId() != $listingProduct->getGeneralTemplate()->getAccountId()) {
                throw new Exception('Product connector has received products from different accounts');
            }
            if ($marketplaceObj->getId() != $listingProduct->getGeneralTemplate()->getMarketplaceId()) {
                throw new Exception('Product connector has received products from different marketplaces');
            }
        }

        parent::__construct($params,$marketplaceObj,$accountObj);

        $this->listingsProducts = $this->prepareListingsProducts($listingsProducts);
    }

    public function __destruct()
    {
        $this->checkUnlockListings();
    }

    // ########################################

    public function process()
    {
        $this->setStatus(Ess_M2ePro_Model_Amazon_Connector_Product_Requester::STATUS_SUCCESS);
        $this->setIsProcessingItems(false);

        if (count($this->listingsProducts) <= 0) {
            return;
        }

        $this->setIsProcessingItems(true);

        $this->updateOrLockListings();
        parent::process();
        $this->checkUnlockListings();
    }

    protected function getResponserParams()
    {
        $tempProductsData = array();

        foreach ($this->listingsProducts as $listingProduct) {

            $tempNativeData = array();
            isset($this->listingProductRequestsData[$listingProduct->getId()]['native_data']) &&
                $tempNativeData = $this->listingProductRequestsData[$listingProduct->getId()]['native_data'];

            $tempSendedData = array();
            isset($this->listingProductRequestsData[$listingProduct->getId()]['sended_data']) &&
                $tempSendedData = $this->listingProductRequestsData[$listingProduct->getId()]['sended_data'];

            $tempProductsData[$listingProduct->getId()] = array(
                'id' => $listingProduct->getId(),
                'request' => array(
                    'native_data' => $tempNativeData,
                    'sended_data' => $tempSendedData
                )
            );
        }

        $tempGeneralTemplate = $this->listingsProducts[0]->getGeneralTemplate();

        return array(
            'account_id' => $tempGeneralTemplate->getAccountId(),
            'marketplace_id' => $tempGeneralTemplate->getMarketplaceId(),
            'action_identifier' => $this->getActionIdentifier(),
            'listing_log_action' => $this->getListingsLogsCurrentAction(),
            'logs_action_id' => $this->logsActionId,
            'status_changer' => $this->params['status_changer'],
            'params' => $this->params,
            'products' => $tempProductsData
        );
    }

    protected function setLocks($hash)
    {
        $actionIdentifier = $this->getActionIdentifier();

        $tempListings = array();
        foreach ($this->listingsProducts as $listingProduct) {

            /** @var $listingProduct Ess_M2ePro_Model_Listing_Product */

            $listingProduct->addObjectLock(NULL,$hash);
            $listingProduct->addObjectLock('in_action',$hash);
            $listingProduct->addObjectLock($actionIdentifier.'_action',$hash);

            if (isset($tempListings[$listingProduct->getListingId()])) {
                continue;
            }

            $listingProduct->getListing()->addObjectLock(NULL,$hash);
            $listingProduct->getListing()->addObjectLock('products_in_action',$hash);
            $listingProduct->getListing()->addObjectLock('products_'.$actionIdentifier.'_action',$hash);

            $tempListings[$listingProduct->getListingId()] = true;
        }

        $this->account->addObjectLock('products_in_action',$hash);
        $this->account->addObjectLock('products_'.$actionIdentifier.'_action',$hash);

        $this->marketplace->addObjectLock('products_in_action',$hash);
        $this->marketplace->addObjectLock('products_'.$actionIdentifier.'_action',$hash);
    }

    // ########################################

    protected function updateOrLockListings()
    {
        foreach ($this->listingsProducts as $product) {

            /** @var $product Ess_M2ePro_Model_Listing_Product */

            if (isset($this->neededRemoveLocks[$product->getListingId()])) {
                continue;
            }

            $lockItemParams = array(
                'component' => Ess_M2ePro_Helper_Component_Amazon::NICK,
                'id' => $product->getListingId()
            );

            $lockItem = Mage::getModel('M2ePro/Listing_LockItem',$lockItemParams);

            if (!$lockItem->isExist()) {
                $lockItem->create();
                $lockItem->makeShutdownFunction();
                $this->neededRemoveLocks[$product->getListingId()] = $lockItem;
            }

            $lockItem->activate();
        }
    }

    protected function checkUnlockListings()
    {
        foreach ($this->neededRemoveLocks as $lockItem) {
            $lockItem->isExist() && $lockItem->remove();
        }
        $this->neededRemoveLocks = array();
    }

    // ########################################

    protected function addListingsProductsLogsMessage(Ess_M2ePro_Model_Listing_Product $listingProduct,
                                                      $text, $type = Ess_M2ePro_Model_Log_Abstract::TYPE_NOTICE,
                                                      $priority = Ess_M2ePro_Model_Log_Abstract::PRIORITY_MEDIUM)
    {
        $this->addBaseListingsLogsMessage($listingProduct,$text,$type,$priority,false);
    }

    protected function addListingsLogsMessage(Ess_M2ePro_Model_Listing_Product $listingProduct,
                                              $text, $type = Ess_M2ePro_Model_Log_Abstract::TYPE_NOTICE,
                                              $priority = Ess_M2ePro_Model_Log_Abstract::PRIORITY_MEDIUM)
    {
        $this->addBaseListingsLogsMessage($listingProduct,$text,$type,$priority,true);
    }

    protected function addBaseListingsLogsMessage(Ess_M2ePro_Model_Listing_Product $listingProduct,
                                                  $text, $type = Ess_M2ePro_Model_Log_Abstract::TYPE_NOTICE,
                                                  $priority = Ess_M2ePro_Model_Log_Abstract::PRIORITY_MEDIUM,
                                                  $isListingMode = true)
    {
        $action = $this->getListingsLogsCurrentAction();
        is_null($action) && $action = Ess_M2ePro_Model_Listing_Log::ACTION_UNKNOWN;

        switch ($type) {
            case Ess_M2ePro_Model_Log_Abstract::TYPE_ERROR:
                    $this->setStatus(Ess_M2ePro_Model_Amazon_Connector_Product_Requester::STATUS_ERROR);
                break;
            case Ess_M2ePro_Model_Log_Abstract::TYPE_WARNING:
                    $this->setStatus(Ess_M2ePro_Model_Amazon_Connector_Product_Requester::STATUS_WARNING);
                break;
            case Ess_M2ePro_Model_Log_Abstract::TYPE_SUCCESS:
            case Ess_M2ePro_Model_Log_Abstract::TYPE_NOTICE:
                    $this->setStatus(Ess_M2ePro_Model_Amazon_Connector_Product_Requester::STATUS_SUCCESS);
                break;
            default:
                    $this->setStatus(Ess_M2ePro_Model_Amazon_Connector_Product_Requester::STATUS_ERROR);
                break;
        }

        $initiator = Ess_M2ePro_Model_Log_Abstract::INITIATOR_UNKNOWN;
        if ($this->params['status_changer'] == Ess_M2ePro_Model_Listing_Product::STATUS_CHANGER_UNKNOWN) {
            $initiator = Ess_M2ePro_Model_Log_Abstract::INITIATOR_UNKNOWN;
        } else if ($this->params['status_changer'] == Ess_M2ePro_Model_Listing_Product::STATUS_CHANGER_USER) {
            $initiator = Ess_M2ePro_Model_Log_Abstract::INITIATOR_USER;
        } else {
            $initiator = Ess_M2ePro_Model_Log_Abstract::INITIATOR_EXTENSION;
        }

        $logModel = Mage::getModel('M2ePro/Listing_Log');
        $logModel->setComponentMode(Ess_M2ePro_Helper_Component_Amazon::NICK);

        if ($isListingMode) {
            $logModel->addListingMessage($listingProduct->getListingId() ,
                                         $initiator ,
                                         $this->logsActionId ,
                                         $action , $text, $type , $priority);
        } else {
            $logModel->addProductMessage($listingProduct->getListingId() ,
                                         $listingProduct->getProductId() ,
                                         $listingProduct->getId() ,
                                         $initiator ,
                                         $this->logsActionId ,
                                         $action , $text, $type , $priority);
        }
    }

    // ########################################

    abstract protected function getActionIdentifier();

    abstract protected function getListingsLogsCurrentAction();

    abstract protected function prepareListingsProducts($listingsProducts);

    // ########################################

    public function getStatus()
    {
        return $this->status;
    }

    protected function setStatus($status)
    {
        if (!in_array($status,array(
            Ess_M2ePro_Model_Amazon_Connector_Product_Requester::STATUS_ERROR,
            Ess_M2ePro_Model_Amazon_Connector_Product_Requester::STATUS_WARNING,
            Ess_M2ePro_Model_Amazon_Connector_Product_Requester::STATUS_SUCCESS))) {
            return;
        }

        if ($status == Ess_M2ePro_Model_Amazon_Connector_Product_Requester::STATUS_ERROR) {
            $this->status = Ess_M2ePro_Model_Amazon_Connector_Product_Requester::STATUS_ERROR;
            return;
        }

        if ($this->status == Ess_M2ePro_Model_Amazon_Connector_Product_Requester::STATUS_ERROR) {
            return;
        }

        if ($status == Ess_M2ePro_Model_Amazon_Connector_Product_Requester::STATUS_WARNING) {
            $this->status = Ess_M2ePro_Model_Amazon_Connector_Product_Requester::STATUS_WARNING;
            return;
        }

        if ($this->status == Ess_M2ePro_Model_Amazon_Connector_Product_Requester::STATUS_WARNING) {
            return;
        }

        $this->status = Ess_M2ePro_Model_Amazon_Connector_Product_Requester::STATUS_SUCCESS;
    }

    // ########################################

    public function isProcessingItems()
    {
        return (bool)$this->isProcessingItems;
    }

    protected function setIsProcessingItems($isProcessingItems)
    {
        $this->isProcessingItems = (bool)$isProcessingItems;
    }

    // ########################################
}