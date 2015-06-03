<?php
class Extendware_EWCookieMessage_Block_Adminhtml_Message_Rule_Grid_Renderer_Countries extends Mage_Adminhtml_Block_Widget_Grid_Column_Renderer_Abstract {
	public function render(Varien_Object $rule) {
		$countries = $rule->getCountries();
		$countryNames = Mage::getSingleton('ewcookiemessage/adminhtml_data_option_countries')->toArray();
		
		$names = array();
		foreach ($countries as $country) {
			$names[] = $countryNames[$country];
		}
        return sprintf('<div style="max-height: 100px; overflow: auto;">%s</div>', implode(', ', $names));
	}
}