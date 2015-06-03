<?php
class Extendware_EWCookieMessage_Block_Adminhtml_Config_Edit extends Extendware_EWCore_Block_Mage_Adminhtml_System_Config_Edit
{
	protected function _prepareLayout()
    {
    	$this->setChild('download_button',
            $this->getLayout()->createBlock('adminhtml/widget_button')
                ->setData(array(
                    'label'     => $this->__('Download Geo Data'),
                    'onclick'   => 'confirmSetLocation(\''
                . $this->__('Are you sure you want to download geo data? Unless there is a warning the data has already be downloaded.')
                . '\', \'' . $this->getDownloadUrl() . '\')',
                    'class' => 'add',
                ))
        );
        return parent::_prepareLayout();
    }
    
	public function getCustomFormButtonHtml() {
    	return $this->getChildHtml('download_button');
    }
    
	public function getDownloadUrl() {
    	return $this->getUrl('*/*/download');
    }
}
