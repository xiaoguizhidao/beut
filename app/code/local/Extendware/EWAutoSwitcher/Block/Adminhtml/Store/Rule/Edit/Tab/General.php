<?php
class Extendware_EWAutoSwitcher_Block_Adminhtml_Store_Rule_Edit_Tab_General extends Extendware_EWCore_Block_Mage_Adminhtml_Widget_Form
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
            'values'	=> $this->getStoreRule()->getStatusOptionModel()->toFormSelectOptionArray(),
        	'value'		=> $this->getStoreRule()->getStatus() ? $this->getStoreRule()->getStatus() : 'enabled',
            'required'  => true,
        ));
        
        $fieldset->addField('name', 'text', array(
        	'name'      => 'name',
            'label'     => $this->__('Name'),
        	'value'		=> $this->getStoreRule()->getName(),
        	'note'		=> $this->__('Optional name so you can remember the rule.'),
        ));
        
        $fieldset->addField('store_id', 'select', array(
        	'name'      => 'store_id',
            'values'   	=> Mage::getSingleton('adminhtml/system_store')->getStoreValuesForForm(true),
            'label'     => $this->__('Store View'),
        	'value'		=> $this->getStoreRule()->getStoreId(),
        	'note'		=> $this->__('This is the store that will be selected for people from the selected countries'),
            'required'  => true,
        ));
		
        $fieldset->addField('countries', 'multiselect', array(
        	'name'      => 'countries',
            'values'   	=> Mage::getSingleton('ewautoswitcher/adminhtml_data_option_countries')->toFormSelectOptionArray(),
            'label'     => $this->__('Countries'),
        	'value'		=> $this->getStoreRule()->getCountries(),
        	'note' 		=> $this->__('Auto-switch for users from selected countries. Ctrl-C to select more than one country. Save to select regions if available'),
        ));
        
        $fieldset->addField('languages', 'textarea', array(
        	'name'      => 'languages',
            'label'     => $this->__('Languages'),
        	'value'		=> implode("\n", $this->getStoreRule()->getLanguages()),
        	'note' 		=> $this->__('In addition to geographic location, the browser must send an Accept-Language header with one of inputted languages. Enter one per line or leave empty to match any. <b>Note: </b> be careful with this setting. For advanced users only!'),
        	'ewhelp'	=> $this->__('Usually it follows the form or yy-ZZ where yy is the language and ZZ is the country. For example, US English would be "en-US". If you only wanted to match the language part (english), then you should put "en-". Some common ones are "en-" for english or "es-" for spanish. <b>Note:</b> Only advanced users should use this feature.'),
        ));
        
        $fieldset->addField('website_id', 'select', array(
        	'name'      => 'website_id',
            'values'   	=> Mage::getSingleton('ewautoswitcher/adminhtml_data_option_websites')->toFormSelectOptionArray(true),
            'label'     => $this->__('Website'),
        	'value'		=> $this->getStoreRule()->getWebsiteId(),
            'note' 		=> $this->__('Website must match for autoswitch to occur. If no website is selected, then it will match all websites. <b>Leave this blank in almost all cases or it will not work</b>'),
        ));
         
        $fieldset->addField('priority', 'text', array(
        	'name'      => 'priority',
            'label'     => $this->__('Sort Order'),
        	'value'		=> (int)$this->getStoreRule()->getPriority(),
        	'note'		=> $this->__('A rule with a lower sort will be processed first'),
        	'class'		=> 'validate-zero-or-greater',
            'required'  => true,
        ));
        
        if ($this->getStoreRule()->getId() > 0) {
	        $fieldset->addField('updated_at', 'date_label', array(
	        	'name'      => 'updated_at',
	            'label'     => $this->__('Updated'),
	        	'value' 	=> $this->getStoreRule()->getUpdatedAt(),
	        	'bold' 		=> true,
	        ));
	        
	        $fieldset->addField('created_at', 'date_label', array(
	        	'name'      => 'created_at',
	            'label'     => $this->__('Created'),
	        	'value' 	=> $this->getStoreRule()->getCreatedAt(),
	        	'bold' 		=> true,
	        ));
        }
        $form->addValues($this->getAction()->getPersistentData('form_data', true));
        $form->addFieldNameSuffix('general');
		$form->setUseContainer(false);
        $this->setForm($form);
        
		return parent::_prepareForm();
	}
    
	public function getStoreRule() {
        return Mage::registry('ew:current_store_rule');
    }
}
