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


/**
 * ÐÐ»Ð¾Ðº ÑÐ°Ð±Ð»Ð¸ÑÑ ÑÑÐ¾Ð¿-ÑÐ»Ð¾Ð²
 *
 * @category Mirasvit
 * @package  Mirasvit_SearchSphinx
 */
class Mirasvit_SearchSphinx_Block_Adminhtml_Stopword extends Mage_Adminhtml_Block_Widget_Grid_Container
{
    public function __construct()
    {
        $this->_controller = 'adminhtml_stopword';
        $this->_blockGroup = 'searchsphinx';
        $this->_headerText = Mage::helper('searchsphinx')->__('Dictionary of stopwords');

        $this->_addButton('import', array(
            'label'     => Mage::helper('searchsphinx')->__('Import Dictionary'),
            'onclick'   => 'setLocation(\'' . $this->getUrl('*/*/import') .'\')',
            'class'     => 'import',
        ));

        parent::__construct();
    }
}