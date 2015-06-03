<?php
class Brandammo_Pronav_Block_Category_Widget_Subcategories_List
extends Mage_Catalog_Block_Widget_Link {
	/**
	 * Initialize entity model
	 */
	protected function _construct() {
		parent::_construct();
		$this -> _entityResource = Mage::getResourceSingleton('catalog/category');
	}

	/**
	 * Prepare anchor text using passed text as parameter.
	 * If anchor text was not specified get entity name from DB.
	 *
	 * @return string
	 */
	public function getAnchorText() {
		if(!$this -> _anchorText && $this -> _entityResource) {
			if(!$this -> getData('anchor_text')) {
				$idPath = explode('/', $this -> _getData('id_path'));
				if(isset($idPath[1])) {
					$id = $idPath[1];
					if($id) {
						$this -> _anchorText = $this -> _entityResource -> getAttributeRawValue($id, 'name', Mage::app() -> getStore());
					}
				}
			} else {
				$this -> _anchorText = $this -> getData('anchor_text');
			}
		}

		return $this -> _anchorText;
	}
	
	
	public function getLevels() {
		return $this -> getData('levels'); 
		
	}
	
	public function getSubcategories () {
		$idPath = explode('/', $this -> _getData('id_path'));
		if(isset($idPath[1])) {
			$id = $idPath[1];
			if($id) {
				$cat = Mage::getModel('catalog/category')->load($id);
				/*Returns comma separated ids*/
				$subcats = $cat->getChildren();
				$subIds = explode(',',$subcats);
				return $subIds;
			}
			return array();
		}
		return array();
	}
	
	public function getSortedSubcategories()
    {
        $idPath = explode('/', $this -> _getData('id_path'));
		if(isset($idPath[1])) {
			$id = $idPath[1];
			if($id) {
				return Mage::getModel('catalog/category')->getCollection()->addFieldToFilter('parent_id', $id)->addAttributeToSort('name', 'ASC');
			}
			return array();
		}
		return array();        
    }
	
	private function _removeStoreFromUrls($url) {
		//var_dump($url);
		return preg_replace('%(\?___store=\w{0,})%', '', $url);
	}

}