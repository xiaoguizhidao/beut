<?php
/**
 * @copyright   Copyright (c) 2009-2011 Amasty (http://www.amasty.com)
 */ 
class Amasty_Shopby_Model_Observer
{
    public function handleControllerFrontInitRouters($observer) 
    {
    	
        $observer->getEvent()->getFront()
            ->addRouter('amshopby', new Amasty_Shopby_Controller_Router());
    }
    
    public function handleCatalogControllerCategoryInitAfter($observer)
    {
        if (!Mage::getStoreConfig('amshopby/seo/urls'))
            return;
            
        $controller = $observer->getEvent()->getControllerAction();
        $cat = $observer->getEvent()->getCategory();
        
        if (!Mage::helper('amshopby/url')->saveParams($controller->getRequest())){
            if ($cat->getId()  == Mage::app()->getStore()->getRootCategoryId()){
                $cat->setId(0);
                return;
            } 
            else { 
                // no way to tell controler to show 404, do it manually
                $controller->getResponse()->setHeader('HTTP/1.1','404 Not Found');
                $controller->getResponse()->setHeader('Status','404 File not found');
        
                $pageId = Mage::getStoreConfig(Mage_Cms_Helper_Page::XML_PATH_NO_ROUTE_PAGE);
                if (!Mage::helper('cms/page')->renderPage($controller, $pageId)) {
                    header('Location: /');
                    exit;
                }  
                $controller->getResponse()->sendResponse();
                exit;                
            }
        } 
        
        if ($cat->getDisplayMode() == 'PAGE' && Mage::registry('amshopby_current_params')){
            $cat->setDisplayMode('PRODUCTS');
        }  
    }
    
    public function handleLayoutRender()
    {
    	/* 
    	 * Added by S2L Solutions <info@s2lsolutions.com> -- Date added: Sat, Apr 5, 2014
    	 * This is used for banning multi-urls if the attribute selection is in single mode
    	 */
    	
    	/*
    	$check = $this->checkInvalidAttributeSelection();
    	if($check){
    		
    		$url = Mage::helper('amshopby/url')->getFullUrl(null,null,Mage::getModel('catalog/category')->load(Mage::app()->getRequest()->getParam('id')));
    		Mage::app()->getResponse()->setRedirect($url, 301);
    		Mage::app()->getResponse()->sendResponse();
    	}
    	*/
        $layout = Mage::getSingleton('core/layout');
        if (!$layout)
            return;
            
        $isAJAX = Mage::app()->getRequest()->getParam('is_ajax', false);
        $isAJAX = $isAJAX && Mage::app()->getRequest()->isXmlHttpRequest();
        if (!$isAJAX)
            return;
            
        $layout->removeOutputBlock('root');    
        Mage::app()->getFrontController()->getResponse()->setHeader('content-type', 'application/json');
            
        $page = $layout->getBlock('product_list');
        if (!$page){
            $page = $layout->getBlock('search_result_list');
        }
        
        if (!$page)
            return; 
            
        $blocks = array();
        foreach ($layout->getAllBlocks() as $b){
            if (!in_array($b->getNameInLayout(), array('amshopby.navleft','amshopby.navtop','amshopby.navright', 'amshopby.top'))){
                continue;
            }
            $b->setIsAjax(true);
            $html = $b->toHtml();
            if (!$html && false !== strpos($b->getBlockId(), 'amshopby-filters-'))
            {
                // compatibility with "shopper" theme
                // @see catalog/layer/view.phtml
                $queldorei_blocks = Mage::registry('queldorei_blocks');
                if ($queldorei_blocks AND !empty($queldorei_blocks['block_layered_nav']))
                {
                    $html = $queldorei_blocks['block_layered_nav'];
                }
            }
            $blocks[$b->getBlockId()] = $this->_removeAjaxParam($html);                        
        }
        
        if (!$blocks)
            return;

        $container = $layout->createBlock('core/template', 'amshopby_container');
        $container->setData('blocks', $blocks);
        $container->setData('page', $this->_removeAjaxParam($page->toHtml()));
        
        $layout->addOutputBlock('amshopby_container', 'toJson');
    }
    
    /* Added by S2L Solutions <info@s2lsolutions.com> -- Date added: Sat, Apr 5, 2014*/
    public function checkInvalidAttributeSelection(){
    	$params = Mage::app()->getRequest()->getParams();
    	
    	if(count($params)){
    		//category page will have id
    		if(isset($params['id']) && $params['id'] > 0){
    			
    			unset($params['id']);
    			if(count($params)){
    				foreach ($params as $key => $value){
    					if(strpos($value, ",")){
    						if(!isset($params['multi_select'])){//found the wrong selection
    							
    							return true;
    						}
    						
    					}
    				}
    			}
    		}
    	}
    	return false;
    	 
    }
    /* Added by S2L Solutions <info@s2lsolutions.com> -- Date added: Sat, Apr 5, 2014*/
    
    protected function _removeAjaxParam($html)
    {
        $sep = Mage::getStoreConfig('amshopby/seo/special_char');
        $html = str_replace('is' . $sep . 'ajax=1&amp;', '', $html);
        $html = str_replace('is' . $sep . 'ajax=1&', '', $html);
        $html = str_replace('is' . $sep . 'ajax=1', '', $html);
        
        $html = str_replace('___SID=U', '', $html);
        
        return $html;
    }
    
}