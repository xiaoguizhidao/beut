<?php
/**
 * @author Amasty Team
 * @copyright Amasty
 * @package Amasty_Conf
 * <product_price>Amasty_Conf_Block_Catalog_Product_Price</product_price>
 */
class Amasty_Quickview_Block_Catalog_Product_Price extends Mage_Catalog_Block_Product_Price
{
    private $_confProduct = null;

    public function _toHtml() {        
		$price = '<div style="display: none !important;" id="amasty-product-id-' .  $this->getProduct()->getId() . '" ></div>';
        return $price . parent::_toHtml();
    }

}

