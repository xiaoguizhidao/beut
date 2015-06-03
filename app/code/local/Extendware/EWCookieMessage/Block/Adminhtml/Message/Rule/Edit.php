<?php

class Extendware_EWCookieMessage_Block_Adminhtml_Message_Rule_Edit extends Extendware_EWCore_Block_Mage_Adminhtml_Widget_Form_Container
{
    public function __construct()
    {
        parent::__construct();
    }

    public function getHeaderText()
    {
        return $this->__('Message Rule');
    }
}
