<?php
/**
 * @category    Trmmarketing
 * @package     Trmmarketing_PopupWidgets
 * @copyright   Copyright (c) 2013 TRM Marketing LLC
 * @license     http://www.trm-marketing.com/solutions/license/TRM-Marketing-Standard-License-Agreement.html
 */
class Trmmarketing_Popup_Model_Tracking
{
    public function toOptionArray()
    {
        return array(
            array('value'=>'None', 'label'=>Mage::helper('popup')->__('Do not send tracking data')),
            array('value'=>'GAClassic', 'label'=>Mage::helper('popup')->__('Google Analytics Classic Only')),
            array('value'=>'GAUniversal', 'label'=>Mage::helper('popup')->__('Google Analytics Universal Only')),
			array('value'=>'GAAll', 'label'=>Mage::helper('popup')->__('Google Analytics Classic & Universal')),            
        );
    }

}

