<?php
/**
 * @category    Trmmarketing
 * @package     Trmmarketing_PopupWidgets
 * @copyright   Copyright (c) 2013 TRM Marketing LLC
 * @license     http://www.trm-marketing.com/solutions/license/TRM-Marketing-Standard-License-Agreement.html
 */

class Trmmarketing_Popup_Block_Adminhtml_Popup_Edit extends Mage_Adminhtml_Block_Widget_Form_Container
{
    public function __construct()
    {
        parent::__construct();
                 
        $this->_objectId = 'id';
        $this->_blockGroup = 'popup';
        $this->_controller = 'adminhtml_popup';
        
        $this->_updateButton('save', 'label', Mage::helper('popup')->__('Save Pop-up'));
        $this->_updateButton('delete', 'label', Mage::helper('popup')->__('Delete Pop-up'));
		
        $this->_addButton('saveandcontinue', array(
            'label'     => Mage::helper('adminhtml')->__('Save And Continue Edit'),
            'onclick'   => 'saveAndContinueEdit()',
            'class'     => 'save',
        ), -100);

        $this->_formScripts[] = "
            function toggleEditor() {
                if (tinyMCE.getInstanceById('popup_content') == null) {
                    tinyMCE.execCommand('mceAddControl', false, 'popup_content');
                } else {
                    tinyMCE.execCommand('mceRemoveControl', false, 'popup_content');
                }
            }

            function saveAndContinueEdit(){
                editForm.submit($('edit_form').action+'back/edit/');
            }
        ";
    }

    public function getHeaderText()
    {
        if( Mage::registry('popup_data') && Mage::registry('popup_data')->getId() ) {
            return Mage::helper('popup')->__("Edit Item '%s'", $this->htmlEscape(Mage::registry('popup_data')->getTitle()));
        } else {
            return Mage::helper('popup')->__('Add Item');
        }
    }
}