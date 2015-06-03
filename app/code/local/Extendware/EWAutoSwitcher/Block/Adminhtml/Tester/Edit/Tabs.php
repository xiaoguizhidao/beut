<?php

class Extendware_EWAutoSwitcher_Block_Adminhtml_Tester_Edit_Tabs extends Extendware_EWCore_Block_Mage_Adminhtml_Widget_Tabs
{

	public function __construct()
	{
		parent::__construct();
		$this->setDestElementId('edit_form');
		$this->setTitle($this->__('Rule Tester'));
	}

	protected function _beforeToHtml()
	{
		$this->addTab('general', array(
			'label' => $this->__('General'),
			'content' => $this->getLayout()->createBlock('ewautoswitcher/adminhtml_tester_edit_tab_general')->toHtml(),
		));
		
		return parent::_beforeToHtml();
	}
	
	public function getStoreRule() {
        return Mage::registry('ew:current_store_rule');
    }
}
