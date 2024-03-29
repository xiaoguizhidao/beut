<?php

$installer = $this;
$installer->startSetup();

$command  = "
ALTER TABLE `ewcookiemessage_message_rule` 
	DROP FOREIGN KEY `fk_dz37v008loin80l`  , 
	DROP FOREIGN KEY `fk_w8wl352lg76b9hh`  ;


/* Alter table in target */
ALTER TABLE `ewcookiemessage_message_rule` 
	ADD COLUMN `js` text  COLLATE utf8_general_ci NOT NULL after `message` , 
	CHANGE `js_condition` `js_condition` text  COLLATE utf8_general_ci NOT NULL after `js` , 
	ADD COLUMN `library_js` text  COLLATE utf8_general_ci NOT NULL after `js_condition` , 
	CHANGE `element_selector` `element_selector` text  COLLATE utf8_general_ci NOT NULL after `library_js` , 
	CHANGE `config` `config` text  COLLATE utf8_general_ci NOT NULL after `element_selector` , 
	CHANGE `priority` `priority` int(10) unsigned   NOT NULL after `config` , 
	CHANGE `updated_at` `updated_at` datetime   NOT NULL after `priority` , 
	CHANGE `created_at` `created_at` datetime   NOT NULL after `updated_at` ; 

/* The foreign keys that were dropped are now re-created*/

ALTER TABLE `ewcookiemessage_message_rule` 
	ADD CONSTRAINT `fk_dz37v008loin80l` 
	FOREIGN KEY (`website_id`) REFERENCES `core_website` (`website_id`) ON DELETE CASCADE ON UPDATE CASCADE , 
	ADD CONSTRAINT `fk_w8wl352lg76b9hh` 
	FOREIGN KEY (`store_id`) REFERENCES `core_store` (`store_id`) ON DELETE CASCADE ON UPDATE CASCADE ;
		
INSERT INTO `ewcookiemessage_message_rule` VALUES (null, 'enabled', 'before', null, null, 'Cookie Notice', '<div id=\"ewcm_container\" style=\"background: #DDDDDD; width: 100%; font-size: 14px; padding: 5px; border-bottom: 1px solid black; text-align: center; z-index: 9998\">\r\nThis site uses cookies. By continuing to browse this site you are agreeing to <a href=\"%%BASE_URL%%/privacy-policy/\">our use of cookies</a> <span style=\"padding-left: 20px; \"> <span style=\"cursor: pointer; border: 1px solid black;\" onclick=\"ewcookiemessage.setCookie(\'ewcm\', 1); $(\'ewcm_container\').hide();\" title=\"Close\">&#10006;</span></span>\r\n</div>', '', '!ewcookiemessage.getCookie(\'ewcm\')', '', 'body', 'a:3:{s:9:\"countries\";a:0:{}s:9:\"languages\";N;s:7:\"regions\";N;}', '0', '2014-06-09 13:47:20', '2014-01-20 23:17:00');
";

$command = @preg_replace('/(EXISTS\s+`)([a-z0-9\_]+?)(`)/ie', '"\\1" . $this->getTable("\\2") . "\\3"', $command);
$command = @preg_replace('/(ON\s+`)([a-z0-9\_]+?)(`)/ie', '"\\1" . $this->getTable("\\2") . "\\3"', $command);
$command = @preg_replace('/(REFERENCES\s+`)([a-z0-9\_]+?)(`)/ie', '"\\1" . $this->getTable("\\2") . "\\3"', $command);
$command = @preg_replace('/(TABLE\s+`)([a-z0-9\_]+?)(`)/ie', '"\\1" . $this->getTable("\\2") . "\\3"', $command);
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