<?php

class Extendware_EWCookieMessage_Block_Adminhtml_Tester_Edit extends Extendware_EWCore_Block_Mage_Adminhtml_Widget_Form_Container
{
    public function __construct()
    {
        parent::__construct();
        $this->_removeButton('saveandreload');
        $this->_updateButton('save', 'label', 'View Results');
    }

    public function getHeaderText()
    {
        return $this->__('Rule Tester');
    }
}
