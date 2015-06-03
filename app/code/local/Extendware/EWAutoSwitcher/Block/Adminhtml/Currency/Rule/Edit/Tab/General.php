<?php
class Extendware_EWAutoSwitcher_Block_Adminhtml_Currency_Rule_Edit_Tab_General extends Extendware_EWCore_Block_Mage_Adminhtml_Widget_Form
{
    protected function _prepareForm()
    {    	
        $form = new Extendware_EWCore_Block_Varien_Data_Form();
		
        $fieldset = $form->addFieldset('main', array(
        	'legend' => $this->__('General Information'),
        ));
      	
        $fieldset->addField('status', 'select', array(
        	'name'      => 'status',
            'label'     => $this->__('Status'),
            'values'	=> $this->getCurrencyRule()->getStatusOptionModel()->toFormSelectOptionArray(),
        	'value'		=> $this->getCurrencyRule()->getStatus() ? $this->getCurrencyRule()->getStatus() : 'enabled',
            'required'  => true,
        ));
        
        $fieldset->addField('name', 'text', array(
        	'name'      => 'name',
            'label'     => $this->__('Name'),
        	'value'		=> $this->getCurrencyRule()->getName(),
        	'note'		=> $this->__('Optional name so you can remember the rule.'),
        ));
        
        $fieldset->addField('currency_code', 'select', array(
        	'name'      => 'currency_code',
            'values'   	=> Mage::getSingleton('ewautoswitcher/adminhtml_data_option_currencies')->toFormSelectOptionArray(true),
            'label'     => $this->__('Currency'),
        	'value'		=> $this->getCurrencyRule()->getCurrencyCode(),
        	'note' 		=> $this->__('Selected currency will be assigned if this store and country match.'),
            'required'  => true,
        ));
        
        $fieldset->addField('countries', 'multiselect', array(
        	'name'      => 'countries',
            'values'   	=> Mage::getSingleton('ewautoswitcher/adminhtml_data_option_countries')->toFormSelectOptionArray(),
            'label'     => $this->__('Countries'),
        	'value'		=> $this->getCurrencyRule()->getCountries(),
        	'note' 		=> $this->__('Auto-switch for users from selected countries. Ctrl-C to select more than one country. Select none to match all countries. Save to select regions if available'),
            'required'  => true,
        ));
        
        $fieldset->addField('website_id', 'select', array(
        	'name'      => 'website_id',
            'values'   	=> Mage::getSingleton('ewautoswitcher/adminhtml_data_option_websites')->toFormSelectOptionArray(true),
            'label'     => $this->__('Website'),
        	'value'		=> $this->getCurrencyRule()->getWebsiteId(),
            'note' 		=> $this->__('Website must match for autoswitch to occur. If no website is selected, then it will match all websites. <b>Leave this blank in almost all cases or it will not work</b>'),
        ));
        
        $fieldset->addField('store_id', 'select', array(
        	'name'      => 'store_id',
            'values'   	=> Mage::getSingleton('adminhtml/system_store')->getStoreValuesForForm(true),
            'label'     => $this->__('Store View'),
        	'value'		=> $this->getCurrencyRule()->getStoreId(),
            'note' 		=> $this->__('Store must match for autoswitch to occur. If no store is selected, then it will match all stores of the selected website. You must select a website if you select a store. <b>Note: </b> Most websites will never need to select a store'),
        ));
        
        if ($this->getCurrencyRule()->getId() > 0) {
	        $fieldset->addField('updated_at', 'date_label', array(
	        	'name'      => 'updated_at',
	            'label'     => $this->__('Updated'),
	        	'value' 	=> $this->getCurrencyRule()->getUpdatedAt(),
	        	'bold' 		=> true,
	        ));
	        
	        $fieldset->addField('created_at', 'date_label', array(
	        	'name'      => 'created_at',
	            'label'     => $this->__('Created'),
	        	'value' 	=> $this->getCurrencyRule()->getCreatedAt(),
	        	'bold' 		=> true,
	        ));
        }
        $form->addValues($this->getAction()->getPersistentData('form_data', true));
        $form->addFieldNameSuffix('general');
		$form->setUseContainer(false);
        $this->setForm($form);
        
		return parent::_prepareForm();
	}
    
	public function getCurrencyRule() {
        return Mage::registry('ew:current_currency_rule');
    }
}
