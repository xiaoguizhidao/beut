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


class Mirasvit_SearchIndex_Model_Index_External_Wordpress_Post_Indexer extends Mirasvit_SearchIndex_Model_Indexer_Abstract
{
    protected function _getSearchableEntities($storeId, $entityIds, $lastEntityId, $limit = 100)
    {
        $uid = Mage::helper('mstcore/debug')->start();

        $resource   = Mage::getSingleton('core/resource');
        $connection = $resource->getConnection('core_read');
        $collection = Mage::getModel('searchindex/index_external_wordpress_post_collection');

        if ($entityIds) {
            $collection->addFieldToFilter('ID', array('in' => $entityIds));
        }

        $collection->getSelect()
            ->where('main_table.ID > ?', $lastEntityId)
            ->limit($limit)
            ->order('main_table.ID');

        Mage::helper('mstcore/debug')->dump($uid, array('$collection_sql', (string)$collection->getSelect()));
        Mage::helper('mstcore/debug')->end($uid);

        return $collection;
    }
}