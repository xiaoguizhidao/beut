<?php
/**
 * Mirasvit
 *
 * This source file is subject to the Mirasvit Software License, which is available at http://mirasvit.com/license/.
 * Do not edit or add to this file if you wish to upgrade the to newer versions in the future.
 * If you wish to customize this module for your needs
 * Please refer to http://www.magentocommerce.com for more information.
 *
 * @category  Mirasvit
 * @package   Advanced Sphinx Search Pro
 * @version   2.3.1
 * @revision  420
 * @copyright Copyright (C) 2013 Mirasvit (http://mirasvit.com/)
 */


class Mirasvit_SearchIndex_Block_Adminhtml_Index_Edit extends Mage_Adminhtml_Block_Widget_Form_Container
{
    public function __construct ()
    {
        parent::__construct();

        $this->_objectId   = 'index_id';
        $this->_blockGroup = 'searchindex';
        $this->_mode       = 'edit';
        $this->_controller = 'adminhtml_index';

        $this->_removeButton('reset');
        $this->_addButton('saveandcontinue', array(
            'label'     => __('Save And Continue Edit'),
            'onclick'   => 'saveAndContinueEdit()',
            'class'     => 'save',
        ), -100);

        $this->_formScripts[] = "
            function saveAndContinueEdit(){
                editForm.submit($('edit_form').action+'back/edit/');
            }
        ";

        if (Mage::registry('current_model')->getId() > 0
            && Mage::registry('current_model')->getIndexInstance()->isLocked()) {
            $this->_removeButton('delete');
        }

        return $this;
    }

    public function getHeaderText()
    {
        if (Mage::registry('current_model')->getId() > 0) {
            return __("Edit Search Index '%s'", $this->htmlEscape(Mage::registry('current_model')->getTitle()));
        } else {
            return __("Add Search Index");
        }
    }
}