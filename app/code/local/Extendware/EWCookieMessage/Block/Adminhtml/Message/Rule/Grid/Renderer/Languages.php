<?php
class Extendware_EWCookieMessage_Block_Adminhtml_Message_Rule_Grid_Renderer_Languages extends Mage_Adminhtml_Block_Widget_Grid_Column_Renderer_Abstract {
	public function render(Varien_Object $rule) {
        return sprintf('<div style="max-height: 100px; overflow: auto;">%s</div>', implode(', ', $rule->getLanguages()));
	}
}