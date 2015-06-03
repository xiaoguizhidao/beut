<?php

$installer = $this;

$installer->getConnection()->addColumn(
    $installer->getTable("popup"), "modal_video_mp4", "varchar(255) NOT NULL DEFAULT ''"
);

$installer->getConnection()->addColumn(
    $installer->getTable("popup"), "modal_video_ogv", "varchar(255) NOT NULL DEFAULT ''"
);

$installer->getConnection()->addColumn(
    $installer->getTable("popup"), "modal_video_loop", "smallint(6) NOT NULL DEFAULT '0'"
);

$installer->getConnection()->addColumn(
    $installer->getTable("popup"), "modal_background", "varchar(255) NOT NULL DEFAULT ''"
);

$installer->getConnection()->addColumn(
    $installer->getTable("popup"), "modal_color", "varchar(255) NOT NULL DEFAULT ''"
);

$installer->getConnection()->addColumn(
    $installer->getTable("popup"), "modal_opacity", "varchar(50) NOT NULL DEFAULT ''"
);