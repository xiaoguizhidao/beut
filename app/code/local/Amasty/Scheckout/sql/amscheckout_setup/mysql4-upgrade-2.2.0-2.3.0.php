<?php
    /**
    * @author Amasty Team
    * @copyright Copyright (c) 2010-2012 Amasty (http://www.amasty.com)
    * @package Amasty_Scheckout
    */
    $installer = $this;
    $installer->startSetup();
    
    $this->run("
        DELETE FROM `{$this->getTable('amscheckout/field')}` 
        WHERE `area_id` IN (SELECT area_id FROM `{$this->getTable('amscheckout/area')}` WHERE area_key IN ('shipping_method', 'payment'));
    ");
    
    $installer->endSetup();
?>