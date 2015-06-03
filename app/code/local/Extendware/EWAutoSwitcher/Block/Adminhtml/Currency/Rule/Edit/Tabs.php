<?php

class Extendware_EWAutoSwitcher_Block_Adminhtml_Currency_Rule_Edit_Tabs extends Extendware_EWCore_Block_Mage_Adminhtml_Widget_Tabs
{

	public function __construct()
	{
		parent::__construct();
		$this->setDestElementId('edit_form');
		$this->setTitle($this->__('Currency Rule'));
	}

	protected function _beforeToHtml()
	{
		$this->addTab('general', array(
			'label' => $this->__('General'),
			'content' => $this->getLayout()->createBlock('ewautoswitcher/adminhtml_currency_rule_edit_tab_general')->toHtml(),
		));
		
		return parent::_beforeToHtml();
	}
}
