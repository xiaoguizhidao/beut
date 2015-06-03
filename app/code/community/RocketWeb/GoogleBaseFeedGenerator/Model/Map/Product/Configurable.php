<?php

/**
 * RocketWeb
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/osl-3.0.php
 *
 * @category   RocketWeb
 * @package    RocketWeb_GoogleBaseFeedGenerator
 * @copyright  Copyright (c) 2011 RocketWeb (http://rocketweb.com)
 * @license    http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
 * @author     RocketWeb
 */

class RocketWeb_GoogleBaseFeedGenerator_Model_Map_Product_Configurable extends RocketWeb_GoogleBaseFeedGenerator_Model_Map_Product_Abstract
{
	protected $_assoc_ids;
	protected $_assocs;
	protected $_cache_configurable_attribute_codes;
	
	public function _beforeMap() {
		$this->_assocs = array();
		foreach ($this->getAssocIds() as $assocId)
		{
			$assoc = Mage::getModel('catalog/product');
	    	$assoc->setStoreId($this->getStoreId());
	    	$assoc->getResource()->load($assoc, $assocId);
	    	$this->_assocs[$assocId] = $assoc;
		}
		
		$assocMapArr = array();
		if ($this->getConfig()->isAllowAssociatedMode($this->getStoreId())) {
			foreach ($this->_assocs as $assoc)
			{
				$assocMap = $this->getAssocMapModel($assoc);
				if ($assocMap->checkSkipSubmission()->isSkip())
				{
					if ($this->getConfigVar('log_skip'))
		    		{
		    			$this->log(sprintf("product id %d product sku %s, skipped - product has 'Skip from Being Submitted' = 'Yes'.", $assoc->getId(), $assoc->getSku()));
		    		}
		    		continue;
				}
				$assocMapArr[$assoc->getId()] = $assocMap;
			}
		}
		$this->setAssocMaps($assocMapArr);
		
    	return parent::_beforeMap();
    }
    
    public function _map()
	{
		$rows = array();
		
		if ($this->getConfig()->isAllowConfigurableMode($this->getStoreId())) {
			if (!$this->isSkip())
				$row = parent::_map();
				reset($row);
				$row = current($row);
				$rows[] = $row;
		}
		
		if ($this->getConfig()->isAllowAssociatedMode($this->getStoreId())) {
			foreach ($this->getAssocMaps() as $assocId => $assocMap)
			{
				$row = $assocMap->map();
				reset($row);
				$row = current($row);
				if (!$assocMap->isSkip())
					$rows[] = $row;
			}
		}
		
		return $rows;
	}
    
	/**
     * Array with associated products ids in current store.
     *
     * @return array
     */
	public function getAssocIds()
    {
    	if (is_null($this->_assoc_ids))
			$this->_assoc_ids = $this->loadAssocIds($this->getProduct(), $this->getStoreId());
		return $this->_assoc_ids;
    }
    
	/**
     * @param Mage_Catalog_Model_Product $product
     * @return RocketWeb_GoogleBaseFeedGenerator_Model_Map_Product_Abstract
     */
    protected function getAssocMapModel($product)
    {
    	$params = array(
    		'store_code' => $this->getData('store_code'),
    		'store_id' => $this->getData('store_id'),
    		'website_id' => $this->getData('website_id'),
    	);
    	
    	$productMap = Mage::getModel('googlebasefeedgenerator/map_product_associated', $params);
    	
    	$productMap->setGenerator($this->getGenerator())
    		->setProduct($product)
			->setColumnsMap($this->_columns_map)
			->setEmptyColumnsReplaceMap($this->_empty_columns_replace_map)
			->setParentMap($this)
			->initialize();
    	
    	return $productMap;
    }
    
    /**
     * @param array $params
     * @return string
     */
    protected function mapAttributeWeight($params = array())
    {
    	$map = $params['map'];
    	$product = $this->getProduct();
    	/* @var $product Mage_Catalog_Model_Product */
    	$cell = "";
    	
    	$default_value = isset($map['default_value']) ? $map['default_value'] : "";
    	if ($default_value != "")
    	{
    		$weight = $default_value;
    		$weight .= ' '.$this->getConfigVar('weight_unit_measure', 'columns');
    		
			$cell = $weight;
    		$cell = $this->cleanField($cell);
    		return $cell;
    	}
    	
    	$weight_attribute = $this->getGenerator()->getAttribute($map['attribute']);
		if ($weight_attribute === false)
			Mage::throwException(sprintf('Couldn\'t find attribute \'%s\'.', $map['attribute']));
		
		$weight = $this->getAttributeValue($product, $weight_attribute);
		if ($weight != "")
			$weight .= ' '.$this->getConfigVar('weight_unit_measure', 'columns');
		
		// Configurable doesn't have weight of it's own.
		if ($weight == "")
		{
			$min_price = PHP_INT_MAX;
			foreach ($this->_assocs as $assoc)
			{
				if ($min_price > $assoc->getFinalPrice())
				{
					$min_price = $assoc->getFinalPrice();
					$weight = $this->getAttributeValue($assoc, $weight_attribute);
					break;
				}
			}
		}
		
		if ($weight != "")
			$weight .= ' '.$this->getConfigVar('weight_unit_measure', 'columns');
		
		$cell = $weight;
    	
    	$cell = $this->cleanField($cell);
    	return $cell;
    }
    
	public function getPrice()
    {
    	$price = 0.0;
    	if (!$this->hasSpecialPrice())
    	{
    		$price = $this->calcMinimalPrice($this->getProduct());
    	}
    	else
    	{
    		$price = $this->getProduct()->getPrice();
    	}
    	
    	if ($price <= 0) {
			$this->skip = true;
			if ($this->getConfigVar('log_skip'))
    		{
    			$this->log(sprintf("product id %d product sku %s, skipped - can't determine the minimal price: '%s'.", $this->getProduct()->getId(), $this->getProduct()->getSku(), $price));
    		}
		}
		
		return $price;
    }
    
    /**
     * @return float
     */
    public function calcMinimalPrice($product)
    {
    	$price = 0.0;
    	$minimal_price = PHP_INT_MAX;
		foreach ($this->_assocs as $assoc) {
			if ($minimal_price > $assoc->getPrice()) {
				$minimal_price = $assoc->getPrice();
			}
		}
		if ($minimal_price < PHP_INT_MAX) {
			$price = $minimal_price;
		}
		
		return $price;
    }
    
    /**
     * @return array()
     */
    public function getConfigurableAttributeCodes() {
    	if (is_null($this->_cache_configurable_attribute_codes)) {
    		$this->_cache_configurable_attribute_codes = $this->getTools()
    			->getConfigurableAttributeCodes($this->getProduct()->getId());
    	}
    	return $this->_cache_configurable_attribute_codes;
    }
}