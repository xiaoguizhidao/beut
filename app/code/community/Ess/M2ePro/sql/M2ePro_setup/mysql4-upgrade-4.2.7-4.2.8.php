<?php

//#############################################

/** @var $installer Ess_M2ePro_Model_Upgrade_MySqlSetup */
$installer = $this;
$installer->startSetup();

$connection = $installer->getConnection();

//#############################################

if ((string)Mage::getConfig()->getTablePrefix() != '') {

    $tablesList = $connection->listTables();

    $tempTableWithoutPrefix = 'm2epro_amazon_category_description';
    $tempTable = $installer->getTable($tempTableWithoutPrefix);

    if (in_array($tempTableWithoutPrefix, $tablesList) && !in_array($tempTable, $tablesList)) {
        $query = sprintf('ALTER TABLE %s RENAME TO %s', $tempTableWithoutPrefix, $tempTable);
        $connection->query($query);
    }

    $tempTableWithoutPrefix = 'm2epro_ebay_motor_specific';
    $tempTable = $installer->getTable($tempTableWithoutPrefix);

    if (in_array($tempTableWithoutPrefix, $tablesList) && !in_array($tempTable, $tablesList)) {
        $query = sprintf('ALTER TABLE %s RENAME TO %s', $tempTableWithoutPrefix, $tempTable);
        $connection->query($query);
    }
}

//#############################################

$tempTable = $installer->getTable('m2epro_config');
$priceMode = $connection->query("
    SELECT `value`
    FROM `{$tempTable}`
    WHERE `group` = '/ebay/synchronization/settings/other_listing/source/'
      AND `key` = 'price'
")->fetchColumn();

$finalPriceMode = 4;
if ((int)$priceMode != $finalPriceMode) {

    $installer->run(<<<SQL

UPDATE `m2epro_config`
SET `value` = ''
WHERE `group` = '/ebay/synchronization/settings/other_listing/source/'
  AND `key` = 'customer_group_id';

SQL
    );
}

//#############################################

$installer->run(<<<SQL

UPDATE `m2epro_config`
SET `value` = 'http://docs.m2epro.com/display/eBayAmazonMagentoV42/Video+Tutorials'
WHERE `group` = '/video_tutorials/'
AND `key` = 'baseurl';

SQL
);

//#############################################

$tempTable = $installer->getTable('m2epro_config');
$tempRow = $connection->query("SELECT * FROM `{$tempTable}`
                               WHERE `group` = '/support/knowledge_base/'
                               AND   `key` = 'baseurl'")
                      ->fetch();

if ($tempRow === false) {

    $installer->run(<<<SQL

INSERT INTO `m2epro_config` (`group`,`key`,`value`,`notice`,`update_date`,`create_date`) VALUES
('/support/knowledge_base/', 'baseurl', 'http://support.m2epro.com/knowledgebase',
NULL, '2012-05-21 10:47:49', '2012-05-21 10:47:49');

SQL
);
}

//#############################################

$installer->removeConfigDuplicates();
$installer->endSetup();

//#############################################