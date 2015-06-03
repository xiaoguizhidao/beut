<?php

/**
 * Cms page mysql resource
 *
 * @category   BusinessKing
 * @package    BusinessKing_CmsMetaTitle
 * @developer   Business King (http://www.businessapplicationking.com)
 */
class BusinessKing_CmsMetaTitle_Model_Mysql4_Cms_Page extends Mage_Cms_Model_Mysql4_Page
{
    /**
     * Assign page to store views
     *
     * @param Mage_Core_Model_Abstract $object
     */
    protected function _afterSave(Mage_Core_Model_Abstract $object)
    { 
		$cmsMetaTitle = Mage::getModel('cmsmetatitle/metatitle')->load($object->getId(), 'page_id');
		$cmsMetaTitle->setPageId($object->getId())
					 ->setMetaTitle($object->getData('meta_title'))
		             ->save(); 
    	return parent::_afterSave($object);
    }
    
	/**
     *
     * @param Mage_Core_Model_Abstract $object
     */
    protected function _afterLoad(Mage_Core_Model_Abstract $object)
    {
    	parent::_afterLoad($object);
    	    	
        $select = $this->_getReadAdapter()->select()
            ->from($this->getTable('cms/page_store'))
            ->joinleft(array('mt'=>$this->getTable('cmsmetatitle/meta_title')), "mt.page_id=".$this->getTable('cms/page_store').".page_id", array('meta_title'=>'meta_title'))
            ->where($this->getTable('cms/page_store').'.page_id = ?', $object->getId());

        if ($data = $this->_getReadAdapter()->fetchAll($select)) {
            $storesArray = array();
            $metaTitle = '';
            foreach ($data as $row) {
                $storesArray[] = $row['store_id'];
                $metaTitle = $row['meta_title'];
            }
            $object->setData('store_id', $storesArray);
            $object->setData('meta_title', $metaTitle);
        }

        return $this;
    }
}