<?php

/**
 * Customer account form block
 *
 * @category   BusinessKing
 * @package    BusinessKing_CmsMetaTitle
 * @developer   Business King (http://www.businessapplicationking.com)
 */
class BusinessKing_CmsMetaTitle_Block_Adminhtml_Cms_Page_Edit_Tab_Meta extends Mage_Adminhtml_Block_Cms_Page_Edit_Tab_Meta
{
    protected function _prepareForm()
    {
    	parent::_prepareForm();
        $form = new Varien_Data_Form();

        $form->setHtmlIdPrefix('page_');

        $model = Mage::registry('cms_page');

        $fieldset = $form->addFieldset('meta_fieldset', array('legend' => Mage::helper('cms')->__('Meta Data'), 'class' => 'fieldset-wide'));

    	$fieldset->addField('meta_title', 'text', array(
            'name' => 'meta_title',
            'label' => Mage::helper('cms')->__('Title'),
            'title' => Mage::helper('cms')->__('Meta Title'),
        ));

        $fieldset->addField('meta_keywords', 'editor', array(
            'name' => 'meta_keywords',
            'label' => Mage::helper('cms')->__('Keywords'),
            'title' => Mage::helper('cms')->__('Meta Keywords'),
        ));
        
    	$fieldset->addField('meta_description', 'editor', array(
            'name' => 'meta_description',
            'label' => Mage::helper('cms')->__('Description'),
            'title' => Mage::helper('cms')->__('Meta Description'),
        ));

        $form->setValues($model->getData());

        $this->setForm($form);

        return $this;
    }

}
