<?php
/**
* @author Amasty Team
* @copyright Copyright (c) 2008-2012 Amasty (http://www.amasty.com)
* @package Amasty_Shopby
*/  
class Amasty_Shopby_Adminhtml_PageController extends Mage_Adminhtml_Controller_Action
{
    public function indexAction()
    {
        $this->loadLayout(); 
        $this->_setActiveMenu('catalog/amshopby/pages');
        $this->_addContent($this->getLayout()->createBlock('amshopby/adminhtml_page'));         
        $this->renderLayout();
    }

    public function newAction() 
    {
        $this->editAction(); 
    }
    
    public function editAction() 
    {
        $id     = (int) $this->getRequest()->getParam('id');
        $model  = Mage::getModel('amshopby/page')->load($id);
        
        $cond = $model->getCond();
        if ($cond){
            $cond = unserialize($cond);
            $i=0;
            foreach ($cond as $k=>$v){
                /*
                 * Compatibility
                 */
                if (!is_array($v)) {
                    $model->setData('attr_' . $i, $k);
                    $model->setData('option_' . $i, $v);
                } else {
                    /*
                     * New Logic
                     */
                    $model->setData('attr_' . $i, $v['attribute_code']);
                    $model->setData('option_' . $i, $v['attribute_value']);
                    
                }
                ++$i;
            }
        }

        if ($id && !$model->getId()) {
            Mage::getSingleton('adminhtml/session')->addError(Mage::helper('amshopby')->__('Page does not exist'));
            $this->_redirect('*/*/');
            return;
        }
        
        $data = Mage::getSingleton('adminhtml/session')->getFormData(true);
        if (!empty($data)) {
            $model->setData($data);
        } else {
            $this->prepareForEdit($model);
        }
        
        Mage::register('amshopby_page', $model);
        
        $this->loadLayout();
        $this->_setActiveMenu('catalog/amshopby');
        $this->_title('Edit');
        $this->_addContent($this->getLayout()->createBlock('amshopby/adminhtml_page_edit'));
        
        $this->renderLayout();
    }

    public function saveAction() 
    {
        $id     = $this->getRequest()->getParam('id');
        $model  = Mage::getModel('amshopby/page');
        $data   = $this->getRequest()->getPost();
        if ($data) {
            $model->setData($data)->setId($id);
            
            try {
                $this->prepareForSave($model);
                
                $cond = array();
                for ($i=0; $i < $model->getNum(); ++$i){
                    $cond[] = array(
                        'attribute_code' => $model->getData('attr_' . $i),
                        'attribute_value' => $model->getData('option_' . $i)
                    );
                }
                
                $model->setCond(serialize($cond));
                
                $model->save();
                Mage::getSingleton('adminhtml/session')->setFormData(false);
                
                $msg = Mage::helper('amshopby')->__('Page has been successfully saved');
                Mage::getSingleton('adminhtml/session')->addSuccess($msg);
                if ($this->getRequest()->getParam('continue')){
                    $this->_redirect('*/*/edit', array('id' => $model->getId()));
                }
                else {
                    $this->_redirect('*/*');
                }
               
                
            } catch (Exception $e) {
                Mage::getSingleton('adminhtml/session')->addError($e->getMessage());
                Mage::getSingleton('adminhtml/session')->setFormData($data);
                $this->_redirect('*/*/edit', array('id' => $id));
            }    
                        
            return;
        }
        Mage::getSingleton('adminhtml/session')->addError(Mage::helper('amshopby')->__('Unable to find a page to save'));
        $this->_redirect('*/*/');
    } 
    
    public function optionsAction()
    {
        $name = 'option_' . substr($this->getRequest()->getParam('name'),-1);
        $result = '<input id="'.$name.'" name="'.$name.'" value="" class="input-text" type="text" />';
        
        $code = $this->getRequest()->getParam('code');
        if (!$code){
            $this->getResponse()->setBody($result);
            return;
        }
        
        $attribute = Mage::getModel('catalog/product')->getResource()->getAttribute($code);
        if (!$attribute){
            $this->getResponse()->setBody($result);
            return;            
        }

        if (!in_array($attribute->getFrontendInput(), array('select', 'multiselect')) ){
            $this->getResponse()->setBody($result);
            return;            
        }
        
        $options = $attribute->getFrontend()->getSelectOptions();
        
        if ('select' === $attribute->getFrontendInput()) {
            $result = '<select id="'.$name.'" name="'.$name.'" class="select">';
        } elseif ('multiselect' === $attribute->getFrontendInput()) {
            $result = '<select id="'.$name.'" name="'.$name.'[]" class="select multiselect" multiple="multiple">';
        }
        
        foreach ($options as $option){
            $result .= '<option value="'.$option['value'].'">'.$option['label'].'</option>';      
        }
        $result .= '</select>';    
        
        $this->getResponse()->setBody($result);
        
    }    
        
    public function massDeleteAction()
    {
        $ids = $this->getRequest()->getParam('pages');
        if(!is_array($ids)) {
             Mage::getSingleton('adminhtml/session')->addError(Mage::helper('amshopby')->__('Please select page(s)'));
        } 
        else {
            try {
                foreach ($ids as $id) {
                    $model = Mage::getModel('amshopby/page')->load($id);
                    $model->delete();
                }
                Mage::getSingleton('adminhtml/session')->addSuccess(
                    Mage::helper('adminhtml')->__(
                        'Total of %d record(s) were successfully deleted', count($ids)
                    )
                );
            } catch (Exception $e) {
                Mage::getSingleton('adminhtml/session')->addError($e->getMessage());
            }
        }
        $this->_redirect('*/*/');
    }
    
    
    /* Added by S2L Solutions <info@s2lsolutions.com> -- Date added: Tue, Apr 1, 2014*/
    public function generateAction()
    {

    	try {
    		
    		Mage::app()->setCurrentStore(1);
    		$res = $this->generateXml();
    		
    		if($res['result']){
    			
    			Mage::getSingleton('adminhtml/session')->addSuccess(Mage::helper('amshopby')->__('The sitemap for pages has been generated! The sitemap link: <a href="%s">%s</a>',$res['link'],$res['link']));
    		}else {
    			Mage::getSingleton('adminhtml/session')->addError(Mage::helper('amshopby')->__('An error occured!'));
    		}
    	}catch (Exception $e){
    		Mage::getSingleton('adminhtml/session')->addError($e->getMessage());
    	}
    	
    	$this->_redirectUrl($this->getUrl('adminhtml/system_config/edit', array('section'=>'amshopby')));
    }
    
    public function getPageUrl($cond){
    	$condArray = unserialize($cond);
    
    	$params = array();
    
    	$test = $condArray[0];
    	if(is_array($test)){
    		foreach ($condArray as $c){
    			$params[$c['attribute_code']] = $c['attribute_value'];
    		}
    			
    	}else {
    		$params = $condArray;
    	}
    
    
    	$url = Mage::helper('amshopby/url')->getFullUrl($params);
    		
    	return $url;
    }
    
    
    public function generateXml()
    {
    	
    	$date    = Mage::getSingleton('core/date')->gmtDate('Y-m-d');
    	$changefreq = Mage::getStoreConfig('amshopby/sitemap/changefreq');
    	$filename = Mage::getStoreConfig('amshopby/sitemap/filename');
    	$path = Mage::getStoreConfig('amshopby/sitemap/path');
    	
    	
    	$io = new Varien_Io_File();
    	$io->setAllowCreateFolders(true);
    	$absolutePath = str_replace('//', '/', Mage::getBaseDir() .$path);
    	$io->open(array('path' => $absolutePath));
    
    	if ($io->fileExists($filename) && !$io->isWriteable($filename)) {
    		Mage::throwException(Mage::helper('amshopby')->__('File "%s" cannot be saved. Please, make sure the directory "%s" is writeable by web server.', $filename, $absolutePath));
    	}
    
    	$io->streamOpen($filename);
    
    	$io->streamWrite('<?xml version="1.0" encoding="UTF-8"?>' . "\n");
    	$io->streamWrite('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    

    	
    	$baseUrl = Mage::app()->getStore()->getBaseUrl(Mage_Core_Model_Store::URL_TYPE_LINK);
    	$sitemapLink = $baseUrl.$path.$filename;
    	$sitemapLink = str_replace('://', ':::', $sitemapLink);
    	$sitemapLink = str_replace('//', '/', $sitemapLink);
    	$sitemapLink = str_replace(':::', '://', $sitemapLink);
    
    	/**
    	 * Generate categories sitemap
    	*/
    	$pages = Mage::getModel('amshopby/page')->getCollection()->addFieldToFilter('sitemap', 0);
    		
    	foreach ($pages as $p){
    		$cond = $p->getCond();
    		$url = $this->getPageUrl($cond);    			
    		$priority = $p->getPriority();
    			
    		$xml = sprintf('<url><loc>%s</loc><lastmod>%s</lastmod><changefreq>%s</changefreq><priority>%.1f</priority></url>',
    				htmlspecialchars($url),
    				$date,
    				$changefreq,
    				$priority
    		);
    		$io->streamWrite($xml);
    			
    	}

    	unset($pages);
    
    	
    
    	$io->streamWrite('</urlset>');
    	$result = $io->streamClose();
    	
    	return array('result'=>$result, 'link'=>$sitemapLink);
 
    }
    /* Added by S2L Solutions <info@s2lsolutions.com> -- Date added: Tue, Apr 1, 2014*/
    
    public function deleteAction() 
    {
        if ($this->getRequest()->getParam('id') > 0 ) {
            try {
                $model = Mage::getModel('amshopby/page');
                 
                $model->setId($this->getRequest()->getParam('id'))
                    ->delete();
                     
                Mage::getSingleton('adminhtml/session')->addSuccess(Mage::helper('amshopby')->__('Page has been deleted'));
                $this->_redirect('*/*/');
            } catch (Exception $e) {
                Mage::getSingleton('adminhtml/session')->addError($e->getMessage());
                $this->_redirect('*/*/edit', array('id' => $this->getRequest()->getParam('id')));
            }
        }
        $this->_redirect('*/*/');
    } 
    
    protected function _title($text = null, $resetIfExists = true)
    {
        if (version_compare(Mage::getVersion(), '1.4') < 0){
            return $this;
        }
        return parent::_title($this->__($text), $resetIfExists);
    }     
    
    protected function _setActiveMenu($menuPath)
    {
        $this->getLayout()->getBlock('menu')->setActive($menuPath);
        $this
            ->_title('Catalog')
            ->_title('Improved Navigation')     
            ->_title('Pages')
        ;     
        return $this;
    }
    
    protected function prepareForSave($model)
    {
        // convert categories from array to string
        $cats = $model->getData('cats');
        if (is_array($cats)){
            // need commas to simplify sql query
            $model->setData('cats', implode(',', $cats));    
        } 
        else { // need for null value
            $model->setData('cats', ''); 
        }
    }
    
    protected function prepareForEdit($model)
    {
        $cats = $model->getData('cats');
        if (!is_array($cats)){
            $model->setData('cats', explode(',', $cats));    
        }
        
        return true;
    }
}