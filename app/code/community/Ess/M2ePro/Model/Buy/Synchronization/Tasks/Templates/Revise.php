<?php

/*
 * @copyright  Copyright (c) 2012 by  ESS-UA.
 */

class Ess_M2ePro_Model_Buy_Synchronization_Tasks_Templates_Revise
    extends Ess_M2ePro_Model_Buy_Synchronization_Tasks
{
    const PERCENTS_START = 20;
    const PERCENTS_END = 35;
    const PERCENTS_INTERVAL = 15;

    private $_synchronizations = array();

    /**
     * @var Ess_M2ePro_Model_Buy_Template_Synchronization_ProductInspector
     */
    private $_productInspector = NULL;

    //####################################

    public function __construct()
    {
        parent::__construct();

        $this->_synchronizations = Mage::helper('M2ePro')->getGlobalValue('synchTemplatesArray');

        $tempParams = array('runner_actions'=>$this->_runnerActions);
        $this->_productInspector = Mage::getModel('M2ePro/Buy_Template_Synchronization_ProductInspector',
                                                  $tempParams);
    }

    //####################################

    public function process()
    {
        // PREPARE SYNCH
        //---------------------------
        $this->prepareSynch();
        //---------------------------

        // RUN SYNCH
        //---------------------------
        $this->execute();
        //---------------------------

        // CANCEL SYNCH
        //---------------------------
        $this->cancelSynch();
        //---------------------------
    }

    //####################################

    private function prepareSynch()
    {
        $this->_lockItem->activate();

        if (count(Mage::helper('M2ePro/Component')->getActiveComponents()) > 1) {
            $componentName = Ess_M2ePro_Helper_Component_Buy::TITLE.' ';
        } else {
            $componentName = '';
        }

        $this->_profiler->addEol();
        $this->_profiler->addTitle($componentName.'Revise Actions');
        $this->_profiler->addTitle('--------------------------');
        $this->_profiler->addTimePoint(__CLASS__,'Total time');
        $this->_profiler->increaseLeftPadding(5);

        $this->_lockItem->setPercents(self::PERCENTS_START);
        $this->_lockItem->setStatus(Mage::helper('M2ePro')->__('The "Revise" action is started. Please wait...'));
    }

    private function cancelSynch()
    {
        $this->_lockItem->setPercents(self::PERCENTS_END);
        $this->_lockItem->setStatus(Mage::helper('M2ePro')->__('The "Revise" action is finished. Please wait...'));

        $this->_profiler->decreaseLeftPadding(5);
        $this->_profiler->addTitle('--------------------------');
        $this->_profiler->saveTimePoint(__CLASS__);

        $this->_lockItem->activate();
    }

    //####################################

    private function execute()
    {
        $this->executeQtyChanged();

        $this->_lockItem->setPercents(self::PERCENTS_START + 1*self::PERCENTS_INTERVAL/4);
        $this->_lockItem->activate();

        $this->executePriceChanged();

        $this->_lockItem->setPercents(self::PERCENTS_START + 2*self::PERCENTS_INTERVAL/4);
        $this->_lockItem->activate();

        //-------------------------

        $this->executeSellingFormatTemplatesChanged();

        $this->_lockItem->setPercents(self::PERCENTS_START + 3*self::PERCENTS_INTERVAL/4);
        $this->_lockItem->activate();

        $this->executeGeneralsTemplatesChanged();
    }

    //####################################

    private function executeQtyChanged()
    {
        $this->_profiler->addTimePoint(__METHOD__,'Update quantity');

        // Get changed listings products
        //------------------------------------
        $changedListingsProducts = Mage::getModel('M2ePro/Listing_Product')
            ->getChangedItemsByAttributesWithOptions(array(Ess_M2ePro_Model_ProductChange::UPDATE_ATTRIBUTE_CODE),
                                                     Ess_M2ePro_Helper_Component_Buy::NICK);
        //------------------------------------

        // Filter only needed listings products
        //------------------------------------
        foreach ($changedListingsProducts as $changedListingProduct) {

            /** @var $listingProduct Ess_M2ePro_Model_Listing_Product */

            $listingProduct = Mage::helper('M2ePro/Component_Buy')->getObject('Listing_Product',
                                                                                 $changedListingProduct['id']);

            $this->_productInspector->inspectReviseQtyRequirements($listingProduct);
        }
        //------------------------------------

        $this->_profiler->saveTimePoint(__METHOD__);
    }

    private function executePriceChanged()
    {
        $this->_profiler->addTimePoint(__METHOD__,'Update price');

        // Get changed listings products
        //------------------------------------
        $changedListingsProducts = Mage::getModel('M2ePro/Listing_Product')
            ->getChangedItemsByAttributesWithOptions(array(Ess_M2ePro_Model_ProductChange::UPDATE_ATTRIBUTE_CODE),
                                                     Ess_M2ePro_Helper_Component_Buy::NICK);
        //------------------------------------

        // Filter only needed listings products
        //------------------------------------
        foreach ($changedListingsProducts as $changedListingProduct) {

            /** @var $listingProduct Ess_M2ePro_Model_Listing_Product */

            $listingProduct = Mage::helper('M2ePro/Component_Buy')->getObject('Listing_Product',
                                                                                 $changedListingProduct['id']);

            $this->_productInspector->inspectRevisePriceRequirements($listingProduct);
        }
        //------------------------------------

        $this->_profiler->saveTimePoint(__METHOD__);
    }

    //####################################

    private function executeSellingFormatTemplatesChanged()
    {
        $this->_profiler->addTimePoint(__METHOD__,'Update Selling Format Template');

        // Get changed templates
        //------------------------------------
        $templatesCollection = Mage::helper('M2ePro/Component_Buy')->getModel('Template_SellingFormat')
                                                                      ->getCollection();
        $templatesCollection->getSelect()->where('`main_table`.`update_date` != `main_table`.`synch_date`');
        $templatesCollection->getSelect()->orWhere('`main_table`.`synch_date` IS NULL');
        $templatesArray = $templatesCollection->toArray();
        //------------------------------------

        // Set Buy actions for listed products
        //------------------------------------
        foreach ($templatesArray['items'] as $templateArray) {

            /** @var $template Ess_M2ePro_Model_Template_SellingFormat */
            $template = Mage::helper('M2ePro/Component_Buy')->getObject(
                'Template_SellingFormat',
                $templateArray['id']
            );

            $listings = $template->getListings(true);

            foreach ($listings as $listing) {

                /** @var $listing Ess_M2ePro_Model_Listing */

                if (!$listing->isSynchronizationNowRun()) {
                    continue;
                }

                $listing->setSellingFormatTemplate($template);

                if (!$listing->getSynchronizationTemplate()->isReviseSellingFormatTemplate()) {
                    continue;
                }

                $listingsProducts = $listing->getProducts(
                    true,
                    array('status'=>array('in'=>array(Ess_M2ePro_Model_Listing_Product::STATUS_LISTED)))
                );

                foreach ($listingsProducts as $listingProduct) {

                    /** @var $listingProduct Ess_M2ePro_Model_Listing_Product */

                    if (!$listingProduct->isListed()) {
                        continue;
                    }

                    if ($this->_runnerActions
                             ->isExistProductAction(
                                    $listingProduct,
                                    Ess_M2ePro_Model_Buy_Connector_Product_Dispatcher::ACTION_REVISE,
                                    array('all_data'=>true))
                    ) {
                        continue;
                    }

                    $listingProduct->setListing($listing);

                    if (!$listingProduct->isRevisable()) {
                        continue;
                    }

                    if ($listingProduct->isLockedObject(NULL) ||
                        $listingProduct->isLockedObject('in_action')) {
                        continue;
                    }

                    $this->_runnerActions
                         ->setProduct(
                                $listingProduct,
                                Ess_M2ePro_Model_Buy_Connector_Product_Dispatcher::ACTION_REVISE,
                                array('all_data'=>true)
                         );
                }
            }

            $template->addData(array('synch_date'=>$template->getData('update_date')))->save();
        }
        //------------------------------------

        $this->_profiler->saveTimePoint(__METHOD__);
    }

    private function executeGeneralsTemplatesChanged()
    {
        $this->_profiler->addTimePoint(__METHOD__,'Update general template');

        // Get changed templates
        //------------------------------------
        $templatesCollection = Mage::helper('M2ePro/Component_Buy')->getModel('Template_General')->getCollection();
        $templatesCollection->getSelect()->where('`main_table`.`update_date` != `main_table`.`synch_date`');
        $templatesCollection->getSelect()->orWhere('`main_table`.`synch_date` IS NULL');
        $templatesArray = $templatesCollection->toArray();
        //------------------------------------

        // Set Buy actions for listed products
        //------------------------------------
        foreach ($templatesArray['items'] as $templateArray) {

            /** @var $template Ess_M2ePro_Model_Template_General */
            $template = Mage::helper('M2ePro/Component_Buy')->getObject('Template_General',$templateArray['id']);

            $listings = $template->getListings(true);

            foreach ($listings as $listing) {

                /** @var $listing Ess_M2ePro_Model_Listing */

                if (!$listing->isSynchronizationNowRun()) {
                    continue;
                }

                $listing->setGeneralTemplate($template);

                if (!$listing->getSynchronizationTemplate()->isReviseGeneralTemplate()) {
                    continue;
                }

                $listingsProducts = $listing->getProducts(
                    true,
                    array('status'=>array('in'=>array(Ess_M2ePro_Model_Listing_Product::STATUS_LISTED)))
                );

                foreach ($listingsProducts as $listingProduct) {

                    /** @var $listingProduct Ess_M2ePro_Model_Listing_Product */

                    if (!$listingProduct->isListed()) {
                        continue;
                    }

                    if ($this->_runnerActions
                             ->isExistProductAction(
                                    $listingProduct,
                                    Ess_M2ePro_Model_Buy_Connector_Product_Dispatcher::ACTION_REVISE,
                                    array('all_data'=>true))
                    ) {
                        continue;
                    }

                    $listingProduct->setListing($listing);

                    if (!$listingProduct->isRevisable()) {
                        continue;
                    }

                    if ($listingProduct->isLockedObject(NULL) ||
                        $listingProduct->isLockedObject('in_action')) {
                        continue;
                    }

                    $this->_runnerActions
                         ->setProduct(
                                $listingProduct,
                                Ess_M2ePro_Model_Buy_Connector_Product_Dispatcher::ACTION_REVISE,
                                array('all_data'=>true)
                         );
                }
            }

            $template->addData(array('synch_date'=>$template->getData('update_date')))->save();
        }
        //------------------------------------

        $this->_profiler->saveTimePoint(__METHOD__);
    }

    //####################################
}