<?php

$installer = $this;
$installer->startSetup();

$command = <<<EOT
DROP TABLE IF EXISTS `ewcookiemessage_message_rule`;
CREATE TABLE `ewcookiemessage_message_rule` (
  `message_rule_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `status` enum('enabled','disabled') NOT NULL DEFAULT 'enabled',
  `insertion_position` enum('top','bottom','after','before') NOT NULL DEFAULT 'top',
  `store_id` smallint(10) unsigned DEFAULT NULL,
  `website_id` smallint(6) unsigned DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `js_condition` text NOT NULL,
  `element_selector` text NOT NULL,
  `config` text NOT NULL,
  `priority` int(10) unsigned NOT NULL,
  `updated_at` datetime NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`message_rule_id`),
  KEY `idx_store_id` (`store_id`) USING BTREE,
  KEY `idx_website_id` (`website_id`),
  CONSTRAINT `fk_dz37v008loin80l` FOREIGN KEY (`website_id`) REFERENCES `core_website` (`website_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_w8wl352lg76b9hh` FOREIGN KEY (`store_id`) REFERENCES `core_store` (`store_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

EOT;

$command = @preg_replace('/(EXISTS\s+`)([a-z0-9\_]+?)(`)/ie', '"\\1" . $this->getTable("\\2") . "\\3"', $command);
$command = @preg_replace('/(ON\s+`)([a-z0-9\_]+?)(`)/ie', '"\\1" . $this->getTable("\\2") . "\\3"', $command);
$command = @preg_replace('/(REFERENCES\s+`)([a-z0-9\_]+?)(`)/ie', '"\\1" . $this->getTable("\\2") . "\\3"', $command);
$command = @preg_replace('/(TABLE\s+`)([a-z0-9\_]+?)(`)/ie', '"\\1" . $this->getTable("\\2") . "\\3"', $command);
$command = @preg_replace('/(INTO\s+`)([a-z0-9\_]+?)(`)/ie', '"\\1" . $this->getTable("\\2") . "\\3"', $command);
$command = @preg_replace('/(FROM\s+`)([a-z0-9\_]+?)(`)/ie', '"\\1" . $this->getTable("\\2") . "\\3"', $command);

if ($command) $installer->run($command);
$installer->endSetup(); 
