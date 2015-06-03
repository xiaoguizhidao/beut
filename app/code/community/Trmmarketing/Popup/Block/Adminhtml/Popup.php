<?php
/**
 * @category    Trmmarketing
 * @package     Trmmarketing_PopupWidgets
 * @copyright   Copyright (c) 2013 TRM Marketing LLC
 * @license     http://www.trm-marketing.com/solutions/license/TRM-Marketing-Standard-License-Agreement.html
 */

class Trmmarketing_Popup_Block_Adminhtml_Popup extends Mage_Adminhtml_Block_Widget_Grid_Container
{
  public function __construct()
  {
    $this->_controller = 'adminhtml_popup';
    $this->_blockGroup = 'popup';
    $this->_headerText = Mage::helper('popup')->__('Pop-up Manager');
    $this->_addButtonLabel = Mage::helper('popup')->__('Create New Pop-up');
    parent::__construct();
  }
}