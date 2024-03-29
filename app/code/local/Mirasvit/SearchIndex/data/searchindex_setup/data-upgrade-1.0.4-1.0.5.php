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


$installer = $this;

$collection = Mage::getModel('searchindex/index')->getCollection()
    ->addFieldToFilter('index_code', 'mage_catalog_product');

if ($collection->count() == 0) {
    $index = Mage::getModel('searchindex/index')
        ->setIndexCode('mage_catalog_product')
        ->setTitle('Products')
        ->setPosition(0)
        ->setStatus(3)
        ->setIsActive(1)
        ->save();
}

$installer->endSetup();
