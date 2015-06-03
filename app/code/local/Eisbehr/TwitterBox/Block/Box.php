<?php
/*
	Frontend_Base_Default_Template_TwitterBox_Box
*/

class Eisbehr_TwitterBox_Block_Box extends Mage_Core_Block_Template
{
	public $_helper;
	
	protected function _construct()
	{
		$this->_helper = Mage::helper('twitterbox');
		return;
	}
}