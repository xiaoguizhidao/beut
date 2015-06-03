<?php

/*
 * @copyright  Copyright (c) 2011 by  ESS-UA.
 */

class Ess_M2ePro_Model_Amazon_Template_General extends Ess_M2ePro_Model_Component_Child_Amazon_Abstract
{
    const SKU_MODE_NOT_SET          = 0;
    const SKU_MODE_PRODUCT_ID       = 3;
    const SKU_MODE_DEFAULT          = 1;
    const SKU_MODE_CUSTOM_ATTRIBUTE = 2;

    const GENERAL_ID_MODE_NOT_SET          = 0;
    const GENERAL_ID_MODE_CUSTOM_ATTRIBUTE = 1;

    const WORLDWIDE_ID_MODE_NOT_SET          = 0;
    const WORLDWIDE_ID_MODE_CUSTOM_ATTRIBUTE = 1;

    const SEARCH_BY_MAGENTO_TITLE_MODE_NONE = 0;
    const SEARCH_BY_MAGENTO_TITLE_MODE_YES  = 1;

    const CONDITION_MODE_NOT_SET          = 0;
    const CONDITION_MODE_DEFAULT          = 1;
    const CONDITION_MODE_CUSTOM_ATTRIBUTE = 2;

    const CONDITION_NEW                    = 'New';
    const CONDITION_USED_LIKE_NEW          = 'UsedLikeNew';
    const CONDITION_USED_VERY_GOOD         = 'UsedVeryGood';
    const CONDITION_USED_GOOD              = 'UsedGood';
    const CONDITION_USED_ACCEPTABLE        = 'UsedAcceptable';
    const CONDITION_COLLECTIBLE_LIKE_NEW   = 'CollectibleLikeNew';
    const CONDITION_COLLECTIBLE_VERY_GOOD  = 'CollectibleVeryGood';
    const CONDITION_COLLECTIBLE_GOOD       = 'CollectibleGood';
    const CONDITION_COLLECTIBLE_ACCEPTABLE = 'CollectibleAcceptable';
    const CONDITION_REFURBISHED            = 'Refurbished';
    const CONDITION_CLUB                   = 'Club';

    const CONDITION_NOTE_MODE_NOT_SET          = 0;
    const CONDITION_NOTE_MODE_NONE             = 3;
    const CONDITION_NOTE_MODE_CUSTOM_VALUE     = 1;
    const CONDITION_NOTE_MODE_CUSTOM_ATTRIBUTE = 2;

    const HANDLING_TIME_MODE_NONE             = 0;
    const HANDLING_TIME_MODE_RECOMMENDED      = 1;
    const HANDLING_TIME_MODE_CUSTOM_ATTRIBUTE = 2;

    const RESTOCK_DATE_MODE_NONE              = 1;
    const RESTOCK_DATE_MODE_CUSTOM_VALUE      = 2;
    const RESTOCK_DATE_MODE_CUSTOM_ATTRIBUTE  = 3;

    // ########################################

    public function _construct()
    {
        parent::_construct();
        $this->_init('M2ePro/Amazon_Template_General');
    }

    // ########################################

    /**
     * @return Ess_M2ePro_Model_Account
     */
    public function getAccount()
    {
        return $this->getParentObject()->getAccount();
    }

    /**
     * @return Ess_M2ePro_Model_Marketplace
     */
    public function getMarketplace()
    {
        return $this->getParentObject()->getMarketplace();
    }

    // ########################################

    public function getListings($asObjects = false, array $filters = array())
    {
        return $this->getParentObject->getListings($asObjects,$filters);
    }

    // ########################################

    public function getSkuMode()
    {
        return (int)$this->getData('sku_mode');
    }

    public function isSkuNotSetMode()
    {
        return $this->getSkuMode() == self::SKU_MODE_NOT_SET;
    }

    public function isSkuProductIdMode()
    {
        return $this->getSkuMode() == self::SKU_MODE_PRODUCT_ID;
    }

    public function isSkuDefaultMode()
    {
        return $this->getSkuMode() == self::SKU_MODE_DEFAULT;
    }

    public function isSkuAttributeMode()
    {
        return $this->getSkuMode() == self::SKU_MODE_CUSTOM_ATTRIBUTE;
    }

    public function getSkuSource()
    {
        return array(
            'mode'      => $this->getSkuMode(),
            'attribute' => $this->getData('sku_custom_attribute')
        );
    }

    //-------------------------

    public function getGeneralIdMode()
    {
        return (int)$this->getData('general_id_mode');
    }

    public function isGeneralIdNotSetMode()
    {
        return $this->getGeneralIdMode() == self::GENERAL_ID_MODE_NOT_SET;
    }

    public function isGeneralIdAttributeMode()
    {
        return $this->getGeneralIdMode() == self::GENERAL_ID_MODE_CUSTOM_ATTRIBUTE;
    }

    public function getGeneralIdSource()
    {
        return array(
            'mode'      => $this->getGeneralIdMode(),
            'attribute' => $this->getData('general_id_custom_attribute')
        );
    }

    //-------------------------

    public function getWorldwideIdMode()
    {
        return (int)$this->getData('worldwide_id_mode');
    }

    public function isWorldwideIdNotSetMode()
    {
        return $this->getWorldwideIdMode() == self::WORLDWIDE_ID_MODE_NOT_SET;
    }

    public function isWorldwideIdAttributeMode()
    {
        return $this->getWorldwideIdMode() == self::WORLDWIDE_ID_MODE_CUSTOM_ATTRIBUTE;
    }

    public function getWorldwideIdSource()
    {
        return array(
            'mode'      => $this->getWorldwideIdMode(),
            'attribute' => $this->getData('worldwide_id_custom_attribute')
        );
    }

    //-------------------------

    public function getSearchByMagentoTitleMode()
    {
        return (int)$this->getData('search_by_magento_title_mode');
    }

    public function isSearchByMagentoTitleModeEnabled()
    {
        return $this->getSearchByMagentoTitleMode() == self::SEARCH_BY_MAGENTO_TITLE_MODE_YES;
    }

    //-------------------------

    public function getConditionMode()
    {
        return (int)$this->getData('condition_mode');
    }

    public function isConditionNotSetMode()
    {
        return $this->getConditionMode() == self::CONDITION_MODE_NOT_SET;
    }

    public function isConditionDefaultMode()
    {
        return $this->getConditionMode() == self::CONDITION_MODE_DEFAULT;
    }

    public function isConditionAttributeMode()
    {
        return $this->getConditionMode() == self::CONDITION_MODE_CUSTOM_ATTRIBUTE;
    }

    public function getConditionSource()
    {
        return array(
            'mode'      => $this->getConditionMode(),
            'value'     => $this->getData('condition_value'),
            'attribute' => $this->getData('condition_custom_attribute')
        );
    }

    public function getConditionValues()
    {
        $temp = $this->getData('cache_condition_values');

        if (!empty($temp)) {
            return $temp;
        }

        $reflectionClass = new ReflectionClass (__CLASS__);
        $tempConstants = $reflectionClass->getConstants();

        $values = array();
        foreach ($tempConstants as $key => $value) {
            $prefixKey = strtolower(substr($key,0,14));
            if (substr($prefixKey,0,10) != 'condition_' ||
                in_array($prefixKey,array('condition_mode','condition_note'))) {
                continue;
            }
            $values[] = $value;
        }

        $this->setData('cache_condition_values',$values);

        return $values;
    }

    //-------------------------

    public function getConditionNoteMode()
    {
        return (int)$this->getData('condition_note_mode');
    }

    public function isConditionNoteNotSetMode()
    {
        return $this->getConditionNoteMode() == self::CONDITION_NOTE_MODE_NOT_SET;
    }

    public function isConditionNoteNoneMode()
    {
        return $this->getConditionNoteMode() == self::CONDITION_NOTE_MODE_NONE;
    }

    public function isConditionNoteValueMode()
    {
        return $this->getConditionNoteMode() == self::CONDITION_NOTE_MODE_CUSTOM_VALUE;
    }

    public function isConditionNoteAttributeMode()
    {
        return $this->getConditionNoteMode() == self::CONDITION_NOTE_MODE_CUSTOM_ATTRIBUTE;
    }

    public function getConditionNoteSource()
    {
        return array(
            'mode'      => $this->getConditionNoteMode(),
            'value'     => $this->getData('condition_note_value'),
            'attribute' => $this->getData('condition_note_custom_attribute')
        );
    }

    //----------------------------------------

    public function getHandlingTimeMode()
    {
        return (int)$this->getData('handling_time_mode');
    }

    public function isHandlingTimeNoneMode()
    {
        return $this->getHandlingTimeMode() == self::HANDLING_TIME_MODE_NONE;
    }

    public function isHandlingTimeRecommendedMode()
    {
        return $this->getHandlingTimeMode() == self::HANDLING_TIME_MODE_RECOMMENDED;
    }

    public function isHandlingTimeAttributeMode()
    {
        return $this->getHandlingTimeMode() == self::HANDLING_TIME_MODE_CUSTOM_ATTRIBUTE;
    }

    public function getHandlingTimeSource()
    {
        return array(
            'mode'      => $this->getHandlingTimeMode(),
            'value'     => (int)$this->getData('handling_time_value'),
            'attribute' => $this->getData('handling_time_custom_attribute')
        );
    }

    //----------------------------------------

    public function getRestockDateMode()
    {
        return (int)$this->getData('restock_date_mode');
    }

    public function isRestockDateNoneMode()
    {
        return $this->getRestockDateMode() == self::RESTOCK_DATE_MODE_NONE;
    }

    public function isRestockDateValueMode()
    {
        return $this->getRestockDateMode() == self::RESTOCK_DATE_MODE_CUSTOM_VALUE;
    }

    public function isRestockDateAttributeMode()
    {
        return $this->getRestockDateMode() == self::RESTOCK_DATE_MODE_CUSTOM_ATTRIBUTE;
    }

    public function getRestockDateSource()
    {
        return array(
            'mode'      => $this->getRestockDateMode(),
            'value'     => $this->getData('restock_date_value'),
            'attribute' => $this->getData('restock_date_custom_attribute')
        );
    }

    // ########################################

    public function getTrackingAttributes()
    {
        return array();
    }

    // ########################################
}