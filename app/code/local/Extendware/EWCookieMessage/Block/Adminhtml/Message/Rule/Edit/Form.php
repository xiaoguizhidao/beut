<?php
class Extendware_EWCookieMessage_Block_Adminhtml_Message_Rule_Edit_Form extends Extendware_EWCore_Block_Mage_Adminhtml_Widget_Form
{
    protected function _prepareForm()
    {    	
        $form = new Extendware_EWCore_Block_Varien_Data_Form(array(
            'id' => 'edit_form',
            'action' => $this->getUrl('*/*/save', array('id' => $this->getRequest()->getParam('id'))),
            'method' => 'post'
        ));
		
		$form->setUseContainer(true);
        $this->setForm($form);
        return parent::_prepareForm();
	}
}
