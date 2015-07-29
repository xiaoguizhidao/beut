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
        if ($this->mHelper('config')->isPersistentUrlEnabled() === false) {
	        $key .= $this->mHelper('config')->getLastChangedTime();
        }
        $key .= (int)Mage::app()->getWebsite()->getId();
        $key .= (int)Mage::app()->getStore()->getId();
        $key .= (int)Mage::app()->getRequest()->isSecure();
       
        return md5($key);
	}
	
	public function getMessageCollection() {
		return $this->mHelper()->getMessageCollection();
	}
	
	public function canOutputMessage(Extendware_EWCookieMessage_Model_Message_Rule $message) {
		return $this->mHelper()->canOutputMessage($message);
	}
	
	public function getFilename()
    {
        if (@filemtime($this->getTemplateFilePath()) >= @filemtime($this->getCachedFilePath())) {
            $this->_saveCache($this->_toHtml());
        } else if ($this->mHelper('config')->getLastChangedTime() <= $this->mHelper('config')->getLastChangedTime()) {
        	$this->_saveCache($this->_toHtml());
        }

        return $this->getCachedFilename();
    }
}

