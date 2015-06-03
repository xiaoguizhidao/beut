<?php
/* Added by S2L Solutions <info@s2lsolutions.com> -- Date added: Tue, Apr 1, 2014*/
class Amasty_Shopby_Model_Source_Changefreq extends Varien_Object
{
    public function toOptionArray()
    {
        $hlp = Mage::helper('amshopby');
        return array(
            	array('value' => 'hourly', 'label' => $hlp->__('Hourly')),
            	array('value' => 'daily',  'label' => $hlp->__('Daily')),
        		array('value' => 'weekly', 'label' => $hlp->__('Weekly')),
        		array('value' => 'monthly',  'label' => $hlp->__('Monthly')),
        		array('value' => 'yearly', 'label' => $hlp->__('Yearly')),
        		array('value' => 'never',  'label' => $hlp->__('Never')),
        );
    }
    
} 