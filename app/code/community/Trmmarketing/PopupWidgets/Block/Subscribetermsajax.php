<?php
/**
 * @category    Trmmarketing
 * @package     Trmmarketing_PopupWidgets
 * @copyright   Copyright (c) 2013 TRM Marketing LLC
 * @license     http://www.trm-marketing.com/solutions/license/TRM-Marketing-Standard-License-Agreement.html
 */
class Trmmarketing_PopupWidgets_Block_Subscribetermsajax
    extends Mage_Core_Block_Template
    implements Mage_Widget_Block_Interface
{

    /**
     * A model to serialize attributes
     * @var Varien_Object
     */
    protected $_serializer = null;

    /**
     * Initialization
     */
    protected function _construct()
    {
        $this->_serializer = new Varien_Object();
        parent::_construct();
    }

    
    protected function _toHtml()
    {
       
		$html = '';
		$submitbuttonlabel = $this->getData('submitbuttonlabel');
		$this->assign('submitbuttonlabel', $submitbuttonlabel);
		$emaildefaulttext = $this->getData('emaildefaulttext');
		$this->assign('emaildefaulttext', $emaildefaulttext);
		
		$emailsuccesstext = $this->getData('emailsuccesstext');
		$this->assign('emailsuccesstext', $emailsuccesstext);
		$autoclosesuccess = $this->getData('autoclosesuccess');
		$this->assign('autoclosesuccess', $autoclosesuccess);
		
		$tracksubconversion = $this->getData('tracksubconversion');
		$this->assign('tracksubconversion', $tracksubconversion);
		$conversionsuccessurl = $this->getData('conversionsuccessurl');
		$this->assign('conversionsuccessurl', $conversionsuccessurl);
		$subsuccessexpiry = $this->getData('subsuccessexpiry');
		$this->assign('subsuccessexpiry', $subsuccessexpiry);
		
		$termscallout = $this->getData('termscallout');
		$this->assign('termscallout', $termscallout);
		$termslinklabel = $this->getData('termslinklabel');
		$this->assign('termslinklabel', $termslinklabel);
		$termslink = $this->getData('termslink');
		$this->assign('termslink', $termslink);
		
		
		
		
        return parent::_toHtml();
    }
	
	


}
