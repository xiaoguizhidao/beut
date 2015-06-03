<?php

class Extendware_EWPageCache_Model_Injector_Welcome_Message_Block extends Extendware_EWPageCache_Model_Injector_Abstract
{
	public function getInjection(array $params = array(), array $request = array()) {
		$header = Mage::app()->getLayout()->getBlock('header');
		if ($header) { // avoids errors in some installations
			$block = Mage::app()->getLayout()->createBlock('page/html_welcome', $this->getId());
			return $block->toHtml();
		}
		return '';
	}
}
