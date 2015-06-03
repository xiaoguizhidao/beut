<?php

/*
 * @copyright  Copyright (c) 2012 by  ESS-UA.
 */

class Ess_M2ePro_Model_Connector_Server_Buy_Orders_Update_Shipping
    extends Ess_M2ePro_Model_Connector_Server_Buy_Requester
{
    // ########################################

    public function getCommand()
    {
        return array('orders','update','confirmation');
    }

    // ########################################

    protected function getResponserModel()
    {
        return 'Buy_Orders_Update_ShippingResponser';
    }

    protected function getResponserParams()
    {
        $params = array();

        foreach ($this->params as $updateData) {
            $params[$updateData['order_item_id']] = array(
                'order_id'        => $updateData['order_id'],
                'tracking_type'   => $updateData['tracking_type'],
                'tracking_number' => $updateData['tracking_number']
            );
        }

        return $params;
    }

    // ########################################

    protected function setLocks($hash) {}

    // ########################################

    protected function getRequestData()
    {
        $items = array();

        foreach ($this->params as $updateData) {
            $items[] = array(
                'order_id'        => $updateData['buy_order_id'],
                'order_item_id'   => $updateData['buy_order_item_id'],
                'qty'             => $updateData['qty'],
                'tracking_type'   => $updateData['tracking_type'],
                'tracking_number' => $updateData['tracking_number'],
                'ship_date'       => $updateData['ship_date'],
            );
        }

        return array('items' => $items);
    }

    // ########################################
}