<?php

/* @var $installer BS_Carpet_Model_Resource_Eav_Mysql4_Setup */
$installer = $this;

$installer->startSetup();

$installer->addAttribute(
		'catalog_product',
		'is_carpet_product',
		array (
				'group'             => 'General',
				'group'             => 'General',
                'type'              => 'int',                        
                'label'             => 'Is this Carpet product?',
                'input'             => 'select',
				'source'            => 'eav/entity_attribute_source_boolean',//Mage_Eav_Model_Entity_Attribute_Source_Boolean
                'global'            => Mage_Catalog_Model_Resource_Eav_Attribute::SCOPE_GLOBAL,
                'visible'           => true,
				'required'          => false,
                        
		)
);
$installer->addAttribute(
		'catalog_product',
		'max_carpet_length',
		array (
				'group'             => 'General',
                'type'              => 'decimal',
                'label'             => 'Max Carpet Length (default: unlimited)',
                'input'             => 'text',
                'global'            => Mage_Catalog_Model_Resource_Eav_Attribute::SCOPE_GLOBAL,
                'visible'           => true,
				'required'          => false,
                        

		)
);
$installer->addAttribute(
		'catalog_product',
		'sample_sku',
		array (
				'group'             => 'General',
				'type'              => 'varchar',
				'label'             => 'Sample SKU',
				'input'             => 'text',
				'global'            => Mage_Catalog_Model_Resource_Eav_Attribute::SCOPE_GLOBAL,
				'visible'           => true,
				'required'          => false,


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
