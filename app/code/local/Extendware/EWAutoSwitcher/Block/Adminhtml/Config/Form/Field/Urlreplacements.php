<?php
class Extendware_EWAutoSwitcher_Block_Adminhtml_Config_Form_Field_Urlreplacements extends Extendware_EWCore_Block_Mage_Adminhtml_System_Config_Form_Field_Array_Abstract
{
	protected $_addAfter = false;
    public function __construct()
    {
        $this->addColumn('regexp', array(
            'label' => $this->__('Regexp'),
        	'class' => 'required-entry',
        	'style' => 'width: 99%',
        	'ewhelp' => $this->__('This must be a valid regular expression with the beginning and ending "/". For example, /en/. You can read the PHP preg documentation for more information'),
        ));
        
        $this->addColumn('replacement', array(
            'label' => $this->__('String'),
        	'class' => 'required-entry',
        	'style' => 'width: 99%',
        ));
        
        $this->_addButtonLabel = $this->__('Add');
        parent::__construct();
    }
}