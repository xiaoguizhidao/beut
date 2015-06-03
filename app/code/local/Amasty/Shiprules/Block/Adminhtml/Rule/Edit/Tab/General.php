<?php
/**
 * @copyright   Copyright (c) 2009-2012 Amasty (http://www.amasty.com)
 */ 
class Amasty_Shiprules_Block_Adminhtml_Rule_Edit_Tab_General extends Mage_Adminhtml_Block_Widget_Form
{
    protected function _prepareForm()
    {
        $form = new Varien_Data_Form();
        $this->setForm($form);
        
        /* @var $hlp Amasty_Shiprules_Helper_Data */
        $hlp = Mage::helper('amshiprules');
    
        $fldInfo = $form->addFieldset('general', array('legend'=> $hlp->__('General')));
        $fldInfo->addField('name', 'text', array(
            'label'     => $hlp->__('Name'),
            'required'  => true,
            'name'      => 'name',
        ));
        $fldInfo->addField('is_active', 'select', array(
            'label'     => Mage::helper('salesrule')->__('Status'),
            'name'      => 'is_active',
            'options'    => $hlp->getStatuses(),
        ));  
            
        $fldInfo->addField('carriers', 'multiselect', array(
            'label'     => $hlp->__('Shipping Carriers'),
            'name'      => 'carriers[]',
            'values'    => $hlp->getAllCarriers(),
            'required'  => true,
        ));            
        
        $fldInfo->addField('methods', 'textarea', array(
            'label'     => $hlp->__('Shipping Methods'),
            'name'      => 'methods',
            'note'      => $hlp->__('One method name per line, e.g Next Day Air. Leave empty for all methods.'), 
        ));
        
        $fldInfo->addField('coupon', 'text', array(
            'label'     => Mage::helper('salesrule')->__('Coupon Code'), 
            'name'      => 'coupon',
        ));

        
        $fldInfo->addField('pos', 'text', array(
            'label'     => Mage::helper('salesrule')->__('Priority'), 
            'name'      => 'pos',
            'note'      => $hlp->__('If a product matches several rules, the first rule will be applied only.'),
        ));
        
        //set form values
        $form->setValues(Mage::registry('amshiprules_rule')->getData()); 
        
        return parent::_prepareForm();
    }
}