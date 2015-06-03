<?php
$installer = $this;
$installer->startSetup();

$installer->addAttribute(
		'catalog_product',
		'canonicalize',
		array (
				'group'             => 'General',
				'type'              => 'varchar',				
				'label'             => 'Canonical URL',
				'input'             => 'text',
				'global'            => Mage_Catalog_Model_Resource_Eav_Attribute::SCOPE_STORE,
				'required' 			=> 0,
		)
);
/*
 $installer->addAttribute('catalog_product', 'rw_google_base_skip_submi', array(
 		'type' => 'int',
 		'input' => 'select',
 		'backend' => 'catalog/product_attribute_backend_boolean',
 		'source' => 'eav/entity_attribute_source_boolean',
 		'label'    => 'Skip from Being Submitted',
 		'global'    => Mage_Catalog_Model_Resource_Eav_Attribute::SCOPE_STORE,
 		'visible'    => true,
 		'required' => 0,
 		'user_defined' => false,
 		'visible_on_front' => false,
 		'used_for_price_rules' => false,
 		'position' => 10,
 		'default' => 0,
 		'group' => 'Google Base Feed'
 ));
*/


$installer->endSetup(); 