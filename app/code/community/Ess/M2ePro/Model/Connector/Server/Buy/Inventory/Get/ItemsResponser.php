<?php

/*
 * @copyright  Copyright (c) 2012 by  ESS-UA.
 */

class Ess_M2ePro_Model_Connector_Server_Buy_Inventory_Get_ItemsResponser
    extends Ess_M2ePro_Model_Connector_Server_Buy_Responser
{
    // ########################################

    protected function unsetLocks($fail = false, $message = NULL) {}

    // ########################################

    protected function validateResponseData($response)
    {
        if (!isset($response['data'])) {
            return false;
        }

        return true;
    }

    protected function processResponseData($response)
    {
        return $response;
    }

    // ########################################
}