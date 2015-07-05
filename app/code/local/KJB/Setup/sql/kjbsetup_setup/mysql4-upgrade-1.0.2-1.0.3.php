<?php

$installer = $this;
$installer->startSetup();

$setup = new Mage_Catalog_Model_Resource_Setup('core_setup');
$setup->removeAttribute('catalog_product','shipping');

$setup->addAttribute('catalog_product', "shipping", array(
        'group' => 'General',
        'type' => 'text',
        'input' => 'text',
        'label' => 'Shipping',
        'sort_order' => 3000,
        'required' => false,
        'global' => Mage_Catalog_Model_Resource_Eav_Attribute::SCOPE_GLOBAL,
        'required'          => false,
        'visible_on_front'  => true,
        'is_configurable'   => false,
        'used_in_product_listing'   => false,
    )
);

