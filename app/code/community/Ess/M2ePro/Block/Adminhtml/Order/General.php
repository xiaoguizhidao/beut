<?php

/*
 * @copyright  Copyright (c) 2011 by  ESS-UA.
 */

class Ess_M2ePro_Block_Adminhtml_Order_General extends Mage_Adminhtml_Block_Widget_Container
{
    private $gridIds = array();

    // ########################################

    public function __construct()
    {
        parent::__construct();

        $this->setTemplate('M2ePro/order/general.phtml');
    }

    // ########################################

    public function setGridIds(array $gridIds = array())
    {
        $this->gridIds = $gridIds;
        return $this;
    }

    public function getGridIds()
    {
        return $this->gridIds;
    }

    // ########################################
}