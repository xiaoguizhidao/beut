<?php

/**
 * Cms page content
 *
 * @category   BusinessKing
 * @package    BusinessKing_CmsMetaTitle
 * @developer   Business King (http://www.businessapplicationking.com)
 */
class BusinessKing_CmsMetaTitle_Block_Cms_Page extends Mage_Cms_Block_Page
{
    protected function _prepareLayout()
    {
    	parent::_prepareLayout();
    	
        if ($head = $this->getLayout()->getBlock('head')) {
        	$page = $this->getPage();
        	$title = $page->getMetaTitle() ? $page->getMetaTitle() : $page->getTitle();
            $head->setTitle($title);            
        }
    }
}
