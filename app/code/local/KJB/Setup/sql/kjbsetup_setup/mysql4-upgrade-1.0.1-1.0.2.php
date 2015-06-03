<?php

$installer = $this;
$installer->startSetup();

$setup = new Mage_Catalog_Model_Resource_Setup('core_setup');
$setup->removeAttribute('catalog_product','delivery_return');
$setup->removeAttribute('catalog_product','guarantee');
$setup->removeAttribute('catalog_product','brand_logo_url');
$setup->addAttribute('catalog_product', "brand_logo_url", array(
        'group' => 'General',
        'type' => 'text',
        'input' => 'text',
        'label' => 'Brand logo Url',
        'sort_order' => 1002,
        'required' => false,
        'global' => Mage_Catalog_Model_Resource_Eav_Attribute::SCOPE_GLOBAL,
        'required'          => false,
        'visible_on_front'  => true,
        'is_configurable'   => false,
        'used_in_product_listing'   => false,
    )
);
$setup->addAttribute('catalog_product', "delivery_return", array(
    'group' => 'General',
    'type' => 'text',
    'input' => 'textarea',
    'label' => 'Delivery/Returns',
    'sort_order' => 1001,
    'required' => false,
    'global' => Mage_Catalog_Model_Resource_Eav_Attribute::SCOPE_GLOBAL,
    'required'          => false,
    'visible_on_front'  => true,
    'is_configurable'   => false,
    'used_in_product_listing'   => false,
    )
);
$setup->addAttribute('catalog_product', "guarantee", array(
        'group' => 'General',
        'type' => 'text',
        'input' => 'textarea',
        'label' => 'Guarantee',
        'sort_order' => 1002,
        'required' => false,
        'global' => Mage_Catalog_Model_Resource_Eav_Attribute::SCOPE_GLOBAL,
        'required'          => false,
        'visible_on_front'  => true,
        'is_configurable'   => false,
        'used_in_product_listing'   => false,
    )
);

