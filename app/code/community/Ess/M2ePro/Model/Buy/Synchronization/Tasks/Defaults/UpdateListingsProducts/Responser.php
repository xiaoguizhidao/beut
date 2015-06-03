<?php

/*
 * @copyright  Copyright (c) 2012 by  ESS-UA.
 */

class Ess_M2ePro_Model_Buy_Synchronization_Tasks_Defaults_UpdateListingsProducts_Responser
{
    protected $params = array();
    protected $synchronizationLog = NULL;

    /**
     * @var Ess_M2ePro_Model_Marketplace|null
     */
    protected $marketplace = NULL;

    /**
     * @var Ess_M2ePro_Model_Account|null
     */
    protected $account = NULL;

    protected $logActionId = NULL;

    // ########################################

    public function initialize(array $params = array(),
                               Ess_M2ePro_Model_Marketplace $marketplace = NULL,
                               Ess_M2ePro_Model_Account $account = NULL)
    {
        $this->params = $params;
        $this->marketplace = $marketplace;
        $this->account = $account;
    }

    // ########################################

    public function unsetLocks($hash, $fail = false, $message = NULL)
    {
        /** @var $lockItem Ess_M2ePro_Model_LockItem */
        $lockItem = Mage::getModel('M2ePro/LockItem');

        $tempNick = Ess_M2ePro_Model_Buy_Synchronization_Tasks_Defaults_UpdateListingsProducts::LOCK_ITEM_PREFIX;
        $tempNick .= '_'.$this->params['account_id'].'_'.$this->params['marketplace_id'];

        $lockItem->setNick($tempNick);
        $lockItem->remove();

        $this->getAccount()->deleteObjectLocks(NULL,$hash);
        $this->getAccount()->deleteObjectLocks('synchronization',$hash);
        $this->getAccount()->deleteObjectLocks('synchronization_buy',$hash);
        $this->getAccount()->deleteObjectLocks(
            Ess_M2ePro_Model_Buy_Synchronization_Tasks_Defaults_UpdateListingsProducts::LOCK_ITEM_PREFIX,$hash
        );

        $this->getMarketplace()->deleteObjectLocks(NULL,$hash);
        $this->getMarketplace()->deleteObjectLocks('synchronization',$hash);
        $this->getMarketplace()->deleteObjectLocks('synchronization_buy',$hash);
        $this->getMarketplace()->deleteObjectLocks(
            Ess_M2ePro_Model_Buy_Synchronization_Tasks_Defaults_UpdateListingsProducts::LOCK_ITEM_PREFIX,$hash
        );

        $fail && $this->getSynchLogModel()->addMessage(Mage::helper('M2ePro')->__($message),
                                                       Ess_M2ePro_Model_Log_Abstract::TYPE_ERROR,
                                                       Ess_M2ePro_Model_Log_Abstract::PRIORITY_HIGH);
    }

    public function processSucceededResponseData($receivedItems, $hash, $nextPart)
    {
        Mage::helper('M2ePro/Exception')->setFatalErrorHandler();

        //----------------------
        $tempItems = array();
        foreach ($receivedItems as $receivedItem) {
            if (empty($receivedItem['sku'])) {
                continue;
            }
            $tempItems[$receivedItem['sku']] = $receivedItem;
        }
        $receivedItems = $tempItems;
        unset($tempItems);
        //----------------------

        try {

            $this->processExistanceCheck($receivedItems);

            $this->updateReceivedListingsProducts($receivedItems);

        } catch (Exception $exception) {

            Mage::helper('M2ePro/Exception')->process($exception,true);

            $this->getSynchLogModel()->addMessage(Mage::helper('M2ePro')->__($exception->getMessage()),
                                                  Ess_M2ePro_Model_Log_Abstract::TYPE_ERROR,
                                                  Ess_M2ePro_Model_Log_Abstract::PRIORITY_HIGH);
        }
    }

    // ########################################

    protected function processExistanceCheck($receivedItems)
    {
        $tempGroup = '/buy/synchronization/settings/defaults/update_listings_products/';
        if (!(bool)Mage::helper('M2ePro/Module')->getConfig()->getGroupValue($tempGroup, 'existance_mode')) {
            return;
        }

        /** @var $connWrite Varien_Db_Adapter_Pdo_Mysql */
        $connWrite = Mage::getSingleton('core/resource')->getConnection('core_write');

        //----------------------
        $listingTable = Mage::getResourceModel('M2ePro/Listing')->getMainTable();
        $generalTemplateTable = Mage::getResourceModel('M2ePro/Template_General')->getMainTable();

        /** @var $collection Mage_Core_Model_Mysql4_Collection_Abstract */
        $collection = Mage::helper('M2ePro/Component_Buy')->getCollection('Listing_Product');
        $collection->getSelect()->join(array('l' => $listingTable), 'main_table.listing_id = l.id', array());
        $collection->getSelect()->join(array('gt' => $generalTemplateTable), 'l.template_general_id = gt.id', array());
        $collection->getSelect()->where('gt.marketplace_id = ?',(int)$this->getMarketplace()->getId());
        $collection->getSelect()->where('gt.account_id = ?',(int)$this->getAccount()->getId());
        $collection->getSelect()->where('main_table.status = ?',
            (int)Ess_M2ePro_Model_Listing_Product::STATUS_NOT_LISTED);
        $collection->getSelect()->where('second_table.existance_check_status = ?',
            (int)Ess_M2ePro_Model_Buy_Listing_Product::EXISTANCE_CHECK_STATUS_NONE);

        $tempColumns = array('second_table.listing_product_id','main_table.listing_id','main_table.product_id');
        $collection->getSelect()->reset(Zend_Db_Select::COLUMNS)->columns($tempColumns);
        //----------------------

        /** @var $stmtTemp Zend_Db_Statement_Pdo */
        $stmtTemp = $connWrite->query($collection->getSelect()->__toString());

        $logModel = Mage::getModel('M2ePro/Listing_Log');
        $logModel->setComponentMode(Ess_M2ePro_Helper_Component_Buy::NICK);

        while ($existingItem = $stmtTemp->fetch()) {

            $listingProductObj = Mage::helper('M2ePro/Component_Buy')->getObject(
                'Listing_Product',(int)$existingItem['listing_product_id']
            );

            $sku = $listingProductObj->getChildObject()->getAddingSku();

            if (empty($sku) || !isset($receivedItems[$sku])) {

                $newData = array(
                    'existance_check_status'
                            => Ess_M2ePro_Model_Buy_Listing_Product::EXISTANCE_CHECK_STATUS_NOT_FOUND,
                );

                $listingProductObj->addData($newData)->save();

                continue;
            }

            $newData = array(
                'sku' => $sku,
                'status' => Ess_M2ePro_Model_Listing_Product::STATUS_STOPPED,
                'existance_check_status' => Ess_M2ePro_Model_Buy_Listing_Product::EXISTANCE_CHECK_STATUS_FOUND
            );

            $listingProductObj->addData($newData)->save();

            $logModel->addProductMessage(
                $existingItem['listing_id'],
                $existingItem['product_id'],
                $existingItem['listing_product_id'],
                Ess_M2ePro_Model_Log_Abstract::INITIATOR_EXTENSION,
                $this->getLogActionId(),
                Ess_M2ePro_Model_Listing_Log::ACTION_INVENTORY_SYNCHRONIZATION,
        Mage::helper('M2ePro')->__('The product was found in your Rakuten.com inventory and linked by Reference ID.'),
                Ess_M2ePro_Model_Log_Abstract::TYPE_SUCCESS,
                Ess_M2ePro_Model_Log_Abstract::PRIORITY_MEDIUM
            );
        }
    }

    //-----------------------------------------

    protected function updateReceivedListingsProducts($receivedItems)
    {
        /** @var $stmtTemp Zend_Db_Statement_Pdo */
        $stmtTemp = $this->getPdoStatementExistingListings(true);

        $tempLog = Mage::getModel('M2ePro/Listing_Log');
        $tempLog->setComponentMode(Ess_M2ePro_Helper_Component_Buy::NICK);

        while ($existingItem = $stmtTemp->fetch()) {

            if (!isset($receivedItems[$existingItem['sku']])) {
                continue;
            }

            $receivedItem = $receivedItems[$existingItem['sku']];

            $newData = array(
                'general_id' => (int)$receivedItem['general_id'],
                'online_price' => (float)$receivedItem['price'],
                'online_qty' => (int)$receivedItem['qty'],
                'condition' => (int)$receivedItem['condition'],
                'condition_note' => (string)$receivedItem['condition_note'],
                'shipping_standard_rate' => (float)$receivedItem['shipping_standard_rate'],
                'shipping_expedited_mode' => (int)$receivedItem['shipping_expedited_mode'],
                'shipping_expedited_rate' => (float)$receivedItem['shipping_expedited_rate']
            );

            if ($newData['online_qty'] > 0) {
                $newData['status'] = Ess_M2ePro_Model_Listing_Product::STATUS_LISTED;
            } else {
                $newData['status'] = Ess_M2ePro_Model_Listing_Product::STATUS_STOPPED;
            }

            $existingData = array(
                'general_id' => (int)$existingItem['general_id'],
                'online_price' => (float)$existingItem['online_price'],
                'online_qty' => (int)$existingItem['online_qty'],
                'condition' => (int)$existingItem['condition'],
                'condition_note' => (string)$existingItem['condition_note'],
                'shipping_standard_rate' => (float)$existingItem['shipping_standard_rate'],
                'shipping_expedited_mode' => (int)$existingItem['shipping_expedited_mode'],
                'shipping_expedited_rate' => (float)$existingItem['shipping_expedited_rate'],
                'status' => (int)$existingItem['status']
            );

            if ($newData == $existingData) {
                continue;
            }

            if ($newData['online_qty'] > 0) {
                $newData['end_date'] = NULL;
            } else {
                $newData['end_date'] = Mage::helper('M2ePro')->getCurrentGmtDate();
            }

            $newData['status_changer'] = Ess_M2ePro_Model_Listing_Product::STATUS_CHANGER_COMPONENT;

            if ($newData['status'] != $existingItem['status']) {

                Mage::getModel('M2ePro/ProductChange')
                    ->updateAttribute(
                        $existingItem['product_id'], 'buy_listing_product_status',
                        'listing_product_id_'.$existingItem['listing_product_id'].'_status_'.$existingItem['status'],
                        'listing_product_id_'.$existingItem['listing_product_id'].'_status_'.$newData['status'],
                        Ess_M2ePro_Model_ProductChange::CREATOR_TYPE_SYNCHRONIZATION );

                $tempLogMessage = '';
                switch ($newData['status']) {
                    case Ess_M2ePro_Model_Listing_Product::STATUS_LISTED:
                        // Parser hack ->__('Item status was successfully changed to "Active".');
                        $tempLogMessage = 'Item status was successfully changed to "Active".';
                        break;
                    case Ess_M2ePro_Model_Listing_Product::STATUS_STOPPED:
                        // Parser hack ->__('Item status was successfully changed to "Inactive".');
                        $tempLogMessage = 'Item status was successfully changed to "Inactive".';
                        break;
                }

                $tempLog->addProductMessage(
                    $existingItem['listing_id'],
                    $existingItem['product_id'],
                    $existingItem['listing_product_id'],
                    Ess_M2ePro_Model_Log_Abstract::INITIATOR_EXTENSION,
                    $this->getLogActionId(),
                    Ess_M2ePro_Model_Listing_Log::ACTION_CHANGE_STATUS_ON_CHANNEL,
                    $tempLogMessage,
                    Ess_M2ePro_Model_Log_Abstract::TYPE_SUCCESS,
                    Ess_M2ePro_Model_Log_Abstract::PRIORITY_LOW
                );
            }

            $listingProductObj = Mage::helper('M2ePro/Component_Buy')
                                    ->getObject('Listing_Product',(int)$existingItem['listing_product_id']);

            $newData['condition_note'] == '' && $newData['condition_note'] = new Zend_Db_Expr("''");

            $listingProductObj->addData($newData)->save();
        }
    }

    // ########################################

    protected function getPdoStatementExistingListings($withData = false)
    {
        /** @var $connWrite Varien_Db_Adapter_Pdo_Mysql */
        $connWrite = Mage::getSingleton('core/resource')->getConnection('core_write');

        $listingTable = Mage::getResourceModel('M2ePro/Listing')->getMainTable();
        $generalTemplateTable = Mage::getResourceModel('M2ePro/Template_General')->getMainTable();

        /** @var $collection Varien_Data_Collection_Db */
        $collection = Mage::helper('M2ePro/Component_Buy')->getCollection('Listing_Product');
        $collection->getSelect()->join(array('l' => $listingTable), 'main_table.listing_id = l.id', array());
        $collection->getSelect()->join(array('gt' => $generalTemplateTable), 'l.template_general_id = gt.id', array());
        $collection->getSelect()->where('gt.marketplace_id = ?',(int)$this->getMarketplace()->getId());
        $collection->getSelect()->where('gt.account_id = ?',(int)$this->getAccount()->getId());
        $collection->getSelect()->where('`main_table`.`status` != ?',
            (int)Ess_M2ePro_Model_Listing_Product::STATUS_NOT_LISTED);
        $collection->getSelect()->where("`second_table`.`sku` is not null and `second_table`.`sku` != ''");

        $tempColumns = array('second_table.sku');

        if ($withData) {
            $tempColumns = array('main_table.listing_id',
                                 'main_table.product_id','main_table.status',
                                 'second_table.sku','second_table.general_id',
                                 'second_table.online_price','second_table.online_qty',
                                 'second_table.condition','second_table.condition_note',
                                 'second_table.shipping_standard_rate',
                                 'second_table.shipping_expedited_mode',
                                 'second_table.shipping_expedited_rate',
                                 'second_table.listing_product_id');
        }

        $collection->getSelect()->reset(Zend_Db_Select::COLUMNS)->columns($tempColumns);

        /** @var $stmtTemp Zend_Db_Statement_Pdo */
        $stmtTemp = $connWrite->query($collection->getSelect()->__toString());

        return $stmtTemp;
    }

    // ########################################

    /**
     * @return Ess_M2ePro_Model_Account
     */
    protected function getAccount()
    {
        return $this->account;
    }

    /**
     * @return Ess_M2ePro_Model_Marketplace
     */
    protected function getMarketplace()
    {
        return $this->marketplace;
    }

    //-----------------------------------------

    protected function getLogActionId()
    {
        if (!is_null($this->logActionId)) {
            return $this->logActionId;
        }

        return $this->logActionId = Mage::getModel('M2ePro/Listing_Log')->getNextActionId();
    }

    protected function getSynchLogModel()
    {
        if (!is_null($this->synchronizationLog)) {
            return $this->synchronizationLog;
        }

        /** @var $runs Ess_M2ePro_Model_Synchronization_Run */
        $runs = Mage::getModel('M2ePro/Synchronization_Run');
        $runs->start(Ess_M2ePro_Model_Synchronization_Run::INITIATOR_UNKNOWN);
        $runsId = $runs->getLastId();
        $runs->stop();

        /** @var $logs Ess_M2ePro_Model_Synchronization_Log */
        $logs = Mage::getModel('M2ePro/Synchronization_Log');
        $logs->setSynchronizationRun($runsId);
        $logs->setComponentMode(Ess_M2ePro_Helper_Component_Buy::NICK);
        $logs->setInitiator(Ess_M2ePro_Model_Synchronization_Run::INITIATOR_UNKNOWN);
        $logs->setSynchronizationTask(Ess_M2ePro_Model_Synchronization_Log::SYNCH_TASK_DEFAULTS);

        $this->synchronizationLog = $logs;

        return $this->synchronizationLog;
    }

    // ########################################
}