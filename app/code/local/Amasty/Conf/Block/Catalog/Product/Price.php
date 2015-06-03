<?php
/**
 * @author Amasty Team
 * @copyright Amasty
 * @package Amasty_Conf
 * <product_price>Amasty_Conf_Block_Catalog_Product_Price</product_price>
 */
class Amasty_Conf_Block_Catalog_Product_Price extends Mage_Catalog_Block_Product_Price
{
    private $_confProduct = null;

    public function _toHtml() {
        if ($this->getTemplate() == 'catalog/product/price.phtml') {
            $product = $this->getProduct();
            $product = $this->_confProduct;
            if (is_object($product) && $product->isConfigurable()) {
                $priceHtml = parent::_toHtml();

                /* add label before*/
                $priceTag = '<div class="price-box">';
                $labelHtml = $priceTag .
                            '<span class="label configurable-price-from">' .
                                 $this->__('Price From:') . '
                             </span>';
                $priceHtml = str_replace($priceTag, $labelHtml, $priceHtml);

                /*save configurable id*/
                preg_match_all("/product-price-([0-9]+)/", $priceHtml, $res);
                if($res[0]){
                    return str_replace($res[0][0], "product-price-" . $product->getId(), $priceHtml);

                }
            }
        }
        return parent::_toHtml();
    }

    public function getProduct() {
        $product =  parent::getProduct();
        $this->_confProduct = $product;
        $product = Mage::helper('amconf')->getSimpleProductWithMinPrice($product);

        return $product;
    }
}

