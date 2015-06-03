<?php

class BS_Canonicalize_Model_Source_Frequency
{
    public function toOptionArray()
    {
        return array(
            array('value'=>'always', 'label'=>Mage::helper('canonicalize')->__('Always')),
            array('value'=>'hourly', 'label'=>Mage::helper('canonicalize')->__('Hourly')),
            array('value'=>'daily', 'label'=>Mage::helper('canonicalize')->__('Daily')),
            array('value'=>'weekly', 'label'=>Mage::helper('canonicalize')->__('Weekly')),
            array('value'=>'monthly', 'label'=>Mage::helper('canonicalize')->__('Monthly')),
            array('value'=>'yearly', 'label'=>Mage::helper('canonicalize')->__('Yearly')),
            array('value'=>'never', 'label'=>Mage::helper('canonicalize')->__('Never')),
        );
    }
}
