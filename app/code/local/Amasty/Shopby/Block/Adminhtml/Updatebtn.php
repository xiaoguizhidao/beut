<?php
/* Added by S2L Solutions <info@s2lsolutions.com> -- Date added: Tue, Apr 1, 2014*/  
class Amasty_Shopby_Block_Adminhtml_Updatebtn extends Mage_Adminhtml_Block_System_Config_Form_Field
{
	protected function _prepareLayout()
    {
        parent::_prepareLayout();
        if (!$this->getTemplate()) {
            $this->setTemplate('amshopby/updatebtn.phtml');
        }
        return $this;
    }
    
    /**
     * Unset some non-related element parameters
     *
     * @param Varien_Data_Form_Element_Abstract $element
     * @return string
     */
    public function render(Varien_Data_Form_Element_Abstract $element)
    {
        $element->unsScope()->unsCanUseWebsiteValue()->unsCanUseDefaultValue();
        return parent::render($element);
    }

    /**
     * @param Varien_Data_Form_Element_Abstract $element
     * @return string
     */
    protected function _getElementHtml(Varien_Data_Form_Element_Abstract $element)
    {
        $originalData = $element->getOriginalData();
        
        $website = $this->getRequest()->getParam('website');
        $store   = $this->getRequest()->getParam('store');
        
        $uri = $originalData['button_url'];
        if ($store != "")
        	$uri .= '/website/'.$website;
        if ($store != "")
        	$uri .= '/store/'.$store;
        
        $uri = Mage::helper('adminhtml')->getUrl($uri);
        $this->addData(array(
            'button_label'	=> Mage::helper('amshopby')->__($originalData['button_label']),
            'button_url'	=> $uri,
            'html_id'		=> $element->getHtmlId(),
        ));
        return $this->_toHtml();
    }

	public function getButtonLabel() {
		return Mage::helper('amshopby')->__('Generate Pages Sitemap');
	}

	public function getButtonUrl() {
		$website = $this->getRequest()->getParam('website');
		$store = $this->getRequest()->getParam('store');
		$uri = 'amshopby/adminhtml_page/generate';
		if ($store != "") $uri .= '/website/'.$website;
		if ($store != "") $uri .= '/store/'.$store;
		$uri = Mage::helper('adminhtml')->getUrl($uri);
		return $uri;
	}
	
	
	
	
}