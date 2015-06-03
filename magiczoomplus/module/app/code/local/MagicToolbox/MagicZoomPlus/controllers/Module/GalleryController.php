<?php

class MagicToolbox_MagicZoomPlus_Magiczoomplus_GalleryController extends Mage_Adminhtml_Controller_Action {

    public function uploadAction() {
        try {
            $uploader = new Mage_Core_Model_File_Uploader('image');
            $uploader->setAllowedExtensions(array('jpg','jpeg','gif','png'));
            $uploader->addValidateCallback('catalog_product_image', Mage::helper('catalog/image'), 'validateUploadFile');
            $uploader->setAllowRenameFiles(true);
            $uploader->setFilesDispersion(true);
            $result = $uploader->save($this->getMagiczoomplusBaseMediaPath());

            /**
             * Workaround for prototype 1.7 methods "isJSON", "evalJSON" on Windows OS
             */
            $result['tmp_name'] = str_replace(DS, "/", $result['tmp_name']);
            $result['path'] = str_replace(DS, "/", $result['path']);

            $result['url'] = $this->getMagiczoomplusMediaUrl($result['file']);
            $result['file'] = $result['file'];
            $result['cookie'] = array(
                'name'     => session_name(),
                'value'    => $this->_getSession()->getSessionId(),
                'lifetime' => $this->_getSession()->getCookieLifetime(),
                'path'     => $this->_getSession()->getCookiePath(),
                'domain'   => $this->_getSession()->getCookieDomain()
            );

        } catch (Exception $e) {
            $result = array(
                'error' => $e->getMessage(),
                'errorcode' => $e->getCode());
        }

        $this->getResponse()->setBody(Mage::helper('core')->jsonEncode($result));
    }

    public function getMagiczoomplusMediaUrl($file) {
        $file = str_replace(DS, '/', $file);
        if(substr($file, 0, 1) == '/') {
            $file = substr($file, 1);
        }
        return Mage::getBaseUrl('media').'magictoolbox/magiczoomplus/'.$file;
    }

    public function getMagiczoomplusBaseMediaPath() {
        return Mage::getBaseDir('media').DS.'magictoolbox'.DS.'magiczoomplus';
    }

}
