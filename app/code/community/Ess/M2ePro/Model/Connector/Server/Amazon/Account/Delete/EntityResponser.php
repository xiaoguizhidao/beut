<?php

/*
 * @copyright  Copyright (c) 2011 by  ESS-UA.
 */

class Ess_M2ePro_Model_Connector_Server_Amazon_Account_Delete_EntityResponser
    extends Ess_M2ePro_Model_Connector_Server_Amazon_Responser
{
    // ########################################

    protected function unsetLocks($isFailed = false, $message = NULL)
    {
        try {
            $this->getAccount()->deleteObjectLocks(NULL,$this->hash);
            $this->getAccount()->deleteObjectLocks('server_synchronize',$this->hash);
            $this->getAccount()->deleteObjectLocks('deleting_from_server',$this->hash);
        } catch(Exception $exception) {}
    }

    // ########################################

    protected function validateResponseData($response)
    {
        return true;
    }

    protected function processResponseData($response)
    {
        try {
            /** @var $amazonAccount Ess_M2ePro_Model_Amazon_Account */
            $amazonAccount = $this->getAccount()->getChildObject();
            $amazonAccount->deleteMarketplaceItem($this->params['marketplace_id']);
        } catch(Exception $exception) {}

        return $response;
    }

    // ########################################

    /**
     * @return Ess_M2ePro_Model_Account
     */
    protected function getAccount()
    {
        return $this->getObjectByParam('Account','account_id');
    }

    /**
     * @return Ess_M2ePro_Model_Marketplace
     */
    protected function getMarketplace()
    {
        return $this->getObjectByParam('Marketplace','marketplace_id');
    }

    // ########################################
}