<?php

$installer = $this;
$installer->startSetup();

$setup = new Mage_Catalog_Model_Resource_Setup('core_setup');

$setup->addAttribute('catalog_product', "slider_block", array(
    'group' => 'General',
    'type' => 'text',
    'input' => 'text',
    'label' => 'Slider static block',
    'sort_order' => 1001,
    'required' => false,
    'global' => Mage_Catalog_Model_Resource_Eav_Attribute::SCOPE_GLOBAL,
    'required'          => false,
    'visible_on_front'  => true,
    'is_configurable'   => false,
    'used_in_product_listing'   => true,
    )
);
$setup->addAttribute('catalog_product', "block_image_url", array(
        'group' => 'General',
        'type' => 'text',
        'input' => 'text',
        'label' => 'Block Image Url',
        'sort_order' => 1002,
        'required' => false,
        'global' => Mage_Catalog_Model_Resource_Eav_Attribute::SCOPE_GLOBAL,
        'required'          => false,
        'visible_on_front'  => true,
        'is_configurable'   => false,
        'used_in_product_listing'   => true,
    )
);

