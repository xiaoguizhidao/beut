<?php
class Extendware_EWAutoSwitcher_Block_Adminhtml_Tester_Edit_Tab_General extends Extendware_EWCore_Block_Mage_Adminhtml_Widget_Form
{
    protected function _prepareForm()
    {    	
        $form = new Extendware_EWCore_Block_Varien_Data_Form();
		
        $fieldset = $form->addFieldset('main', array(
        	'legend' => $this->__('Request Parameters'),
        ));
      	
        $fieldset->addField('website_id', 'select', array(
        	'name'      => 'website_id',
            'values'   	=> Mage::getSingleton('ewautoswitcher/adminhtml_data_option_websites')->toFormSelectOptionArray(true),
            'label'     => $this->__('Website'),
        	'value'		=> Mage::app()->getRequest()->getPost('website_id'),
            'note' 		=> $this->__('Select a website to run the rule as a specific website'),
        ));
        
        $defaultStore = Mage::app()->getDefaultStoreView();
        $fieldset->addField('url', 'text', array(
        	'name'      => 'url',
            'label'     => $this->__('Store Url'),
        	'value'		=> Mage::app()->getRequest()->getPost('url', $defaultStore->getBaseUrl()),
        	'note'		=> $this->__('The store URL is used to determine the website for the various rules if it cannot be determined by other means. <b>Note:</b> only  used if you did not select a website'),
        	'ewhelp'	=> $this->__('Determining website by hostname is only used if $_SERVER[\'MAGE_RUN_TYPE\'] $_SERVER[\'MAGE_RUN_CODE\'] is not properly defined (refer to user guide)'),
            'required'  => true,
        ));
        
        $fieldset->addField('ip_address', 'text', array(
        	'name'      => 'ip_address',
            'label'     => $this->__('IP Address'),
        	'value'		=> Mage::app()->getRequest()->getPost('ip_address', $_SERVER['REMOTE_ADDR']),
        	'note'		=> $this->__('The IP address is used to determine the country / region for the various rules.'),
            'required'  => true,
        ));
        
        $fieldset->addField('languages', 'text', array(
        	'name'      => 'languages',
            'label'     => $this->__('HTTP Accept Language'),
        	'value'		=> Mage::app()->getRequest()->getPost('languages', $_SERVER['HTTP_ACCEPT_LANGUAGE']),
        	'note'		=> $this->__('The browser provided HTTP accept language string used by the rules.'),
        ));
        
        $result = $this->getResult();
        if ($result->getId() > 0) {
	        $fieldset = $form->addFieldset('results', array(
	        	'legend' => $this->__('Results'),
	        ));
	        
        	if ($this->getResult()->getRedirectUrl() !== null) {
		        $fieldset->addField('redirect_url', 'label', array(
		        	'name'      => 'redirect_url',
		            'label'     => $this->__('Redirect URL'),
		        	'value'		=> $this->getResult()->getRedirectUrl(),
		        	'note'		=> $this->__('The URL where the visitor will be redirected to. If there is extra directory in the URl you should modify "URL Replace RegExp" in the config.'),
		        ));
	        }
	        
	        $fieldset->addField('website', 'label', array(
	        	'name'      => 'website',
	            'label'     => $this->__('Website'),
	        	'value'		=> $result->hasWebsite() ? $result->getWebsite()->getName() . ' [' . $result->getWebsite()->getId() . ']' : 'UNKNOWN',
	        	'note'		=> $this->__('This is the determined by which website was selected or the URL'),
	        ));
	        
	        $store = 'DEFAULT';
	        if ($result->hasStore()) {
	        	$store = $result->getStore()->getName() . ' [' . $result->getStore()->getId() . ']';
	        } elseif ($result->hasWebsite()) {
	        	$store = 'DEFAULT (' . $result->getWebsite()->getDefaultStore()->getName() . ' [' . $result->getWebsite()->getDefaultStore()->getId() . '])';
	        }
	        $fieldset->addField('store', 'label', array(
	        	'name'      => 'store',
	            'label'     => $this->__('Store'),
	        	'value'		=> $store,
	        	'note'		=> $this->__('The store that the auto-switcher will use for a request like this'),
	        ));
	        
        	$currency = 'DEFAULT';
        	if ($result->hasCurrencyCode()) {
        		$currency = $result->getCurrencyCode();
        	} elseif ($result->hasStore()) {
        		$currencyCode = $result->getStore()->getDefaultCurrencyCode();
	        	$currency = Mage::getModel('ewautoswitcher/adminhtml_data_option_currencies')->getLabelByOption($currencyCode) . ' [' . $currencyCode . ']';
	        } elseif ($result->hasWebsite()) {
	        	$currencyCode = $result->getWebsite()->getDefaultStore()->getDefaultCurrencyCode();
	        	$currency = 'DEFAULT (' . Mage::getModel('ewautoswitcher/adminhtml_data_option_currencies')->getLabelByOption($currencyCode) . ' [' . $currencyCode . '])';
	        }
	        
	        $fieldset->addField('currency', 'label', array(
	        	'name'      => 'currency',
	            'label'     => $this->__('Currency'),
	        	'value'		=> $currency,
	        	'note'		=> $this->__('The currency that will be used for a request like this'),
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
