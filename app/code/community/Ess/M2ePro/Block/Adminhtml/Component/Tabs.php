<?php

/*
 * @copyright  Copyright (c) 2011 by  ESS-UA.
 */

class Ess_M2ePro_Block_Adminhtml_Component_Tabs extends Mage_Adminhtml_Block_Widget_Tabs
{
    // ########################################

    public function __construct()
    {
        parent::__construct();
        $this->setTemplate('widget/tabshoriz.phtml');
    }

    // ########################################

    public function addTabAfterEbay($tabId, $tab)
    {
        return $this->addTabAfter($tabId, $tab, Ess_M2ePro_Block_Adminhtml_Component_Abstract::TAB_ID_EBAY);
    }

    public function addTabAfterAmazon($tabId, $tab)
    {
        return $this->addTabAfter($tabId, $tab, Ess_M2ePro_Block_Adminhtml_Component_Abstract::TAB_ID_AMAZON);
    }

    public function addTabAfterBuy($tabId, $tab)
    {
        return $this->addTabAfter($tabId, $tab, Ess_M2ePro_Block_Adminhtml_Component_Abstract::TAB_ID_BUY);
    }

    // ########################################
}