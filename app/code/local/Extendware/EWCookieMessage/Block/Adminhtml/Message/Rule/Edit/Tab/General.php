<?php
class Extendware_EWCookieMessage_Block_Adminhtml_Message_Rule_Edit_Tab_General extends Extendware_EWCore_Block_Mage_Adminhtml_Widget_Form
{
    protected function _prepareForm()
    {    	
        $form = new Extendware_EWCore_Block_Varien_Data_Form();
		
        $fieldset = $form->addFieldset('main', array(
        	'legend' => $this->__('General Information'),
        	'class'	 => 'fieldset-wide',
        ));
      	
        $fieldset->addField('status', 'select', array(
        	'name'      => 'status',
            'label'     => $this->__('Status'),
            'values'	=> $this->getMessageRule()->getStatusOptionModel()->toFormSelectOptionArray(),
        	'value'		=> $this->getMessageRule()->getStatus() ? $this->getMessageRule()->getStatus() : 'enabled',
            'required'  => true,
        ));
        
        $fieldset->addField('name', 'text', array(
        	'name'      => 'name',
            'label'     => $this->__('Name'),
        	'value'		=> $this->getMessageRule()->getName(),
        	'note' 		=> $this->__('The name of this message.'),
        	'required' 	=> true,
        ));
        
        $fieldset->addField('message', 'textarea', array(
        	'name'      => 'message',
            'label'     => $this->__('Message'),
        	'value'		=> $this->getMessageRule()->getMessage(),
        	'note' 		=> $this->__('This is the message that will be inserted into the web page.'),
        ));
        
        $fieldset->addField('element_selector', 'text', array(
        	'name'      => 'element_selector',
            'label'     => $this->__('Element Selector'),
        	'value'		=> $this->getMessageRule()->getElementSelector() ? $this->getMessageRule()->getElementSelector() : 'body',
        	'note' 		=> $this->__('The CSS selector used by $$([selector]).first() that is used to find the position where the message will be inserted in the page.'),
        	'required' 	=> true,
        ));
        
        $fieldset->addField('insertion_position', 'select', array(
        	'name'      => 'insertion_position',
            'label'     => $this->__('Insertion Position'),
        	'values'	=> $this->getMessageRule()->getInsertionPositionOptionModel()->toFormSelectOptionArray(),
        	'value'		=> $this->getMessageRule()->getInsertionPosition() ? $this->getMessageRule()->getInsertionPosition() : 'top',
        	'note' 		=> $this->__('Where the position will be inserted in relation to the element.'),
        	'required' 	=> true,
        ));
        
    	$fieldset->addField('priority', 'text', array(
        	'name'      => 'priority',
            'label'     => $this->__('Sort Order'),
        	'value'		=> (int)$this->getMessageRule()->getPriority(),
        	'note'		=> $this->__('A rule with a lower sort order will be processed first'),
        	'class'		=> 'validate-zero-or-greater',
            'required'  => true,
        ));
        
        if ($this->getMessageRule()->getId() > 0) {
	        $fieldset->addField('updated_at', 'date_label', array(
	        	'name'      => 'updated_at',
	            'label'     => $this->__('Updated'),
	        	'value' 	=> $this->getMessageRule()->getUpdatedAt(),
	        	'bold' 		=> true,
	        ));
	        
	        $fieldset->addField('created_at', 'date_label', array(
	        	'name'      => 'created_at',
	            'label'     => $this->__('Created'),
	        	'value' 	=> $this->getMessageRule()->getCreatedAt(),
	        	'bold' 		=> true,
	        ));
        }
        
        $fieldset = $form->addFieldset('conditions', array(
        	'legend' => $this->__('Condition Information'),
        ));
        
        $fieldset->addField('js_condition', 'text', array(
        	'name'      => 'js_condition',
            'label'     => $this->__('Js Condition'),
        	'value'		=> $this->getMessageRule()->getJsCondition(),
        	'note' 		=> $this->__('Most often used to hide the message if a cookie is set. This will be directly outputted inside of a javascript if statement, so you must input valid javascript. '),
        ));
        
        $fieldset->addField('website_id', 'select', array(
        	'name'      => 'website_id',
            'values'   	=> Mage::getSingleton('ewcookiemessage/adminhtml_data_option_websites')->toFormSelectOptionArray(true),
            'label'     => $this->__('Website'),
        	'value'		=> $this->getMessageRule()->getWebsiteId(),
            'note' 		=> $this->__('This message will only be shown for this Web site'),
        ));
         
        $fieldset->addField('store_id', 'select', array(
        	'name'      => 'store_id',
            'values'   	=> Mage::getSingleton('adminhtml/system_store')->getStoreValuesForForm(true),
            'label'     => $this->__('Store View'),
        	'value'		=> $this->getMessageRule()->getStoreId(),
        	'note'		=> $this->__('This message will only be used for this store view'),
        ));
		
        $fieldset->addField('countries', 'multiselect', array(
        	'name'      => 'countries',
            'values'   	=> Mage::getSingleton('ewcookiemessage/adminhtml_data_option_countries')->toFormSelectOptionArray(),
            'label'     => $this->__('Countries'),
        	'value'		=> $this->getMessageRule()->getCountries(),
        	'note' 		=> $this->__('Show message for users from selected countries. Ctrl-C to select more than one country. Selecting no countries will match all countries. <b>Note: </b> after saving you may select regions if available.'),
        ));
        
        $fieldset = $form->addFieldset('advanced', array(
        	'legend' => $this->__('Advanced Information'),
        ));
        
        $fieldset->addField('js', 'textarea', array(
        	'name'      => 'js',
            'label'     => $this->__('Javascript'),
        	'value'		=> $this->getMessageRule()->getJs(),
        	'note' 		=> $this->__('If the message is executable, then this javascript will also execute. Useful for creation of popups and things to that nature. You can leave this field empty if you just need a simple message.'),
        ));
        
        $fieldset->addField('library_js', 'textarea', array(
        	'name'      => 'library_js',
            'label'     => $this->__('Library Javascript'),
        	'value'		=> $this->getMessageRule()->getLibraryJs(),
        	'note' 		=> $this->__('This javascript is executed even if the message does not match. This is useful for including any helper functions you need. You can leave this field empty if you just need a simple message.'),
        ));
        
        $form->addValues($this->getAction()->getPersistentData('form_data', true));
        $form->addFieldNameSuffix('general');
		$form->setUseContainer(false);
        $this->setForm($form);
        
		return parent::_prepareForm();
	}
    
	public function getMessageRule() {
        return Mage::registry('ew:current_message_rule');
    }
}
