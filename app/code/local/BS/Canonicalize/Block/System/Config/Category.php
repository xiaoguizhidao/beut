<?php
/**
 * S2L Solutions <info@snowleopard2lion.com>
 *
 * @module: Sociable
 */
 class BS_Canonicalize_Block_System_Config_Category
    extends Mage_Adminhtml_Block_Abstract
    implements Varien_Data_Form_Element_Renderer_Interface
{
    
    /**
     * Render fieldset html
     *
     * @param Varien_Data_Form_Element_Abstract $element
     * @return string
     */
    public function render(Varien_Data_Form_Element_Abstract $element)
    {
    	$resource = Mage::getSingleton('core/resource');
    	$writeConnection = $resource->getConnection('core_write');
    	$readConnection = $resource->getConnection('core_read');
    	$tableCat = $resource->getTableName('catalog_category_entity');
    	$tableCatVarchar = $resource->getTableName('catalog_category_entity_varchar');
    	
    	
    	$rootCatId = Mage::app()->getWebsite(1)->getDefaultStore()->getRootCategoryId();
    	
    	$sqlVarchar = "SELECT attribute_id FROM `eav_attribute` where attribute_code = 'name' AND entity_type_id = 3";
    	
    	$allCats = $readConnection->fetchAll("SELECT * FROM {$tableCat} WHERE path NOT IN ('1', '1/{$rootCatId}') AND path like '1/{$rootCatId}/%'");
    	
    	$text = "";
    	$count = 1;
    	if($allCats){
    		foreach ($allCats as $cat){
    			$id = $cat['entity_id'];
    			$path = $cat['path'];
    			$path = str_replace("1/{$rootCatId}/", "", $path);
    		
    			$arrayCat = explode("/", $path);
    			$str = "";
    			if($arrayCat){
    				$str .= "<input type='checkbox' class='cat-input' id = '{$arrayCat[count($arrayCat)-1]}' value = '{$arrayCat[count($arrayCat)-1]}' > ";
    				foreach ($arrayCat as $catId){
    					$sql = "SELECT `value` FROM {$tableCatVarchar} WHERE entity_id = {$catId} AND attribute_id = 35";
    					$name = $readConnection->fetchOne($sql);
    		
    					$str .=  "{$name} > ";
    				}
    				$str = substr($str, 0, -3);
    				//$str .= "<br>";
    			}
    			
    			$text .= $str."<br>";
    			
    			
    			
    			
    		}
    	}
    	
    	
    	
    	$msg = "<div style='border: 1px solid #CCCCCC; margin-bottom: 10px;padding: 10px;'>";
    	$msg .= "<a href='javascript::' onClick='toggleList();'>Expand the list of all categories</a>";
    	$msg .= "<div id='bs-canonicalize-cats' style='display: none;'>";
    	$msg .= $text;
    	$msg .= "<br><a href='javascript::' onClick='updatePrimaryCats();'> Put selected categories to Primary Category Ids field</a>";
    	$msg .= "<br><a href='javascript::' onClick='updateExcludeCats();'> Put selected categories to Exclude Category Ids field</a>";
    	$msg .= "<br><a href='javascript::' onClick='clearAll();'> Clear All</a>";
    	$msg .= "<br><a href='javascript::' onClick='toggleList();'> Colapse</a>";
    	$msg .= "</div>";
    	
    	
    	
    	$msg .= "<script type=\"text/javascript\">
    				function updatePrimaryCats(){
    					var textStr = '';
    					$$('.cat-input').each(function (el) {
    						if(el.checked){
    							textStr = textStr + el.value +  ',';
    						}
    					});
    					
    					textStr = textStr.substr(0, textStr.length-1);
    					$('canonicalize_general_primary_cat_id').value = textStr;
    					return false;
    				}
    			
    				function updateExcludeCats(){
    					var textStr = '';
    					$$('.cat-input').each(function (el) {
    						if(el.checked){
    							textStr = textStr + el.value +  ',';
    						}
    					});
    					textStr = textStr.substr(0, textStr.length-1);
    					$('canonicalize_general_exclude_cat_id').value = textStr;
    					return false;
    				}
    				function clearAll(){
    					
    					$$('.cat-input').each(function (el) {
    						el.checked = false;
    					});
    					return false;
    				}
    				
    				function toggleList(){
    					
    					$('bs-canonicalize-cats').toggle();
    					return false;
    				}
    			
    			</script>";
    	
    	$msg .= "</div>";
        
    	return $msg;
    }

   
}
