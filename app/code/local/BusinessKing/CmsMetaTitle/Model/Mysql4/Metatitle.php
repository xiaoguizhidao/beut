<?php

class BusinessKing_CmsMetaTitle_Model_Mysql4_Metatitle extends Mage_Core_Model_Mysql4_Abstract
{
	protected function _construct()
    {
        $this->_init('cmsmetatitle/meta_title', 'id');
    } 
}