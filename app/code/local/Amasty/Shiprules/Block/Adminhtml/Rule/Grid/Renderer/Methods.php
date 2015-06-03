<?php
/**
 * @copyright   Copyright (c) 2009-2012 Amasty (http://www.amasty.com)
 */ 
class Amasty_Shiprules_Block_Adminhtml_Rule_Grid_Renderer_Methods extends Mage_Adminhtml_Block_Widget_Grid_Column_Renderer_Input
{
    public function render(Varien_Object $row)
    {
        /* @var $hlp Amasty_Shiprules_Helper_Data */
        $hlp = Mage::helper('amshiprules'); 
        
        $methods = $row->getData('methods');
        if (!$methods) {
            return $hlp->__('Any');
        }
        return nl2br($methods);
    }
}