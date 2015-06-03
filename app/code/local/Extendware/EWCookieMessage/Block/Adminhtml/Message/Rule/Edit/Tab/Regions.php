<?php
class Extendware_EWCookieMessage_Block_Adminhtml_Message_Rule_Edit_Tab_Regions extends Extendware_EWCore_Block_Mage_Adminhtml_Widget_Form
{
    protected function _prepareForm()
    {    	
        $form = new Extendware_EWCore_Block_Varien_Data_Form();
		
        $regions = $this->getMessageRule()->getPotentialRegions();
        $countryNames = Mage::getSingleton('ewcookiemessage/adminhtml_data_option_countries')->toArray();
        $countries = $this->getMessageRule()->getCountries();
        
        foreach ($countries as $country) {
        	if (isset($regions[$country]) === false) continue;
	        $fieldset = $form->addFieldset('region_' . $country, array(
	        	'legend' => $this->__('%s Regions', $countryNames[$country]),
	        ));
	        
	        ksort($regions[$country]);
	        $regionOptions = Mage::getModel('ewcore/data_option_custom')->setOptions($regions[$country]);
	        $fieldset->addField($country, 'multiselect', array(
	        	'name'      => $country,
	            'values'   	=> $regionOptions->toFormSelectOptionArray(),
	            'label'     => $this->__('Regions'),
	        	'value'		=> $this->getMessageRule()->getRegionsForCountry($country),
	        	'note' 		=> $this->__('Use Ctrl-C to select more than one region. Selecting no region will match the entire country.'),
	        ));
        }
        
        $form->addValues($this->getAction()->getPersistentData('form_data', true));
        $form->addFieldNameSuffix('regions');
		$form->setUseContainer(false);
        $this->setForm($form);
        
		return parent::_prepareForm();
	}
    
	public function getMessageRule() {
        return Mage::registry('ew:current_message_rule');
    }
}
