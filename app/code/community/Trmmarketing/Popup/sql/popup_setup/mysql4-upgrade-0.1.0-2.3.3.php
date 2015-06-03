<?php

$installer = $this;

$installer->getConnection()->addColumn(
    $installer->getTable("popup"), "popupviews", "SMALLINT(11) NOT NULL DEFAULT '0'"
);

$installer->getConnection()->addColumn(
    $installer->getTable("popup"), "popupconversions", "SMALLINT(11) NOT NULL DEFAULT '0'"
);