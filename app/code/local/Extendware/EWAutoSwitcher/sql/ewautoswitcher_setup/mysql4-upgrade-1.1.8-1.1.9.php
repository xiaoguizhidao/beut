<?php

$installer = $this;
$installer->startSetup();

$command  = "
ALTER TABLE `ewautoswitcher_currency_rule` 
	DROP FOREIGN KEY `fk_ad3s4flgbwjmf14`  , 
	DROP FOREIGN KEY `fk_kmsf9r41pimpod1`  ;

ALTER TABLE `ewautoswitcher_store_rule` 
	DROP FOREIGN KEY `fk_vowxqf2ojqvvo4d`  , 
	DROP FOREIGN KEY `fk_x3l8lg3sbdeltup`  ;


/* Alter table in target */
ALTER TABLE `ewautoswitcher_currency_rule` 
	ADD COLUMN `name` varchar(255)  COLLATE utf8_general_ci NULL after `store_id` , 
	CHANGE `currency_code` `currency_code` varchar(255)  COLLATE utf8_general_ci NOT NULL after `name` , 
	CHANGE `config` `config` text  COLLATE utf8_general_ci NOT NULL after `currency_code` , 
	CHANGE `updated_at` `updated_at` datetime   NOT NULL after `config` , 
	CHANGE `created_at` `created_at` datetime   NOT NULL after `updated_at` ;

/* Alter table in target */
ALTER TABLE `ewautoswitcher_store_rule` 
	ADD COLUMN `name` varchar(255)  COLLATE utf8_general_ci NULL after `website_id` , 
	CHANGE `config` `config` text  COLLATE utf8_general_ci NOT NULL after `name` , 
	CHANGE `priority` `priority` int(10) unsigned   NOT NULL after `config` , 
	CHANGE `updated_at` `updated_at` datetime   NOT NULL after `priority` , 
	CHANGE `created_at` `created_at` datetime   NOT NULL after `updated_at` ; 

/* The foreign keys that were dropped are now re-created*/

ALTER TABLE `ewautoswitcher_currency_rule` 
	ADD CONSTRAINT `fk_ad3s4flgbwjmf14` 
	FOREIGN KEY (`website_id`) REFERENCES `core_website` (`website_id`) ON DELETE CASCADE ON UPDATE CASCADE , 
	ADD CONSTRAINT `fk_kmsf9r41pimpod1` 
	FOREIGN KEY (`store_id`) REFERENCES `core_store` (`store_id`) ON DELETE CASCADE ON UPDATE CASCADE ;

ALTER TABLE `ewautoswitcher_store_rule` 
	ADD CONSTRAINT `fk_vowxqf2ojqvvo4d` 
	FOREIGN KEY (`website_id`) REFERENCES `core_website` (`website_id`) ON DELETE CASCADE ON UPDATE CASCADE , 
	ADD CONSTRAINT `fk_x3l8lg3sbdeltup` 
	FOREIGN KEY (`store_id`) REFERENCES `core_store` (`store_id`) ON DELETE CASCADE ON UPDATE CASCADE ;
";

$command = @preg_replace('/(EXISTS\s+`)([a-z0-9\_]+?)(`)/ie', '"\\1" . $this->getTable("\\2") . "\\3"', $command);
$command = @preg_replace('/(ON\s+`)([a-z0-9\_]+?)(`)/ie', '"\\1" . $this->getTable("\\2") . "\\3"', $command);
$command = @preg_replace('/(REFERENCES\s+`)([a-z0-9\_]+?)(`)/ie', '"\\1" . $this->getTable("\\2") . "\\3"', $command);
$command = @preg_replace('/(TABLE\s+`)([a-z0-9\_]+?)(`)/ie', '"\\1" . $this->getTable("\\2") . "\\3"', $command);
$installer->run($command);
$installer->endSetup();