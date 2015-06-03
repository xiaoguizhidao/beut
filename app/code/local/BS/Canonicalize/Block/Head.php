<?php   
/* Added by S2L Solutions <info@s2lsolutions.com> -- Date added: Wed, Feb 19, 2014*/
class BS_Canonicalize_Block_Head extends Mage_Core_Block_Template{   

	protected function _prepareLayout()
	{
		
		$headBlock = $this->getLayout()->getBlock('head');
		$product = Mage::registry('current_product');
		
		if ($headBlock && $product && $this->isEnabled()) {
			
			$productId = $product->getId();		

			$canonicalUrl = $product->getCanonicalize();
			
			if($canonicalUrl != ''){
				$url = $canonicalUrl;
			}else {
				$url = $this->getPrimaryUrl($productId);
			}
			
			
			
			if($url){
				$currentUrl = Mage::helper('core/url')->getCurrentUrl();
				
				$fullUrl = Mage::getBaseUrl(Mage_Core_Model_Store::URL_TYPE_LINK).$url;
				
				if($currentUrl != $fullUrl){
					$headBlock->addLinkRel('canonical', $fullUrl);
				}
				
				
			}
			
			
		}
	
		return parent::_prepareLayout();
	}
	 
	public function isEnabled()
	{
		return Mage::getStoreConfigFlag('canonicalize/general/active');
	}
	
	
	public function getPrimaryUrl($productId){
		$resource = Mage::getSingleton('core/resource');
		$writeConnection = $resource->getConnection('core_write');
		$readConnection = $resource->getConnection('core_read');
		$tableUrl = $resource->getTableName('core/url_rewrite');
			
		$storeId = Mage::app()->getStore()->getId();
		
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