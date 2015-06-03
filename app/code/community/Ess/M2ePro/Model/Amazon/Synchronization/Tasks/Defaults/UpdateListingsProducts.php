<?php

/*
 * @copyright  Copyright (c) 2011 by  ESS-UA.
 */

class Ess_M2ePro_Model_Amazon_Synchronization_Tasks_Defaults_UpdateListingsProducts
    extends Ess_M2ePro_Model_Amazon_Synchronization_Tasks
{
    const PERCENTS_START = 0;
    const PERCENTS_END = 100;
    const PERCENTS_INTERVAL = 100;

    const INTERVAL_COEFFICIENT_VALUE = 50000;

    const LOCK_ITEM_PREFIX = 'synchronization_amazon_default_update_listings_products';

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
            $componentName = Ess_M2ePro_Helper_Component_Amazon::TITLE.' ';
        } else {
            $componentName = '';
        }

        $this->_profiler->addEol();
        $this->_profiler->addTitle($componentName.'Update Listings Products');
        $this->_profiler->addTitle('--------------------------');
        $this->_profiler->addTimePoint(__CLASS__,'Total time');
        $this->_profiler->increaseLeftPadding(5);

        $this->_lockItem->setPercents(self::PERCENTS_START);
        $this->_lockItem->setStatus(
            Mage::helper('M2ePro')->__('Task "Update Listings Products" is started. Please wait...')
        );
    }

    private function cancelSynch()
    {
        $this->_lockItem->setPercents(self::PERCENTS_END);
        $this->_lockItem->setStatus(
            Mage::helper('M2ePro')->__('Task "Update Listings Products" is finished. Please wait...')
        );

        $this->_profiler->decreaseLeftPadding(5);
        $this->_profiler->addTitle('--------------------------');
        $this->_profiler->saveTimePoint(__CLASS__);

        $this->_lockItem->activate();
    }

    //####################################

    private function execute()
    {
        // Prepare last time
        $this->prepareLastTime();

        // Check locked last time
        if ($this->isLockedLastTime() &&
            $this->_initiator != Ess_M2ePro_Model_Synchronization_Run::INITIATOR_USER &&
            $this->_initiator != Ess_M2ePro_Model_Synchronization_Run::INITIATOR_DEVELOPER) {
            return;
        }

        /** @var $accountsCollection Mage_Core_Model_Mysql4_Collection_Abstract */
        $accountsCollection = Mage::helper('M2ePro/Component_Amazon')->getCollection('Account');
        $accountsTotalCount = $accountsCollection->getSize();

        $accountIteration = 1;
        $percentsForAccount = self::PERCENTS_INTERVAL;

        if ($accountsTotalCount > 0) {
            $percentsForAccount = self::PERCENTS_INTERVAL/(int)$accountsCollection->getSize();
        }

        foreach ($accountsCollection->getItems() as $accountObj) {

            /** @var $accountObj Ess_M2ePro_Model_Account */

            $marketplaces = $accountObj->getChildObject()->getMarketplacesItems();

            foreach ($marketplaces as $marketplace) {

                $marketplaceObj = $marketplace['object'];

                if (!$this->isLockedAccountMarketplace($accountObj->getId(),$marketplaceObj->getId())) {

                    /** @var $collection Mage_Core_Model_Mysql4_Collection_Abstract */
                    $collection = Mage::getModel('M2ePro/Template_General')->getCollection();
                    $collection->addFieldToFilter('component_mode',Ess_M2ePro_Helper_Component_Amazon::NICK);
                    $collection->addFieldToFilter('marketplace_id',(int)$marketplaceObj->getId());
                    $collection->addFieldToFilter('account_id',(int)$accountObj->getId());

                    if ($collection->getSize()) {
                        $this->updateAccountMarketplace($accountObj,$marketplaceObj);
                    }
                }
            }

            $this->_lockItem->setPercents(self::PERCENTS_START + $percentsForAccount*$accountIteration);
            $this->_lockItem->activate();
            $accountIteration++;
        }

        $this->setCheckLastTime(Mage::helper('M2ePro')->getCurrentGmtDate(true));
    }

    private function updateAccountMarketplace(Ess_M2ePro_Model_Account $accountObj,
                                              Ess_M2ePro_Model_Marketplace $marketplaceObj)
    {
        $this->_profiler->addTitle(
            'Starting account "'.$accountObj->getTitle().'" and marketplace "'.$marketplaceObj->getTitle().'"'
        );
        $this->_profiler->addTimePoint(__METHOD__.'send'.$accountObj->getId(),'Get inventory from Amazon');

        $status = 'Task "Update Listings Products" for Amazon account: "%s" and marketplace "%s" ';
        $status .= 'is started. Please wait...';

        $this->_lockItem->setStatus(Mage::helper('M2ePro')->__(
            $status,
            $accountObj->getTitle(),
            Mage::helper('M2ePro')->__($marketplaceObj->getTitle()))
        );

        // Get all changes on Amazon for account
        //---------------------------
        $dispatcherObject = Mage::getModel('M2ePro/Amazon_Connector')->getDispatcher();
        $dispatcherObject->processConnector('defaults', 'updateListingsProducts' ,'requester',
                                            array(), $marketplaceObj, $accountObj,
                                            'Ess_M2ePro_Model_Amazon_Synchronization_Tasks');
        //---------------------------

        $this->_profiler->saveTimePoint(__METHOD__.'send'.$accountObj->getId());
        $this->_profiler->addEol();
    }

    //####################################

    private function prepareLastTime()
    {
        $lastTime = $this->getCheckLastTime();
        if (empty($lastTime)) {
            $lastTime = new DateTime('now', new DateTimeZone('UTC'));
            $lastTime->modify("-1 year");
            $this->setCheckLastTime($lastTime);
        }
    }

    private function isLockedLastTime()
    {
        $lastTime = strtotime($this->getCheckLastTime());

        $tempGroup = '/amazon/synchronization/settings/defaults/update_listings_products/';
        $interval = (int)Mage::helper('M2ePro/Module')->getConfig()->getGroupValue($tempGroup,'interval');

        $totalItems = (int)Mage::helper('M2ePro/Component_Amazon')->getCollection('Listing_Product')->getSize();
        $totalItems += (int)Mage::helper('M2ePro/Component_Amazon')->getCollection('Listing_Other')->getSize();
        $intervalCoefficient = ($totalItems > 0) ? (int)ceil($totalItems/self::INTERVAL_COEFFICIENT_VALUE) : 1;

        if ($lastTime + ($interval*$intervalCoefficient) > Mage::helper('M2ePro')->getCurrentGmtDate(true)) {
            return true;
        }

        return false;
    }

    private function getCheckLastTime()
    {
        $tempGroup = '/amazon/synchronization/settings/defaults/update_listings_products/';
        return Mage::helper('M2ePro/Module')->getConfig()->getGroupValue($tempGroup,'last_time');
    }

    private function setCheckLastTime($time)
    {
        if ($time instanceof DateTime) {
            $time = (int)$time->format('U');
        }
        if (is_int($time)) {
            $time = strftime("%Y-%m-%d %H:%M:%S", $time);
        }
        $tempGroup = '/amazon/synchronization/settings/defaults/update_listings_products/';
        Mage::helper('M2ePro/Module')->getConfig()->setGroupValue($tempGroup,'last_time',$time);
    }

    //------------------------------------

    private function isLockedAccountMarketplace($accountId, $marketplaceId)
    {
        /** @var $lockItem Ess_M2ePro_Model_LockItem */
        $lockItem = Mage::getModel('M2ePro/LockItem');
        $lockItem->setNick(self::LOCK_ITEM_PREFIX.'_'.$accountId.'_'.$marketplaceId);

        $tempGroup = '/amazon/synchronization/settings/defaults/update_listings_products/';
        $maxDeactivateTime = (int)Mage::helper('M2ePro/Module')->getConfig()
                                    ->getGroupValue($tempGroup,'max_deactivate_time');
        $lockItem->setMaxDeactivateTime($maxDeactivateTime);

        if ($lockItem->isExist()) {
            return true;
        }

        return false;
    }

    //####################################
}