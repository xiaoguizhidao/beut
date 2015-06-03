<?php
/**
 * @category    Trmmarketing
 * @package     Trmmarketing_PopupWidgets
 * @copyright   Copyright (c) 2013 TRM Marketing LLC
 * @license     http://www.trm-marketing.com/solutions/license/TRM-Marketing-Standard-License-Agreement.html
 */

class Trmmarketing_Popup_IndexController extends Mage_Core_Controller_Front_Action
{
    public function indexAction()
    {
    	
    	

			
		$this->loadLayout();     
		$this->renderLayout();
    }
	
	public function viewAction()
    {
    	$arrParams = $this->getRequest()->getParams();
    	//echo 'saw me, I am popup number: ' .  $arrParams['id'];
		if($arrParams['id'] != ""):
		$object = Mage::getModel('popup/popup')->load($arrParams['id']);
		$curViews = $object->getPopupviews();
        $object->setPopupviews($curViews + 1);
        $object->save();
		endif;

			
		//$this->loadLayout();     
		//$this->renderLayout();
    }
	
	public function conversionAction()
    {
    	
    	//echo 'converted me';
		
		$arrParams = $this->getRequest()->getParams();
		if($arrParams['id'] != ""):
		$object = Mage::getModel('popup/popup')->load($arrParams['id']);
		$curConversions = $object->getPopupconversions();
        $object->setPopupconversions($curConversions + 1);
        $object->save();
		endif;

    }
}