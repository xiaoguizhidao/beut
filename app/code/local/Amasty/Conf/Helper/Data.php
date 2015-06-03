<?php
/**
* @author Amasty Team
* @copyright Amasty
* @package Amasty_Conf
*/
class Amasty_Conf_Helper_Data extends Mage_Core_Helper_Abstract
{
    const XML_PATH_NOIMG_IMG            = 'amconf/general/noimage_img';
    const XML_PATH_USE_SIMPLE_PRICE     = 'amconf/general/use_simple_price';
    const XML_PATH_OPTIONS_IMAGE_SIZE   = 'amconf/list/listimg_size';

    public function getImageUrl($optionId, $width, $height)
    {
        $uploadDir = Mage::getBaseDir('media') . DIRECTORY_SEPARATOR . 
                                                    'amconf' . DIRECTORY_SEPARATOR . 'images' . DIRECTORY_SEPARATOR;
        $url = "";
        if (file_exists($uploadDir . $optionId . '.jpg'))
        {
            $url = Mage::getBaseUrl('media') . 'amconf' . '/' . 'images' . '/' . $optionId . '.jpg';
            if($width && $height){
                return Mage::helper('amconf/image')->init($url)->resize($width, $height);
            }
            else{
                return $url;
            }
        }
       
        return $url;
    }
  
    public function getNoimgImgUrl()
    {
        if (Mage::getStoreConfig(self::XML_PATH_NOIMG_IMG))
        {
            return Mage::getBaseUrl('media') . 'amconf/noimg/' . Mage::getStoreConfig(self::XML_PATH_NOIMG_IMG);
        }
        return '';
    }
    
    public function getConfigUseSimplePrice()
    {
        return Mage::getStoreConfig(self::XML_PATH_USE_SIMPLE_PRICE);
    } 
    
    public function getOptionsImageSize()
    {
        return Mage::getStoreConfig(self::XML_PATH_OPTIONS_IMAGE_SIZE);
    } 

    public function getHtmlBlock($_product, $html)
    {
        if(Mage::getStoreConfig('amconf/list/list_index')) {
            $blockForForm = Mage::app()->getLayout()->createBlock('amconf/catalog_product_view_type_configurablelIndex', 'amconf.catalog_product_view_type_configurable');
        }
        else{
            $blockForForm = Mage::app()->getLayout()->createBlock('amconf/catalog_product_view_type_configurablel', 'amconf.catalog_product_view_type_configurable');
        }
        $blockForForm->setTemplate("amasty/amconf/configurable.phtml")->setProduct($_product);
        $blockForForm->setNameInLayout('product.info.options.configurable');
        $html .= '<div class="amconf-block" id="amconf-block-' . $_product->getId() . '">' . $blockForForm->toHtml() . '</div>';

        return $html;
    }
    
    /*  set configurable price as min from simple price
    * templates:
    * app\design\frontend\base\default\template\catalog\product\view\tierprices.phtml
    * app\design\frontend\base\default\template\catalog\product\price.phtml
    * $_product = Mage::helper('amconf')->getSimpleProductWithMinPrice($_product);
    */
    public function getSimpleProductWithMinPrice($_product)
    {
        if($_product->isConfigurable() && (Mage::helper('amconf')->getConfigUseSimplePrice() == 2 ||(Mage::helper('amconf')->getConfigUseSimplePrice() == 1 AND $_product->getData('amconf_simple_price')))){
                
            $conf = Mage::getModel('catalog/product_type_configurable')->setProduct($_product);
            $collection = $conf->getUsedProductCollection()->addAttributeToSelect('*')->addFilterByRequiredOptions();
            
            $tmp = array(
                'min_price' => 0,
                'product'    => null,
            );
            
            foreach($collection as $simple){
                $price = $simple->getFinalPrice();
                if($tmp['min_price'] == 0){
                    $tmp['min_price'] = $price;
                    $tmp['product'] = $simple;
                }
                else if($price < $tmp['min_price']){
                    $tmp['min_price'] = $price;
                    $tmp['product'] = $simple;
                }            
            }
            
            if($tmp['product']) return $tmp['product'];
        }
        
        return  $_product;
    }

    public function getAjaxUrl()
    {
        $url = Mage::getUrl('amconf/ajax/ajax');
        if (isset($_SERVER['HTTPS']) && 'off' != $_SERVER['HTTPS'] && $_SERVER['HTTPS'] != "")
        {
            $url = str_replace('http:', 'https:', $url);
        }
        return $url;
    }
}
