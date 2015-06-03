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

class RocketWeb_GoogleBaseFeedGenerator_Model_Map_Product_Grouped extends RocketWeb_GoogleBaseFeedGenerator_Model_Map_Product_Abstract
{
	/**
	 * Grouped products doesn't have special price.
	 *
	 * @return float
	 */
	public function getPrice()
    {
		//$price = $this->getProduct()->getMinimalPrice();
		$price = $this->calcMinimalPrice($this->getProduct());
		if ($price <= 0) {
			$this->skip = true;
			if ($this->getConfigVar('log_skip'))
    		{
    			$this->log(sprintf("product id %d product sku %s, skipped - can't determine the minimal price: '%s'.", $this->getProduct()->getId(), $this->getProduct()->getSku(), $price));
    		}
		}
		
		return $price;
    }
    
    public function calcMinimalPrice($product) {
    	$price = 0.0;
		foreach ($product->getTypeInstance()->getAssociatedProducts() as $associatedProduct) {
			$assoc_price = $associatedProduct->getPrice();
			/* To include default quantity of simple product associated to groupped uncomment bellow line:
			   (admin > product page > Associated Products > list of associated > Default Quantity Column)
			*/
			//$assoc_price += $associatedProduct->getPrice() * ($associatedProduct->getQty() > 0 ? $associatedProduct->getQty() : 1);
			$price += $assoc_price;
		}
		
		return $price;
    }
}