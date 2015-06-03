<?php

/*
 * @copyright  Copyright (c) 2012 by  ESS-UA.
 */

class Ess_M2ePro_Model_Buy_Template_Synchronization_ProductInspector
{
    /**
     * @var Ess_M2ePro_Model_Buy_Template_Synchronization_RunnerActions
     */
    protected $_runnerActions = NULL;

    private $_checkedRelistListingsProductsIds = array();
    private $_checkedListListingsProductsIds = array();
    private $_checkedStopListingsProductsIds = array();

    private $_checkedQtyListingsProductsIds = array();
    private $_checkedPriceListingsProductsIds = array();

    //####################################

    public function __construct()
    {
        $args = func_get_args();
        empty($args[0]) && $args[0] = array();
        $params = $args[0];

        if (isset($params['runner_actions'])) {
            $this->_runnerActions = $params['runner_actions'];
        } else {
            $runnerActionsModel = Mage::getModel('M2ePro/Buy_Template_Synchronization_RunnerActions');
            $runnerActionsModel->removeAllProducts();
            $this->_runnerActions = $runnerActionsModel;
        }
    }

    //####################################

    public function processProduct(Ess_M2ePro_Model_Listing_Product $listingProduct)
    {
        $this->processProducts(array($listingProduct));
    }

    public function processProducts(array $listingsProducts = array())
    {
        $this->_runnerActions->removeAllProducts();

        foreach ($listingsProducts as $listingProduct) {

            if (!($listingProduct instanceof Ess_M2ePro_Model_Listing_Product)) {
                continue;
            }

            /** @var $listingProduct Ess_M2ePro_Model_Listing_Product */
            $this->processItem($listingProduct);
        }

        $this->_runnerActions->execute();
        $this->_runnerActions->removeAllProducts();
    }

    //-----------------------------------

    private function processItem(Ess_M2ePro_Model_Listing_Product $listingProduct)
    {
        $synchGroup = '/synchronization/settings/templates/';
        $tempGlobalMode = (bool)(int)Mage::helper('M2ePro/Module')->getConfig()
                                                                  ->getGroupValue($synchGroup,'mode');

        $buySynchGroup = '/buy/synchronization/settings/templates/';
        $tempLocalMode = (bool)(int)Mage::helper('M2ePro/Module')->getConfig()
                                                                 ->getGroupValue($buySynchGroup,'mode');

        if (!$tempGlobalMode || !$tempLocalMode) {
            return;
        }

        if ($listingProduct->isListed()) {

            $tempResult = false;

            // Check Stop Requirements
            //-------------------------------
            $buySynch = '/buy/synchronization/settings/templates/stop/';
            $stopMode = (bool)(int)Mage::helper('M2ePro/Module')->getConfig()
                                                                ->getGroupValue($buySynch,'mode');
            if ($stopMode) {
                $tempResult = $this->isMeetStopRequirements($listingProduct);
                $tempResult && $this->_runnerActions
                                    ->setProduct($listingProduct,
                                                 Ess_M2ePro_Model_Buy_Connector_Product_Dispatcher::ACTION_STOP,
                                                 array());
            }
            //-------------------------------

            // Check Revise Requirements
            //-------------------------------
            if (!$tempResult) {

                $buySynch = '/buy/synchronization/settings/templates/revise/';
                $reviseMode = (bool)(int)Mage::helper('M2ePro/Module')->getConfig()
                                                                      ->getGroupValue($buySynch,'mode');

                if ($reviseMode) {
                    $this->inspectReviseQtyRequirements($listingProduct);
                    $this->inspectRevisePriceRequirements($listingProduct);
                }
            }
            //-------------------------------

        } else {

            $buySynch = '/buy/synchronization/settings/templates/relist/';
            $relistMode = (bool)(int)Mage::helper('M2ePro/Module')->getConfig()
                                                                  ->getGroupValue($buySynch,'mode');

            if (!$relistMode) {
                return;
            }

            // Check Relist Requirements
            //-------------------------------
            $tempResult = $this->isMeetRelistRequirements($listingProduct);

            if ($tempResult && !$listingProduct->getSynchronizationTemplate()->getChildObject()->isRelistSchedule()) {

                if ($listingProduct->isStopped()) {

                    $this->_runnerActions
                         ->setProduct($listingProduct,
                                      Ess_M2ePro_Model_Buy_Connector_Product_Dispatcher::ACTION_RELIST,
                                      array());

                } else if ($listingProduct->isNotListed()) {

                    $this->_runnerActions->setProduct($listingProduct,
                                                      Ess_M2ePro_Model_Buy_Connector_Product_Dispatcher::ACTION_LIST,
                                                      array());
                }
            }
            //-------------------------------
        }
    }

    //####################################

    public function isMeetStopRequirements(Ess_M2ePro_Model_Listing_Product $listingProduct)
    {
        // Is checked before?
        //--------------------
        if (in_array($listingProduct->getId(),$this->_checkedStopListingsProductsIds)) {
            return false;
        } else {
            $this->_checkedStopListingsProductsIds[] = $listingProduct->getId();
        }
        //--------------------

        // Buy available status
        //--------------------
        if (!$listingProduct->isListed()) {
            return false;
        }

        if (!$listingProduct->isStoppable()) {
            return false;
        }

        if ($this->_runnerActions
                 ->isExistProductAction(
                        $listingProduct,
                        Ess_M2ePro_Model_Buy_Connector_Product_Dispatcher::ACTION_STOP,
                        array())
        ) {
            return false;
        }

        if ($listingProduct->isLockedObject(NULL) ||
            $listingProduct->isLockedObject('in_action')) {
           return false;
        }
        //--------------------

        // Correct synchronization
        //--------------------
        if (!$listingProduct->getListing()->isSynchronizationNowRun()) {
            return false;
        }
        //--------------------

        // Check filters
        //--------------------
        if ($listingProduct->getSynchronizationTemplate()->getChildObject()->isStopStatusDisabled()) {

            if ($listingProduct->getMagentoProduct()->getStatus() ==
                Mage_Catalog_Model_Product_Status::STATUS_DISABLED) {
                return true;
            }
        }

        if ($listingProduct->getSynchronizationTemplate()->getChildObject()->isStopOutOfStock()) {

            if (!$listingProduct->getMagentoProduct()->getStockAvailability()) {
                return true;
            }
        }

        if ($listingProduct->getSynchronizationTemplate()->getChildObject()->isStopWhenQtyHasValue()) {

            $productQty = (int)$listingProduct->getChildObject()->getQty(true);
            $buySynchronizationTemplate = $listingProduct->getSynchronizationTemplate()->getChildObject();

            $typeQty = (int)$buySynchronizationTemplate->getStopWhenQtyHasValueType();
            $minQty = (int)$buySynchronizationTemplate->getStopWhenQtyHasValueMin();
            $maxQty = (int)$buySynchronizationTemplate->getStopWhenQtyHasValueMax();

            if ($typeQty == Ess_M2ePro_Model_Buy_Template_Synchronization::STOP_QTY_LESS &&
                $productQty <= $minQty) {
                return true;
            }

            if ($typeQty == Ess_M2ePro_Model_Buy_Template_Synchronization::STOP_QTY_MORE &&
                $productQty >= $minQty) {
                return true;
            }

            if ($typeQty == Ess_M2ePro_Model_Buy_Template_Synchronization::STOP_QTY_BETWEEN &&
                $productQty >= $minQty && $productQty <= $maxQty) {
                return true;
            }
        }
        //--------------------

        return false;
    }

    public function isMeetRelistRequirements(Ess_M2ePro_Model_Listing_Product $listingProduct)
    {
        // Is checked before?
        //--------------------
        if (in_array($listingProduct->getId(),$this->_checkedRelistListingsProductsIds)) {
            return false;
        } else {
            $this->_checkedRelistListingsProductsIds[] = $listingProduct->getId();
        }
        //--------------------

        // Buy available status
        //--------------------
        if (!$listingProduct->isStopped()) {
            return false;
        }

        if (!$listingProduct->isRelistable()) {
            return false;
        }

        if ($this->_runnerActions
                 ->isExistProductAction(
                        $listingProduct,
                        Ess_M2ePro_Model_Buy_Connector_Product_Dispatcher::ACTION_RELIST,
                        array())
        ) {
            return false;
        }

        if ($listingProduct->isLockedObject(NULL) ||
            $listingProduct->isLockedObject('in_action')) {
           return false;
        }
        //--------------------

        // Correct synchronization
        //--------------------
        if (!$listingProduct->getListing()->isSynchronizationNowRun()) {
            return false;
        }

        if(!$listingProduct->getSynchronizationTemplate()->getChildObject()->isRelistMode()) {
            return false;
        }

        if ($listingProduct->getSynchronizationTemplate()->getChildObject()->isRelistFilterUserLock() &&
            $listingProduct->getStatusChanger() == Ess_M2ePro_Model_Listing_Product::STATUS_CHANGER_USER) {
            return false;
        }
        //--------------------

        // Check filters
        //--------------------
        if($listingProduct->getSynchronizationTemplate()->getChildObject()->isRelistStatusEnabled()) {

            if ($listingProduct->getMagentoProduct()->getStatus() !=
                Mage_Catalog_Model_Product_Status::STATUS_ENABLED) {
                return false;
            }
        }

        if($listingProduct->getSynchronizationTemplate()->getChildObject()->isRelistIsInStock()) {

            if (!$listingProduct->getMagentoProduct()->getStockAvailability()) {
                return false;
            }
        }

        if($listingProduct->getSynchronizationTemplate()->getChildObject()->isRelistWhenQtyHasValue()) {

            $result = false;
            $productQty = (int)$listingProduct->getChildObject()->getQty(true);

            $buySynchronizationTemplate = $listingProduct->getSynchronizationTemplate()->getChildObject();

            $typeQty = (int)$buySynchronizationTemplate->getRelistWhenQtyHasValueType();
            $minQty = (int)$buySynchronizationTemplate->getRelistWhenQtyHasValueMin();
            $maxQty = (int)$buySynchronizationTemplate->getRelistWhenQtyHasValueMax();

            if ($typeQty == Ess_M2ePro_Model_Buy_Template_Synchronization::RELIST_QTY_LESS &&
                $productQty <= $minQty) {
                $result = true;
            }

            if ($typeQty == Ess_M2ePro_Model_Buy_Template_Synchronization::RELIST_QTY_MORE &&
                $productQty >= $minQty) {
                $result = true;
            }

            if ($typeQty == Ess_M2ePro_Model_Buy_Template_Synchronization::RELIST_QTY_BETWEEN &&
                $productQty >= $minQty && $productQty <= $maxQty) {
                $result = true;
            }

            if (!$result) {
                return false;
            }
        }
        //--------------------

        return true;
    }

    public function isMeetListRequirements(Ess_M2ePro_Model_Listing_Product $listingProduct)
    {
        // Is checked before?
        //--------------------
        if (in_array($listingProduct->getId(),$this->_checkedListListingsProductsIds)) {
            return false;
        } else {
            $this->_checkedListListingsProductsIds[] = $listingProduct->getId();
        }
        //--------------------

        // Buy available status
        //--------------------
        if (!$listingProduct->isNotListed()) {
            return false;
        }

        if (!$listingProduct->isListable()) {
            return false;
        }

        if ($this->_runnerActions
                 ->isExistProductAction(
                        $listingProduct,
                        Ess_M2ePro_Model_Buy_Connector_Product_Dispatcher::ACTION_LIST,
                        array())
        ) {
            return false;
        }

        if ($listingProduct->isLockedObject(NULL) ||
            $listingProduct->isLockedObject('in_action')) {
           return false;
        }
        //--------------------

        // Correct synchronization
        //--------------------
        if (!$listingProduct->getListing()->isSynchronizationNowRun()) {
            return false;
        }

        if(!$listingProduct->getSynchronizationTemplate()->getChildObject()->isListMode()) {
            return false;
        }
        //--------------------

        // Check filters
        //--------------------
        if($listingProduct->getSynchronizationTemplate()->getChildObject()->isListStatusEnabled()) {

            if ($listingProduct->getMagentoProduct()->getStatus() !=
                Mage_Catalog_Model_Product_Status::STATUS_ENABLED) {
                return false;
            }
        }

        if($listingProduct->getSynchronizationTemplate()->getChildObject()->isListIsInStock()) {

            if (!$listingProduct->getMagentoProduct()->getStockAvailability()) {
                return false;
            }
        }

        if($listingProduct->getSynchronizationTemplate()->getChildObject()->isListWhenQtyHasValue()) {

            $result = false;
            $productQty = (int)$listingProduct->getChildObject()->getQty(true);

            $buySynchronizationTemplate = $listingProduct->getSynchronizationTemplate()->getChildObject();

            $typeQty = (int)$buySynchronizationTemplate->getListWhenQtyHasValueType();
            $minQty = (int)$buySynchronizationTemplate->getListWhenQtyHasValueMin();
            $maxQty = (int)$buySynchronizationTemplate->getListWhenQtyHasValueMax();

            if ($typeQty == Ess_M2ePro_Model_Buy_Template_Synchronization::LIST_QTY_LESS &&
                $productQty <= $minQty) {
                $result = true;
            }

            if ($typeQty == Ess_M2ePro_Model_Buy_Template_Synchronization::LIST_QTY_MORE &&
                $productQty >= $minQty) {
                $result = true;
            }

            if ($typeQty == Ess_M2ePro_Model_Buy_Template_Synchronization::LIST_QTY_BETWEEN &&
                $productQty >= $minQty && $productQty <= $maxQty) {
                $result = true;
            }

            if (!$result) {
                return false;
            }
        }
        //--------------------

        return true;
    }

    //------------------------------------

    public function inspectReviseQtyRequirements(Ess_M2ePro_Model_Listing_Product $listingProduct)
    {
        // Is checked before?
        //--------------------
        if (in_array($listingProduct->getId(),$this->_checkedQtyListingsProductsIds)) {
            return false;
        } else {
            $this->_checkedQtyListingsProductsIds[] = $listingProduct->getId();
        }
        //--------------------

        // Prepare actions params
        //--------------------
        $actionParams = array('only_data'=>array('qty'=>true));
        //--------------------

        // Buy available status
        //--------------------
        if (!$listingProduct->isListed()) {
            return false;
        }

        if (!$listingProduct->isRevisable()) {
            return false;
        }

        if ($this->_runnerActions
                 ->isExistProductAction(
                        $listingProduct,
                        Ess_M2ePro_Model_Buy_Connector_Product_Dispatcher::ACTION_REVISE,
                        $actionParams)
        ) {
            return false;
        }

        if ($listingProduct->isLockedObject(NULL) ||
            $listingProduct->isLockedObject('in_action')) {
           return false;
        }
        //--------------------

        // Correct synchronization
        //--------------------
        if (!$listingProduct->getListing()->isSynchronizationNowRun()) {
            return false;
        }
        if (!$listingProduct->getSynchronizationTemplate()->getChildObject()->isReviseWhenChangeQty()) {
            return false;
        }
        //--------------------

        // Check filters
        //--------------------
        $productQty = $listingProduct->getChildObject()->getQty();
        $channelQty = $listingProduct->getChildObject()->getOnlineQty();

        if ($productQty > 0 && $productQty != $channelQty) {
            $this->_runnerActions
                 ->setProduct(
                        $listingProduct,
                        Ess_M2ePro_Model_Buy_Connector_Product_Dispatcher::ACTION_REVISE,
                        $actionParams
                 );
            return true;
        }
        //--------------------

        return false;
    }

    public function inspectRevisePriceRequirements(Ess_M2ePro_Model_Listing_Product $listingProduct)
    {
        // Is checked before?
        //--------------------
        if (in_array($listingProduct->getId(),$this->_checkedPriceListingsProductsIds)) {
            return false;
        } else {
            $this->_checkedPriceListingsProductsIds[] = $listingProduct->getId();
        }
        //--------------------

        // Prepare actions params
        //--------------------
        $actionParams = array('only_data'=>array('price'=>true));
        //--------------------

        // Buy available status
        //--------------------
        if (!$listingProduct->isListed()) {
            return false;
        }

        if (!$listingProduct->isRevisable()) {
            return false;
        }

        if ($this->_runnerActions
                 ->isExistProductAction(
                        $listingProduct,
                        Ess_M2ePro_Model_Buy_Connector_Product_Dispatcher::ACTION_REVISE,
                        $actionParams)
        ) {
            return false;
        }

        if ($listingProduct->isLockedObject(NULL) ||
            $listingProduct->isLockedObject('in_action')) {
           return false;
        }
        //--------------------

        // Correct synchronization
        //--------------------
        if (!$listingProduct->getListing()->isSynchronizationNowRun()) {
            return false;
        }
        if (!$listingProduct->getSynchronizationTemplate()->getChildObject()->isReviseWhenChangePrice()) {
            return false;
        }
        //--------------------

        // Check filters
        //--------------------
        $currentPrice = $listingProduct->getChildObject()->getPrice();
        $onlinePrice = $listingProduct->getChildObject()->getOnlinePrice();

        if ($currentPrice != $onlinePrice) {
            $this->_runnerActions
                 ->setProduct(
                        $listingProduct,
                        Ess_M2ePro_Model_Buy_Connector_Product_Dispatcher::ACTION_REVISE,
                        $actionParams
                 );
            return true;
        }
        //--------------------

        return false;
    }

    //####################################
}