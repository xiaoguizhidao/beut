<?php
class Extendware_EWCookieMessage_Block_Js_General extends Extendware_EWCore_Block_Generated_Js
{
    public function __construct()
    {
        parent::__construct();
        $this->setTemplate('extendware/ewcookiemessage/js/general.phtml');
    }

	public function getCacheKey() {
        $key = parent::getCacheKey();
        $key .= $this->mHelper('config')->getHash();
        $key .= $this->mHelper('config')->getLastChangedTime();
        $key .= (int)Mage::app()->getWebsite()->getId();
        $key .= (int)Mage::app()->getStore()->getId();
        $key .= (int)Mage::app()->getRequest()->isSecure();
       
        return md5($key);
	}
	
	public function getMessageCollection() {
		return $this->mHelper()->getMessageCollection();
	}
	
	public function canShowMessage(Extendware_EWCookieMessage_Model_Message_Rule $message) {
		return $this->mHelper()->canShowMessage($message);
	}
}

