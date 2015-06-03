<?php

class Extendware_EWAutoSwitcher_Block_Adminhtml_Store_Rule_Edit_Tabs extends Extendware_EWCore_Block_Mage_Adminhtml_Widget_Tabs
{

	public function __construct()
	{
		parent::__construct();
		$this->setDestElementId('edit_form');
		$this->setTitle($this->__('Store Rule'));
	}

	protected function _beforeToHtml()
	{
		$this->addTab('general', array(
			'label' => $this->__('General'),
			'content' => $this->getLayout()->createBlock('ewautoswitcher/adminhtml_store_rule_edit_tab_general')->toHtml(),
		));
		
		if ($this->getStoreRule()->hasPotentialRegions() === true) {
			$this->addTab('regions', array(
				'label' => $this->__('Regions'),
				'content' => $this->getLayout()->createBlock('ewautoswitcher/adminhtml_store_rule_edit_tab_regions')->toHtml(),
			));
		}
		
		return parent::_beforeToHtml();
	}
	
	public function getStoreRule() {
        return Mage::registry('ew:current_store_rule');
    }
}
