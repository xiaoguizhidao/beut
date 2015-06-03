<?php

$installer = $this;
$installer->startSetup();

$command = "
DROP TABLE IF EXISTS `ewautoswitcher_currency_rule`;
CREATE TABLE `ewautoswitcher_currency_rule` (
  `currency_rule_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `status` enum('enabled','disabled') DEFAULT 'enabled',
  `website_id` smallint(5) unsigned DEFAULT NULL,
  `store_id` smallint(5) unsigned DEFAULT NULL,
  `currency_code` varchar(255) NOT NULL,
  `config` text NOT NULL,
  `updated_at` datetime NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`currency_rule_id`),
  UNIQUE KEY `idx_unique` (`currency_code`,`website_id`,`store_id`) USING BTREE,
  KEY `idx_store_id` (`store_id`),
  KEY `idx_website_id` (`website_id`),
  CONSTRAINT `fk_ad3s4flgbwjmf14` FOREIGN KEY (`website_id`) REFERENCES `core_website` (`website_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_kmsf9r41pimpod1` FOREIGN KEY (`store_id`) REFERENCES `core_store` (`store_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;	
		
DROP TABLE IF EXISTS `ewautoswitcher_store_rule`;
CREATE TABLE `ewautoswitcher_store_rule` (
  `store_rule_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `status` enum('enabled','disabled') DEFAULT 'enabled',
  `store_id` smallint(10) unsigned NOT NULL,
  `website_id` smallint(6) unsigned DEFAULT NULL,
  `config` text NOT NULL,
  `priority` int(10) unsigned NOT NULL,
  `updated_at` datetime NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`store_rule_id`),
  KEY `idx_store_id` (`store_id`) USING BTREE,
  KEY `idx_website_id` (`website_id`),
  CONSTRAINT `fk_vowxqf2ojqvvo4d` FOREIGN KEY (`website_id`) REFERENCES `core_website` (`website_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_x3l8lg3sbdeltup` FOREIGN KEY (`store_id`) REFERENCES `core_store` (`store_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
";

$command = @preg_replace('/(EXISTS\s+`)([a-z0-9\_]+?)(`)/ie', '"\\1" . $this->getTable("\\2") . "\\3"', $command);
$command = @preg_replace('/(REFERENCES\s+`)([a-z0-9\_]+?)(`)/ie', '"\\1" . $this->getTable("\\2") . "\\3"', $command);
$command = @preg_replace('/(TABLE\s+`)([a-z0-9\_]+?)(`)/ie', '"\\1" . $this->getTable("\\2") . "\\3"', $command);

if ($command) $installer->run($command);
$installer->endSetup(); 

try {
	Mage::helper('ewautoswitcher/config')->reload()->saveConfigToFallbackStorage();
} catch (Exception $e) {
	Mage::logException($e);
}

try {
	if (Mage::helper('ewcore/environment')->isDemoServer() === true) {
		if (Mage::helper('ewautoswitcher/lock')->lock('install.lock')) {
			 @Mage::helper('ewautoswitcher')->downloadDatabases();
			 Mage::helper('ewautoswitcher/lock')->unlock('install.lock');
		}
	}
} catch (Exception $e) {
	Mage::logException($e);
}