<?php

/* Added by S2L Solutions <info@s2lsolutions.com> -- Date added: Tue, Apr 1, 2014*/

$this->startSetup();

$this->run("
    ALTER TABLE `{$this->getTable('amshopby/page')}` ADD COLUMN `sitemap` SMALLINT(5) UNSIGNED DEFAULT 0 AFTER `cats`;
    ALTER TABLE `{$this->getTable('amshopby/page')}` ADD COLUMN `priority` FLOAT NOT NULL DEFAULT '1' AFTER `sitemap`;
   
"); 

$this->endSetup();