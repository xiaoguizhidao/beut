<?php
class Extendware_EWCookieMessage_Block_Adminhtml_Tester_Edit_Tab_General extends Extendware_EWCore_Block_Mage_Adminhtml_Widget_Form
{
    protected function _prepareForm()
    {    	
        $form = new Extendware_EWCore_Block_Varien_Data_Form();
		
        $fieldset = $form->addFieldset('main', array(
        	'legend' => $this->__('Request Parameters'),
        ));
      	
        $fieldset->addField('store_id', 'select', array(
        	'name'      => 'store_id',
            'values'   	=> Mage::getSingleton('adminhtml/system_store')->getStoreValuesForForm(true),
            'label'     => $this->__('Store'),
        	'value'		=> Mage::app()->getRequest()->getPost('store_id'),
            'note' 		=> $this->__('Select a store to run the rule as a specific store'),
        ));
        
        $fieldset->addField('ip_address', 'text', array(
        	'name'      => 'ip_address',
            'label'     => $this->__('IP Address'),
        	'value'		=> Mage::app()->getRequest()->getPost('ip_address', $_SERVER['REMOTE_ADDR']),
        	'note'		=> $this->__('The IP address is used to determine the country / region for the various rules.'),
            'required'  => true,
        ));
        
        $result = $this->getResult();
        if ($result->getId() > 0) {
	        $fieldset = $form->addFieldset('results', array(
	        	'legend' => $this->__('Results'),
	        ));
	        
	        $messages = '';
	        foreach ($result->getMessages() as $message) {
	        	if ($messages) $messages .= ', ';
	        	$messages .= $message->getName() . '(' . $message->getId() . ')';
	        }
	        
	        $fieldset->addField('messages', 'label', array(
	        	'name'      => 'messages',
	            'label'     => $this->__('Shown Messages'),
	        	'value'		=> $messages ? $messages : $this->__('[None]'),
	        	'note'		=> $this->__('The names of messags that will be displayed.'),
	        ));
        
	        $country = 'UNKNOWN';
	        if ($this->getResult()->getCountryCode()) {
	        	$countryCode = $this->getResult()->getCountryCode();
	        	$country = Mage::getModel('directory/country')->loadByCode($countryCode)->getName() . ' [' . $countryCode . ']';
	        }
	        $fieldset->addField('country', 'label', array(
	        	'name'      => 'country',
	            'label'     => $this->__('Country'),
	        	'value'		=> $country,
	        	'note'		=> $this->__('The detected country of the IP address'),
	        ));
	        
	        $region = 'UNKNOWN';
	        if ($this->getResult()->getRegionCode()) {
	        	$regionCode = $this->getResult()->getRegionCode();
	        	$region = $this->mHelper()->getRegionByCode($regionCode, $result->getCountryCode()) . ' [' . $regionCode . ']';
	        }
	        $fieldset->addField('region', 'label', array(
	        	'name'      => 'region',
	            'label'     => $this->__('Region'),
	        	'value'		=> $region,
	        	'note'		=> $this->__('The detected region of the IP address'),
	        ));
         }
         
        $form->addValues($this->getAction()->getPersistentData('form_data', true));
		$form->setUseContainer(false);
        $this->setForm($form);
        
		return parent::_prepareForm();
	}
	
	public function getResult() {
		return Mage::registry('ew:current_result');
	}
}
