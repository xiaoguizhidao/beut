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


class Mirasvit_SearchIndex_Model_Resource_Catalogsearch_Fulltext extends Mage_CatalogSearch_Model_Mysql4_Fulltext
{
    protected $_columns = null;

    protected function _construct()
    {
        $this->_init('catalogsearch/fulltext', 'product_id');
        $this->_engine = Mage::getResourceSingleton('searchindex/catalogsearch_fulltext_engine');
    }

    public function rebuildTable()
    {
        set_time_limit(0);
        $uid = Mage::helper('mstcore/debug')->start();

        $tableName = $this->getMainTable();
        $adapter   = $this->_getWriteAdapter();

        $adapter->resetDdlCache($tableName);

        $describe = $adapter->describeTable($tableName);
        $columns  = $this->getColumns();

        $addColumns  = array_diff_key($columns, $describe);
        $dropColumns = array_diff_key($describe, $columns);

        // Drop columns
        foreach (array_keys($dropColumns) as $columnName) {
            if (!in_array($columnName, array(
                    'product_id',
                    'store_id',
                    'data_index',
                    'fulltext_id',
                    'updated',
                    'searchindex_weight')
                )) {
                $adapter->dropColumn($tableName, $columnName);
            }
        }

        // Add columns
        foreach ($addColumns as $columnName => $columnProp) {
            $adapter->addColumn($tableName, $columnName, $columnProp);
        }

        Mage::helper('mstcore/debug')->end($uid);

        return $this;
    }

    protected function getColumns()
    {
        $uid = Mage::helper('mstcore/debug')->start();

        if ($this->_columns === null) {
            $this->_columns = array();
            $this->_columns['updated']            = "int(1) NOT NULL default '1'";
            $this->_columns['searchindex_weight'] = "int(11) NOT NULL default '0'";

            $columns = array();

            $attributes = $this->getIndexModel()->getIndexInstance()->getAttributes();

            foreach ($this->_getSearchableAttributes() as $attribute) {
                $cols = $attribute->getFlatColumns();

                if (!count($cols)) {
                    continue;
                }

                $attributeCode = $attribute->getAttributeCode();

                if (isset($cols[$attributeCode.'_value'])) {
                    $columns[$attributeCode] = $cols[$attributeCode.'_value']['type'].' NULL';
                } else {
                    $columns[$attributeCode] = $cols[$attributeCode]['type'].' NULL';
                }
            }

            foreach ($attributes as $attributeCode => $weight) {
                if (isset($columns[$attributeCode])) {
                    $this->_columns[$attributeCode] = $columns[$attributeCode];
                } else {
                    $this->_columns[$attributeCode] = 'text NULL';
                }
            }
        }

        Mage::helper('mstcore/debug')->end($uid, $this->_columns);

        return $this->_columns;
    }

    protected function _getProductChildIds($productId, $typeId)
    {
        $uid = Mage::helper('mstcore/debug')->start();

        if (!$this->getIndexModel()->getIndexInstance()->getProperty('include_bundled')) {
            return null;
        }

        $result = parent::_getProductChildIds($productId, $typeId);

        Mage::helper('mstcore/debug')->end($uid, $result);

        return $result;
    }

    protected function _saveProductIndexes($storeId, $productIndexes)
    {
        $uid = Mage::helper('mstcore/debug')->start();

        if ($this->_engine) {
            $this->_addRelatedData($productIndexes, $storeId);
            $this->_engine->saveEntityIndexes($storeId, $productIndexes);
        }

        Mage::helper('mstcore/debug')->end($uid);

        return $this;
    }

    protected function _addRelatedData(&$index, $storeId)
    {
        $uid = Mage::helper('mstcore/debug')->start();

        $staticFields = array();
        foreach ($this->_getSearchableAttributes('static') as $attribute) {
            $staticFields[] = $attribute->getAttributeCode();
        }

        foreach ($index as $entityId => $data) {
            $productChildren = array();
            $productChildren = array_merge($productChildren, $this->_getProductChildIds($entityId, 'grouped'));
            $productChildren = array_merge($productChildren, $this->_getProductChildIds($entityId, 'configurable'));
            $relatedProducts = $this->_getSearchableProducts($storeId, $staticFields, $productChildren, 0);
            foreach ($relatedProducts as $pr) {
                foreach ($pr as $attr => $value) {
                    if (isset($index[$entityId][$attr])) {
                        $index[$entityId][$attr] .= ' '.$value;
                        $index[$entityId]['data_index'] .= ' '.$value;
                    }
                }
            }
            // if ($entityId == 135) {
            //     pr($index[$entityId]);
            //     die();
            // }
        }

        Mage::helper('mstcore/debug')->end($uid, array('$index' => $index, '$storeId' => $storeId));
    }

    public function getIndexModel()
    {
        return Mage::helper('searchindex/index')->getIndex('mage_catalog_product');
    }
}
