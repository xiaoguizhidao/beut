<?php
/**
 * @category   BusinessKing
 * @package    BusinessKing_CmsMetaTitle
 * @developer   Business King (http://www.businessapplicationking.com)
 */

$installer = $this;

$installer->startSetup();

$installer->run("

-- DROP TABLE IF EXISTS `{$this->getTable('cms_page_metatitle')}`;
CREATE TABLE `{$this->getTable('cms_page_metatitle')}` (
  `id` SMALLINT(6) NOT NULL auto_increment,
  `page_id` SMALLINT(6) NOT NULL default '0',
  `meta_title` TEXT NOT NULL,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `IDX_ATTRIBUTE_SET_ID_YEAR` (`page_id`),
  KEY `FK_CMS_PAGE_METATITLE_PAGE_ID` (`page_id`),
  CONSTRAINT `FK_CMS_PAGE_METATITLE_PAGE_ID` FOREIGN KEY (`page_id`) REFERENCES `{$this->getTable('cms_page')}` (`page_id`) ON DELETE CASCADE ON UPDATE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

");

$installer->endSetup();
