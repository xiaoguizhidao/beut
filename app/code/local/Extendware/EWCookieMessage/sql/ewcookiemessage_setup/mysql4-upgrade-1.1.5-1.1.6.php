<?php

$installer = $this;
$installer->startSetup();

$command  = "
ALTER TABLE `ewcookiemessage_message_rule` 
	DROP FOREIGN KEY `fk_dz37v008loin80l`  , 
	DROP FOREIGN KEY `fk_w8wl352lg76b9hh`  ;


/* Alter table in target */
ALTER TABLE `ewcookiemessage_message_rule` 
	CHANGE `insertion_position` `insertion_position` enum('top','bottom','after','before','replace','update')  COLLATE utf8_general_ci NOT NULL DEFAULT 'top' after `status` ; 

/* The foreign keys that were dropped are now re-created*/

ALTER TABLE `ewcookiemessage_message_rule` 
	ADD CONSTRAINT `fk_dz37v008loin80l` 
	FOREIGN KEY (`website_id`) REFERENCES `core_website` (`website_id`) ON DELETE CASCADE ON UPDATE CASCADE , 
	ADD CONSTRAINT `fk_w8wl352lg76b9hh` 
	FOREIGN KEY (`store_id`) REFERENCES `core_store` (`store_id`) ON DELETE CASCADE ON UPDATE CASCADE ;	
";

$command = @preg_replace('/(EXISTS\s+`)([a-z0-9\_]+?)(`)/ie', '"\\1" . $this->getTable("\\2") . "\\3"', $command);
$command = @preg_replace('/(ON\s+`)([a-z0-9\_]+?)(`)/ie', '"\\1" . $this->getTable("\\2") . "\\3"', $command);
$command = @preg_replace('/(REFERENCES\s+`)([a-z0-9\_]+?)(`)/ie', '"\\1" . $this->getTable("\\2") . "\\3"', $command);
$command = @preg_replace('/(TABLE\s+`)([a-z0-9\_]+?)(`)/ie', '"\\1" . $this->getTable("\\2") . "\\3"', $command);
$command = @preg_replace('/(INTO\s+`)([a-z0-9\_]+?)(`)/ie', '"\\1" . $this->getTable("\\2") . "\\3"', $command);
$command = @preg_replace('/(FROM\s+`)([a-z0-9\_]+?)(`)/ie', '"\\1" . $this->getTable("\\2") . "\\3"', $command);

$installer->run($command);
$installer->endSetup();

try {
	Mage::helper('ewcookiemessage/config')->reload()->saveConfigToFallbackStorage();
} catch (Exception $e) {
	Mage::logException($e);
}

try {
	if (Mage::helper('ewcore/environment')->isDemoServer() === true) {
		if (Mage::helper('ewcookiemessage/lock')->lock('install.lock')) {
			 @Mage::helper('ewcookiemessage')->downloadDatabases();
			 Mage::helper('ewcookiemessage/lock')->unlock('install.lock');
		}
	}
} catch (Exception $e) {
	Mage::logException($e);
}