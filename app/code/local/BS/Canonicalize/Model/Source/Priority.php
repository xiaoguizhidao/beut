<?php

class BS_Canonicalize_Model_Source_Priority
{
    public function toOptionArray()
    {
        return array(
            array('value'=>'0.1', 'label'=>Mage::helper('canonicalize')->__('0.1')),
            array('value'=>'0.2', 'label'=>Mage::helper('canonicalize')->__('0.2')),
            array('value'=>'0.3', 'label'=>Mage::helper('canonicalize')->__('0.3')),
            array('value'=>'0.4', 'label'=>Mage::helper('canonicalize')->__('0.4')),
            array('value'=>'0.5', 'label'=>Mage::helper('canonicalize')->__('0.5')),
            array('value'=>'0.6', 'label'=>Mage::helper('canonicalize')->__('0.6')),
            array('value'=>'0.7', 'label'=>Mage::helper('canonicalize')->__('0.7')),
        	array('value'=>'0.8', 'label'=>Mage::helper('canonicalize')->__('0.8')),
        	array('value'=>'0.9', 'label'=>Mage::helper('canonicalize')->__('0.9')),
        	array('value'=>'1.0', 'label'=>Mage::helper('canonicalize')->__('1.0')),
        );
    }
}
