<?php

$installer = $this;
$installer->startSetup();

$setup = new Mage_Catalog_Model_Resource_Setup('core_setup');
$setup->removeAttribute('catalog_product','product_avaiability');

$setup->addAttribute('catalog_product', "product_avaiability", array(
        'group' => 'General',
        'type' => 'text',
        'input' => 'text',
        'label' => 'Avaiability',
        'sort_order' => 3000,
        'required' => false,
        'global' => Mage_Catalog_Model_Resource_Eav_Attribute::SCOPE_GLOBAL,
        'required'          => false,
        'visible_on_front'  => true,
        'is_configurable'   => false,
        'used_in_product_listing'   => false,
    )
);


