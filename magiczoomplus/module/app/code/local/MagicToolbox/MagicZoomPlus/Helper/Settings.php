<?php

class MagicToolbox_MagicZoomPlus_Helper_Settings extends Mage_Core_Helper_Abstract {

    static private $_toolCoreClass = null;
    static private $_scrollCoreClass = null;
    private $_interface;
    private $_theme;
    //private $_skin;
    private $_productViewMediaTemplateFilename;
    private $_productsListTemplateFilename;
    private $_productsNewTemplateFilename;
    private $_magicToolboxListTemplateFilename;

    public function __construct() {

        $designPackage = Mage::getSingleton('core/design_package');
        $this->_interface = $designPackage->getPackageName();
        $this->_theme = $designPackage->getTheme('template');
        //$this->_skin = $designPackage->getTheme('skin');
        $this->_productViewMediaTemplateFilename = $designPackage->getTemplateFilename('catalog'.DS.'product'.DS.'view'.DS.'media.phtml');
        $this->_productsListTemplateFilename = $designPackage->getTemplateFilename('catalog'.DS.'product'.DS.'list.phtml');
        $this->_productsNewTemplateFilename = $designPackage->getTemplateFilename('catalog'.DS.'product'.DS.'new.phtml');
        $this->_magicToolboxListTemplateFilename = $designPackage->getTemplateFilename('magiczoomplus'.DS.'magictoolbox_list.phtml');

    }

    public function getProductViewMediaTemplateFilename() {

        return $this->_productViewMediaTemplateFilename;

    }

    public function getProductsListTemplateFilename() {

        return $this->_productsListTemplateFilename;

    }

    public function getProductsNewTemplateFilename() {

        return $this->_productsNewTemplateFilename;

    }

    public function getMagicToolboxListTemplateFilename() {

        return $this->_magicToolboxListTemplateFilename;

    }

    public function loadTool($profile = '') {

        if(null === self::$_toolCoreClass) {

            $helper = Mage::helper('magiczoomplus/params');

            require_once(BP . str_replace('/', DS, '/app/code/local/MagicToolbox/MagicZoomPlus/core/magiczoomplus.module.core.class.php'));
            self::$_toolCoreClass = new MagicZoomPlusModuleCoreClass();

            foreach($helper->getDefaultValues() as $block => $params) {
                foreach($params as $id => $value) {
                    self::$_toolCoreClass->params->setValue($id, $value, $block);
                }
            }

            $designPackage = Mage::getSingleton('core/design_package');
            $interface = $designPackage->getPackageName();
            $theme = $designPackage->getTheme('template');
            $coll = Mage::getModel('magiczoomplus/settings')->getCollection();
            $coll->getSelect()->columns('value')->where('package = ?', $interface)->where('theme = ?', $theme);
            if(!$coll->getSize()) {
                $coll->getSelect()->reset(Zend_Db_Select::WHERE)->where('package = ?', 'all')->where('theme = ?', 'all');
            }
            $_params = $coll->getFirstItem()->getValue();
            if(!empty($_params)) {
                $_params = unserialize($_params);
                foreach($_params as $block => $params) {
                    if(is_array($params))
                    foreach($params  as $id => $value) {
                        self::$_toolCoreClass->params->setValue($id, $value, $block);
                    }
                }
            }

            foreach($helper->getBlocks() as $id => $label) {
                switch(self::$_toolCoreClass->params->getValue('enable-effect', $id)) {
                    case 'Zoom':
                        self::$_toolCoreClass->params->setValue('disable-expand', 'Yes', $id);
                    break;
                    case 'Expand':
                        self::$_toolCoreClass->params->setValue('disable-zoom', 'Yes', $id);
                    break;
                    case 'Swap images only':
                        self::$_toolCoreClass->params->setValue('disable-expand', 'Yes', $id);
                        self::$_toolCoreClass->params->setValue('disable-zoom', 'Yes', $id);
                    break;
                }

                /* load locale */
                $locale = $this->__('MagicZoomPlus_LoadingMessage');
                if($locale != 'MagicZoomPlus_LoadingMessage') {
                    self::$_toolCoreClass->params->setValue('loading-msg', $locale, $id);
                }
                $locale = $this->__('MagicZoomPlus_Message');
                if($locale != 'MagicZoomPlus_Message') {
                    self::$_toolCoreClass->params->setValue('message', $locale, $id);
                }
            }

            if(self::$_toolCoreClass->type == 'standard') {
                if(self::$_toolCoreClass->params->checkValue('magicscroll', 'yes', 'product')) {
                    require_once(BP . str_replace('/', DS, '/app/code/local/MagicToolbox/MagicZoomPlus/core/magicscroll.module.core.class.php'));
                    self::$_scrollCoreClass = new MagicScrollModuleCoreClass();
                    self::$_scrollCoreClass->params->setScope('MagicScroll');
                    self::$_scrollCoreClass->params->appendParams(self::$_toolCoreClass->params->getParams('product'));
                    self::$_scrollCoreClass->params->setValue('direction', self::$_scrollCoreClass->params->checkValue('template', array('left', 'right')) ? 'bottom' : 'right');
                }
                require_once(BP . str_replace('/', DS, '/app/code/local/MagicToolbox/MagicZoomPlus/core/magictoolbox.templatehelper.class.php'));
                MagicToolboxTemplateHelperClass::setPath(dirname(Mage::getSingleton('core/design_package')->getTemplateFilename('magiczoomplus'.DS.'media.phtml')) . DS . 'templates');
                MagicToolboxTemplateHelperClass::setOptions(self::$_toolCoreClass->params);
            }
        }

        if($profile) {
            self::$_toolCoreClass->params->setProfile($profile);
        }

        return self::$_toolCoreClass;
    }

    public function loadScroll() {
        return self::$_scrollCoreClass;
    }

    public function magicToolboxGetSizes($sizeType, $originalSizes = null) {

        $w = self::$_toolCoreClass->params->getValue($sizeType.'-max-width');
        $h = self::$_toolCoreClass->params->getValue($sizeType.'-max-height');
        if(empty($w)) $w = 0;
        if(empty($h)) $h = 0;
        if(self::$_toolCoreClass->params->checkValue('square-images', 'No')) {
            list($w, $h) = self::calculate_size($originalSizes[0], $originalSizes[1], $w, $h);
        } else {
            $h = $w = $h ? ($w ? min($w, $h) : $h) : $w;
        }
        return array($w, $h);
    }

    /*public function magicToolboxResizer($product = null, $watermark = 'image', $type = null, $imageFile = null) {
        if($product == null) return false;

        $subdir = 'image';
        $helper = Mage::helper('catalog/image')->init($product, $subdir, $imageFile);
        if($type !== null) {
            $helper->watermark(Mage::getStoreConfig('design/watermark/' . $watermark . '_image'),
                Mage::getStoreConfig('design/watermark/' . $watermark . '_position'),
                Mage::getStoreConfig('design/watermark/' . $watermark . '_size'),
                Mage::getStoreConfig('design/watermark/' . $watermark . '_imageOpacity'));
        }

        $model = Mage::getModel('catalog/product_image');
        $model->setValueDesctinationSubdir($subdir);
        try {
            if($imageFile == null) {
                $model->setValueBaseFile($product->getData($subdir));
            } else {
                $model->setValueBaseFile($imageFile);
            }
        } catch ( Exception $e ) {
            $img = Mage::getDesign()->getSkinUrl() . $helper->getPlaceholder();
            if($type == null) return $img;
            return array($img, $img);
        }

        $img = $helper->__toString();
        if($type == null) return $img;

        $squareImages = false;
        if(self::$_toolCoreClass) {
            if(self::$_toolCoreClass->params->checkValue('square-images', 'Yes')) {
                $squareImages = true;
            }
        }

        $w = self::$_toolCoreClass->params->getValue($type.'-max-width');
        $h = self::$_toolCoreClass->params->getValue($type.'-max-height');

        if(!$squareImages) {
            $size = getimagesize($model->getBaseFile());
            list($w, $h) = self::calculate_size($size[0], $size[1], $w, $h);
        } else {
            $h = $w = min($w, $h);
        }

        $helper->resize($w, $h);
        $thumb = $helper->__toString();
        return array($img, $thumb);
    }*/

    private function calculate_size($originalW, $originalH, $maxW = 0, $maxH = 0) {
        if(!$maxW && !$maxH) {
            return array($originalW, $originalH);
        } elseif(!$maxW) {
            $maxW = ($maxH * $originalW) / $originalH;
        } elseif(!$maxH) {
            $maxH = ($maxW * $originalH) / $originalW;
        }
        $sizeDepends = $originalW/$originalH;
        $placeHolderDepends = $maxW/$maxH;
        if($sizeDepends > $placeHolderDepends) {
            $newW = $maxW;
            $newH = $originalH * ($maxW / $originalW);
        } else {
            $newW = $originalW * ($maxH / $originalH);
            $newH = $maxH;
        }
        return array(round($newW), round($newH));
    }

    public function isModuleOutputEnabled($moduleName = null) {

        if($moduleName === null) {
            $moduleName = 'MagicToolbox_MagicZoomPlus';//$this->_getModuleName();
        }
        if(method_exists('Mage_Core_Helper_Abstract', 'isModuleOutputEnabled')) {
            return parent::isModuleOutputEnabled($moduleName);
        }
        //if (!$this->isModuleEnabled($moduleName)) {
        //    return false;
        //}
        if(Mage::getStoreConfigFlag('advanced/modules_disable_output/' . $moduleName)) {
            return false;
        }
        return true;
    }

}
