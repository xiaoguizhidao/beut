<?php

/*
 * @copyright  Copyright (c) 2011 by  ESS-UA.
 */

class Ess_M2ePro_Block_Adminhtml_Ebay_Template_Synchronization_Edit_Tabs_List extends Mage_Adminhtml_Block_Widget
{
    // ####################################

    public function __construct()
    {
        parent::__construct();

        // Initialization block
        //------------------------------
        $this->setId('ebayTemplateSynchronizationEditTabsList');
        //------------------------------

        $this->setTemplate('M2ePro/ebay/template/synchronization/list.phtml');
    }

    // ####################################
}