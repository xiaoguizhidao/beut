<?php
class Extendware_EWCookieMessage_Block_Adminhtml_Message_Rule extends Extendware_EWCore_Block_Mage_Adminhtml_Widget_Grid_Container
{
	public function __construct()
	{
		parent::__construct();

		$this->_headerText = $this->__('Message Rules');

		$this->_updateButton('add', 'label', $this->__('Add Rule'));
	}
}
