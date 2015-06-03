<?php
/**
 * @category    Trmmarketing
 * @package     Trmmarketing_PopupWidgets
 * @copyright   Copyright (c) 2013 TRM Marketing LLC
 * @license     http://www.trm-marketing.com/solutions/license/TRM-Marketing-Standard-License-Agreement.html
 */
class Trmmarketing_PopupWidgets_Model_Popups
{
    public function toOptionArray()
    {
        
				$collection = Mage::getModel('popup/popup')->getCollection();
				$returnArray = array();
				foreach ($collection as $item) : 
				$returnArray[] = array('value'=>$item->getPopupId(), 'label'=>$item->getTitle());
				//$returnArray[] = array('value'=>'hgfh', 'label'=>'fdgdfgd'); 
                endforeach;
				
				
					
                return $returnArray;
		
		
		/*return array(
            array('value'=>'None', 'label'=>Mage::helper('popup')->__('Do not send tracking data')),
            array('value'=>'GAClassic', 'label'=>Mage::helper('popup')->__('Google Analytics Classic Only')),
            array('value'=>'GAUniversal', 'label'=>Mage::helper('popup')->__('Google Analytics Universal Only')),
			array('value'=>'GAAll', 'label'=>Mage::helper('popup')->__('Google Analytics Classic & Universal')),            
        );
		*/
    }

}