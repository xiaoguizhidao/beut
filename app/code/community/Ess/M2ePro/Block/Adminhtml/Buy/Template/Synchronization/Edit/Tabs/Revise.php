<?php

/*
 * @copyright  Copyright (c) 2012 by  ESS-UA.
 */

class Ess_M2ePro_Block_Adminhtml_Buy_Template_Synchronization_Edit_Tabs_Revise extends Mage_Adminhtml_Block_Widget
{
    public function __construct()
    {
        parent::__construct();

        // Initialization block
        //------------------------------
        $this->setId('buyTemplateSynchronizationEditTabsRevise');
        //------------------------------

        $this->setTemplate('M2ePro/buy/template/synchronization/revise.phtml');
    }
}