<?php


class BS_Canonicalize_Adminhtml_SitemapController extends Mage_Adminhtml_Controller_Action
{
	public function indexAction() {
		
	    $this->_forward('noroute');
	}
	
	public function generateAction()
	{
		try {
    		
    		//Mage::app()->setCurrentStore(1);
    		$res = $this->generateXml();
    		
    		if($res['result']){
    			
    			Mage::getSingleton('adminhtml/session')->addSuccess(Mage::helper('canonicalize')->__('The sitemap has been generated! The sitemap link: <a href="%s">%s</a>',$res['link'],$res['link']));
    		}else {
    			Mage::getSingleton('adminhtml/session')->addError(Mage::helper('canonicalize')->__('An error occured!'));
    		}
    	}catch (Exception $e){
    		Mage::getSingleton('adminhtml/session')->addError($e->getMessage());
    	}
    	
    	$this->_redirectUrl($this->getUrl('adminhtml/system_config/edit', array('section'=>'canonicalize')));
	}
	
	
	public function generateXml()
	{
		
		$website = $this->getRequest()->getParam('website');
		$store   = $this->getRequest()->getParam('store');
		
		$storeId = Mage::app()->getWebsite(true)->getDefaultGroup()->getDefaultStoreId();
		
		if(!is_null($store)){
			$stores = array_keys(Mage::app()->getStores());
	        foreach($stores as $id){
	          $store = Mage::app()->getStore($id);
	          if($store->getCode()==$store) {
	            $storeId = $id;
	          }
	         }
			
		}elseif (!is_null($website) && is_null($store)){
			
		}
		
		$filename = trim(Mage::getStoreConfig('canonicalize/sitemap/filename'));
		if($filename == ''){
			$filename = 'csitemap.xml';
		}
		$path = trim(Mage::getStoreConfig('canonicalize/sitemap/path'));
		if($path == ''){
			$path = 'var/';
		}
		
		$baseUrl = Mage::app()->getStore($storeId)->getBaseUrl(Mage_Core_Model_Store::URL_TYPE_LINK);
		$sitemapLink = $baseUrl.$path.$filename;
		$sitemapLink = str_replace('://', ':::', $sitemapLink);
		$sitemapLink = str_replace('//', '/', $sitemapLink);
		$sitemapLink = str_replace(':::', '://', $sitemapLink);
		
		$date    = Mage::getSingleton('core/date')->gmtDate('Y-m-d');
		
		$io = new Varien_Io_File();
		$io->setAllowCreateFolders(true);
		$io->open(array('path' => str_replace('//', '/', Mage::getBaseDir() .$path)));
	
		if ($io->fileExists($filename) && !$io->isWriteable($filename)) {
			Mage::throwException(Mage::helper('canonicalize')->__('File "%s" cannot be saved. Please, make sure the directory "%s" is writeable by web server.', $filename, $path));
		}
	
		$io->streamOpen($filename);
	
		$io->streamWrite('<?xml version="1.0" encoding="UTF-8"?>' . "\n");
		$io->streamWrite('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
	

		
	
		/**
		 * Generate categories sitemap
		*/
		$changefreq = (string)Mage::getStoreConfig('canonicalize/sitemap/category_changefreq', $storeId);
		$priority   = (string)Mage::getStoreConfig('canonicalize/sitemap/category_priority', $storeId);
		$collection = Mage::getResourceModel('sitemap/catalog_category')->getCollection($storeId);
		foreach ($collection as $item) {
			$xml = sprintf('<url><loc>%s</loc><lastmod>%s</lastmod><changefreq>%s</changefreq><priority>%.1f</priority></url>',
					htmlspecialchars($baseUrl . $item->getUrl()),
					$date,
					$changefreq,
					$priority
			);
			$io->streamWrite($xml);
		}
		unset($collection);
	
		/**
		 * Generate products sitemap
		*/
		$changefreq = (string)Mage::getStoreConfig('canonicalize/sitemap/product_changefreq', $storeId);
		$priority   = (string)Mage::getStoreConfig('canonicalize/sitemap/product_priority', $storeId);
		$collection = Mage::getResourceModel('sitemap/catalog_product')->getCollection($storeId);
		foreach ($collection as $item) {
			$cUrl = $this->getPrimaryUrl($item->getId(), $storeId);
			$url = $baseUrl;
			if($cUrl){
				$url .= $cUrl;
			}else {
				$url .= $item->getUrl();
			}
			$xml = sprintf('<url><loc>%s</loc><lastmod>%s</lastmod><changefreq>%s</changefreq><priority>%.1f</priority></url>',
					htmlspecialchars($url),
					$date,
					$changefreq,
					$priority
			);
			$io->streamWrite($xml);
		}
		unset($collection);
	
		/**
		 * Generate cms pages sitemap
		*/
		$changefreq = (string)Mage::getStoreConfig('canonicalize/sitemap/cms_changefreq', $storeId);
		$priority   = (string)Mage::getStoreConfig('canonicalize/sitemap/cms_priority', $storeId);
		$collection = Mage::getResourceModel('sitemap/cms_page')->getCollection($storeId);
		foreach ($collection as $item) {
			$xml = sprintf('<url><loc>%s</loc><lastmod>%s</lastmod><changefreq>%s</changefreq><priority>%.1f</priority></url>',
					htmlspecialchars($baseUrl . $item->getUrl()),
					$date,
					$changefreq,
					$priority
			);
			$io->streamWrite($xml);
		}
		unset($collection);
	
		$io->streamWrite('</urlset>');
		$result = $io->streamClose();
    	
    	return array('result'=>$result, 'link'=>$sitemapLink);
	
	}
	
	public function getPrimaryUrl($productId, $storeId){
		$resource = Mage::getSingleton('core/resource');
		$writeConnection = $resource->getConnection('core_write');
		$readConnection = $resource->getConnection('core_read');
		$tableUrl = $resource->getTableName('core/url_rewrite');
			
		
	
		$finalUrls = array();
	
		//build up select query for selecting primary url
		$sql = "SELECT * FROM {$tableUrl} WHERE product_id = {$productId} AND store_id = {$storeId} AND is_system = 1 ";
	
		//exlcude cats
		$excludedCatIds = trim(Mage::getStoreConfig('canonicalize/general/exclude_cat_id'));
		$excludeArray = array();
		if($excludedCatIds != ''){
			$excludedCatIds = trim($excludedCatIds, ',');
			$excludeArray = explode(",", $excludedCatIds);
			if($excludedCatIds != ''){
				$sql .= " AND category_id NOT IN ({$excludedCatIds}) ";
			}
	
		}
	
	
		//get all primary cats and their children
		$primaryCatIds = trim(Mage::getStoreConfig('canonicalize/general/primary_cat_id'));
	
	
	
		if($primaryCatIds != ''){
			$primaryCatIds = trim($primaryCatIds, ',');
			if($primaryCatIds != ''){
	
				$newPrimaryCats = '';
				$catIds = explode(",", $primaryCatIds);
				foreach ($catIds as $id){
					$allCats = $this->getAllChildrenCatIds($id);
					$str = implode(",", $allCats);
						
					$newPrimaryCats .= $id.','.$str;
						
				}
	
				$newPrimaryCats = explode(",", $newPrimaryCats);
	
	
				$finalPrimaryCats = array_unique($newPrimaryCats);
	
				if(count($excludeArray)){
					foreach ($excludeArray as $el){
						$key = array_search($el,$finalPrimaryCats);
						if($key!==false){
							unset($finalPrimaryCats[$key]);
						}
					}
				}
				$primaryStr = implode(",", $finalPrimaryCats);
	
				$sql .= " AND category_id IN ({$primaryStr}) ";
	
			}
	
		}
	
		try {
				
			$tempUrls = $readConnection->fetchAll($sql);
			if($tempUrls){
				foreach ($tempUrls as $url){
					$requestPath = $url['request_path'];
					$count = count(explode("/", $requestPath));
	
					$finalUrls[] = array('count'=>$count, 'url'=>$requestPath, 'cat'=>$url['category_id']);
				}
			}
				
				
				
			if(count($finalUrls)){
				$temCountArray = array();
				foreach ($finalUrls as $f){
					$temCountArray[] = $f['count'];
				}
					
				$max = max($temCountArray);
					
				if($finalUrls[0]['count'] == $max){
					return $finalUrls[0]['url'];
				}else {
					usort($finalUrls, function($a, $b) {
						return $b['count'] - $a['count'];
					});
							
						return $finalUrls[0]['url'];
				}
					
					
			}
		}catch (Exception $ex){
			return false;
		}
	
		return false;
			
	}
	
	public function getAllChildrenCatIds($catId){
		$resource = Mage::getSingleton('core/resource');
		$writeConnection = $resource->getConnection('core_write');
		$readConnection = $resource->getConnection('core_read');
		$tableCat = $resource->getTableName('catalog_category_entity');
	
		$sql = "SELECT entity_id FROM {$tableCat} WHERE path LIKE '%/{$catId}/%'";
	
		$catIds = $readConnection->fetchCol($sql);
	
	
		return $catIds;
	}
	
}