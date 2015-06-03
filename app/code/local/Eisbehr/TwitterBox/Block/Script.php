<?php
/*
	Frontend_Base_Default_Template_TwitterBox_Script
*/

class Eisbehr_TwitterBox_Block_Script extends Mage_Core_Block_Template
{
	public $_helper;
	
	protected function _construct()
	{
		$this->_helper = Mage::helper('twitterbox');
		return;
	}
}