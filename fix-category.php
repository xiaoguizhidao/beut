<?php
	    require_once 'app/Mage.php';
		
		umask(0);
		Mage::app();
		
		$storeId = '0';
		
		Mage::app()->setCurrentStore(Mage_Core_Model_App::ADMIN_STORE_ID);
		
	
		
		$resource = Mage::getSingleton('core/resource');
		$writeConnection = $resource->getConnection('core_write');
		$readConnection = $resource->getConnection('core_read');
		
		$tableCatProd = $resource->getTableName('catalog_category_product');
		
		
		
		
		if(isset($_GET['category_id'])){
					
			$categoryIds = explode(",", $_GET['category_id']);
		}else {
			//Get all category Id but not in catalog_category table. We will get in catalog_category_product table instead
			$select = "SELECT DISTINCT category_id FROM {$tableCatProd}";
			$categoryIds = $readConnection->fetchCol($select);
		}
		
		foreach ($categoryIds as $id){
			
			//if($id != 161) continue;
			
			//Get current negative order numbers first
			$nSql = "SELECT `position` FROM {$tableCatProd} WHERE category_id = {$id} AND `position` < 0 ORDER BY `position` ASC";
			$positions = $readConnection->fetchCol($nSql);
			
			
			//Do update the position
			$sql = "UPDATE {$tableCatProd} SET `position` = CASE `position`  WHEN 0 THEN 999999 WHEN 1 THEN 999999 ";

			if(count($positions)){
				$i=2;
				foreach ($positions as $p){
					$sql .= "WHEN {$p} THEN {$i} ";
					$i++;
				}
			}
			
			
			$sql .= "ELSE `position` END WHERE category_id = {$id}";
			
			
			//execute
			$res = $writeConnection->query($sql);
			
			//Then save the category setting
			if($res){
				$category = Mage::getModel('catalog/category');
				$category->setStoreId($storeId);
				$category->load($id);					
				$category->addData(array('default_sort_by'=>'position'));//Data('default_sort_by', 'position');
				
				$r = $category->save();
				
				if($r){
					echo "Done: {$id} <br>";
				}else {
					echo "Could not save category:  {$id} <br>";
				}
			
			}else {
				echo "Could not write into database! <br>";
			}
			
			
		}
		
		
		//Do reindex category_product table
		//SSH: php indexer.php --reindex catalog_category_product
		//$process = Mage::getModel('index/indexer')->getProcessByCode('catalog_category_product');
		$process = Mage::getModel('index/process')->load(6);		
		$process->reindexAll();
		
		
	
	
?>
