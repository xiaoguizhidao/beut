<?php
/**
* @author Amasty Team
* @copyright Copyright (c) 2008-2012 Amasty (http://www.amasty.com)
* @package Amasty_Label
*/ 
class Amasty_Label_Model_Mysql4_Label extends Mage_Core_Model_Mysql4_Abstract
{
    public function _construct()
    {    
        $this->_init('amlabel/label', 'label_id');
    }
    
    protected function _beforeSave(Mage_Core_Model_Abstract $object)
    {
   
		if ($object->getDateRangeEnabled()) {
			$timeFrom = $object->getFromDate();	    	
	    	$timeTo = $object->getToDate();
	    	
			if (empty($timeFrom) || empty($timeTo)) {
	    		Mage::throwException(Mage::helper('amlabel')->__('Please specify start date and end date'));	
	    	}
	    	
	    	$timeFrom = strtotime($timeFrom);//Mage::app()->getLocale()->date($timeFrom));	    	
	    	$timeTo = strtotime($timeTo);//Mage::app()->getLocale()->date($timeTo));
	    	
	    	    	
	    	if ($timeFrom > $timeTo) {
	    		Mage::throwException(Mage::helper('amlabel')->__('`To Date` should be more than `From Date`'));	
	    	}
	    	
	        $object->setFromDate($timeFrom);
	        $object->setToDate($timeTo);
		}
                        
        return parent::_beforeSave($object);
    } 
}