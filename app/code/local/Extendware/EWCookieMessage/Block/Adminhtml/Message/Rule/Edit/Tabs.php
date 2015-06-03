<?php

class Extendware_EWCookieMessage_Block_Adminhtml_Message_Rule_Edit_Tabs extends Extendware_EWCore_Block_Mage_Adminhtml_Widget_Tabs
{

	public function __construct()
	{
		parent::__construct();
		$this->setDestElementId('edit_form');
		$this->setTitle($this->__('Message Rule'));
	}

	protected function _beforeToHtml()
	{
		$this->addTab('general', array(
			'label' => $this->__('General'),
			'content' => $this->getLayout()->createBlock('ewcookiemessage/adminhtml_message_rule_edit_tab_general')->toHtml(),
		));
		
		if ($this->getMessageRule()->hasPotentialRegions() === true) {
			$this->addTab('regions', array(
				'label' => $this->__('Regions'),
				'content' => $this->getLayout()->createBlock('ewcookiemessage/adminhtml_message_rule_edit_tab_regions')->toHtml(),
			));
		}
		
		return parent::_beforeToHtml();
	}
	
	public function getMessageRule() {
        return Mage::registry('ew:current_message_rule');
    }
}
