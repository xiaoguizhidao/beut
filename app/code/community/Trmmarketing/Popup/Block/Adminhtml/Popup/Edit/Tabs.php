<?php
/**
 * @category    Trmmarketing
 * @package     Trmmarketing_PopupWidgets
 * @copyright   Copyright (c) 2013 TRM Marketing LLC
 * @license     http://www.trm-marketing.com/solutions/license/TRM-Marketing-Standard-License-Agreement.html
 */

class Trmmarketing_Popup_Block_Adminhtml_Popup_Edit_Tabs extends Mage_Adminhtml_Block_Widget_Tabs
{

  public function __construct()
  {
      parent::__construct();
      $this->setId('popup_tabs');
      $this->setDestElementId('edit_form');
      $this->setTitle(Mage::helper('popup')->__('Pop-up Settings'));
  }

  protected function _beforeToHtml()
  {
      $this->addTab('form_section', array(
          'label'     => Mage::helper('popup')->__('Pop-up Setup'),
          'title'     => Mage::helper('popup')->__('Pop-up Setup'),
          'content'   => $this->getLayout()->createBlock('popup/adminhtml_popup_edit_tab_form')->toHtml(),
      ));
	  
	  $this->addTab('template_section', array(
          'label'     => Mage::helper('popup')->__('Template Setup'),
          'title'     => Mage::helper('popup')->__('Template Setup'),
          'content'   => $this->getLayout()->createBlock('popup/adminhtml_popup_edit_tab_template')->toHtml(),
      ));
	  
	  $this->addTab('modal_section', array(
          'label'     => Mage::helper('popup')->__('Modal Setup'),
          'title'     => Mage::helper('popup')->__('Modal Setup'),
          'content'   => $this->getLayout()->createBlock('popup/adminhtml_popup_edit_tab_modal')->toHtml(),
      ));
	  
	  $this->addTab('content_section', array(
          'label'     => Mage::helper('popup')->__('Pop-up Content'),
          'title'     => Mage::helper('popup')->__('Pop-up Content'),
          'content'   => $this->getLayout()->createBlock('popup/adminhtml_popup_edit_tab_content')->toHtml(),
      ));
     
      return parent::_beforeToHtml();
  }
}