<?php

/*
 * @copyright  Copyright (c) 2012 by  ESS-UA.
 */

class Ess_M2ePro_Block_Adminhtml_Buy_Template_Synchronization_Edit extends Mage_Adminhtml_Block_Widget_Form_Container
{
    public function __construct()
    {
        parent::__construct();

        // Initialization block
        //------------------------------
        $this->setId('buyTemplateSynchronizationEdit');
        $this->_blockGroup = 'M2ePro';
        $this->_controller = 'adminhtml_buy_template_synchronization';
        $this->_mode = 'edit';
        //------------------------------

        // Set header text
        //------------------------------
        if (count(Mage::helper('M2ePro/Component')->getActiveComponents()) > 1) {
            $componentName = ' ' . Mage::helper('M2ePro')->__(Ess_M2ePro_Helper_Component_Buy::TITLE);
        } else {
            $componentName = '';
        }

        if (Mage::helper('M2ePro')->getGlobalValue('temp_data')
            && Mage::helper('M2ePro')->getGlobalValue('temp_data')->getId()
        ) {
            $this->_headerText = Mage::helper('M2ePro')->__("Edit%s Synchronization Template", $componentName);
            $this->_headerText .= ' "'.$this->escapeHtml(
                Mage::helper('M2ePro')->getGlobalValue('temp_data')->getTitle()).'"';
        } else {
            $this->_headerText = Mage::helper('M2ePro')->__("Add%s Synchronization Template", $componentName);
        }
        //------------------------------

        // Set buttons actions
        //------------------------------
        $this->removeButton('back');
        $this->removeButton('reset');
        $this->removeButton('delete');
        $this->removeButton('add');
        $this->removeButton('save');
        $this->removeButton('edit');

        $this->_addButton('back', array(
            'label'     => Mage::helper('M2ePro')->__('Back'),
            'onclick'   => 'BuyTemplateSynchronizationHandlerObj.back_click(\''
                .Mage::helper('M2ePro')->getBackUrl('list').'\')',
            'class'     => 'back'
        ));

        $this->_addButton('reset', array(
            'label'     => Mage::helper('M2ePro')->__('Refresh'),
            'onclick'   => 'BuyTemplateSynchronizationHandlerObj.reset_click()',
            'class'     => 'reset'
        ));

        if (Mage::helper('M2ePro')->getGlobalValue('temp_data')
            && Mage::helper('M2ePro')->getGlobalValue('temp_data')->getId()
        ) {

            $this->_addButton('duplicate', array(
                'label'     => Mage::helper('M2ePro')->__('Duplicate'),
                'onclick'   => 'BuyTemplateSynchronizationHandlerObj.duplicate_click'
                    .'(\'buy-template-synchronization\')',
                'class'     => 'add M2ePro_duplicate_button'
            ));

            $this->_addButton('delete', array(
                'label'     => Mage::helper('M2ePro')->__('Delete'),
                'onclick'   => 'BuyTemplateSynchronizationHandlerObj.delete_click()',
                'class'     => 'delete M2ePro_delete_button'
            ));
        }

        $this->_addButton('save', array(
            'label'     => Mage::helper('M2ePro')->__('Save'),
            'onclick'   => 'BuyTemplateSynchronizationHandlerObj.save_click()',
            'class'     => 'save'
        ));

        $this->_addButton('save_and_continue', array(
            'label'     => Mage::helper('M2ePro')->__('Save And Continue Edit'),
            'onclick'   => 'BuyTemplateSynchronizationHandlerObj.save_and_edit_click'
                .'(\'\',\'buyTemplateSynchronizationEditTabs\')',
            'class'     => 'save'
        ));
        //------------------------------
    }
}
