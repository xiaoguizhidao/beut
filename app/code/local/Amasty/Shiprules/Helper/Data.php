<?php
/**
 * @copyright   Copyright (c) 2009-2012 Amasty (http://www.amasty.com)
 */ 
class Amasty_Shiprules_Helper_Data extends Mage_Core_Helper_Abstract
{
    public function getAllGroups()
    {
        $customerGroups = Mage::getResourceModel('customer/group_collection')
            ->load()->toOptionArray();

        $found = false;
        foreach ($customerGroups as $group) {
            if ($group['value']==0) {
                $found = true;
            }
        }
        if (!$found) {
            array_unshift($customerGroups, array('value'=>0, 'label'=>Mage::helper('salesrule')->__('NOT LOGGED IN')));
        } 
        
        return $customerGroups;
    }
    
    public function getAllCarriers()
    {
        $carriers = array();
        foreach (Mage::getStoreConfig('carriers') as $code=>$config){
            if (!empty($config['title'])){
                $carriers[] = array('value'=>$code, 'label'=>$config['title']);
            }
        }  
        return $carriers;      
    }
    
    public function getStatuses()
    {
        return array(
            '0' => $this->__('Inactive'),
            '1' => $this->__('Active'),
        );       
    }

    public function getCalculations()
    {
        $a = array(
            Amasty_Shiprules_Model_Rule::CALC_REPLACE  => $this->__('Replace'),
            Amasty_Shiprules_Model_Rule::CALC_ADD      => $this->__('Surcharge'),
            Amasty_Shiprules_Model_Rule::CALC_DEDUCT   => $this->__('Discount'),
        );
        return $a;       
    }
}