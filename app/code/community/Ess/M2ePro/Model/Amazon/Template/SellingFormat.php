<?php

/*
 * @copyright  Copyright (c) 2011 by  ESS-UA.
 */

class Ess_M2ePro_Model_Amazon_Template_SellingFormat extends Ess_M2ePro_Model_Component_Child_Amazon_Abstract
{
    const QTY_MODE_PRODUCT   = 1;
    const QTY_MODE_SINGLE    = 2;
    const QTY_MODE_NUMBER    = 3;
    const QTY_MODE_ATTRIBUTE = 4;

    const PRICE_NOT_SET   = 4;
    const PRICE_NONE      = 0;
    const PRICE_PRODUCT   = 1;
    const PRICE_SPECIAL   = 2;
    const PRICE_ATTRIBUTE = 3;
    const PRICE_FINAL     = 5;

    const DATE_VALUE      = 0;
    const DATE_ATTRIBUTE  = 1;

    // ########################################

    public function _construct()
    {
        parent::_construct();
        $this->_init('M2ePro/Amazon_Template_SellingFormat');
    }

    // ########################################

    public function getListings($asObjects = false, array $filters = array())
    {
        return $this->getParentObject()->getListings($asObjects,$filters);
    }

    // ########################################

    public function getQtyMode()
    {
        return (int)$this->getData('qty_mode');
    }

    public function isQtyModeProduct()
    {
        return $this->getQtyMode() == self::QTY_MODE_PRODUCT;
    }

    public function isQtyModeSingle()
    {
        return $this->getQtyMode() == self::QTY_MODE_SINGLE;
    }

    public function isQtyModeNumber()
    {
        return $this->getQtyMode() == self::QTY_MODE_NUMBER;
    }

    public function isQtyModeAttribute()
    {
        return $this->getQtyMode() == self::QTY_MODE_ATTRIBUTE;
    }

    public function getQtyNumber()
    {
        return (int)$this->getData('qty_custom_value');
    }

    public function getQtySource()
    {
        return array(
            'mode'      => $this->getQtyMode(),
            'value'     => $this->getQtyNumber(),
            'attribute' => $this->getData('qty_custom_attribute')
        );
    }

    public function getQtyAttributes()
    {
        $attributes = array();
        $src = $this->getQtySource();

        if ($src['mode'] == self::QTY_MODE_ATTRIBUTE) {
            $attributes[] = $src['attribute'];
        }

        return $attributes;
    }

    //-------------------------

    public function getCurrency()
    {
        return $this->getData('currency');
    }

    //-------------------------

    public function getPriceMode()
    {
        return (int)$this->getData('price_mode');
    }

    public function isPriceModeProduct()
    {
        return $this->getPriceMode() == self::PRICE_PRODUCT;
    }

    public function isPriceModeSpecial()
    {
        return $this->getPriceMode() == self::PRICE_SPECIAL;
    }

    public function isPriceModeAttribute()
    {
        return $this->getPriceMode() == self::PRICE_ATTRIBUTE;
    }

    public function isPriceModeFinal()
    {
        return $this->getPriceMode() == self::PRICE_FINAL;
    }

    public function getPriceCoefficient()
    {
        return $this->getData('price_coefficient');
    }

    public function getPriceSource()
    {
        return array(
            'mode'        => $this->getPriceMode(),
            'coefficient' => $this->getPriceCoefficient(),
            'attribute'   => $this->getData('price_custom_attribute')
        );
    }

    public function getPriceAttributes()
    {
        $attributes = array();
        $src = $this->getPriceSource();

        if ($src['mode'] == self::PRICE_ATTRIBUTE) {
            $attributes[] = $src['attribute'];
        }

        return $attributes;
    }

    //-------------------------

    public function getSalePriceMode()
    {
        return (int)$this->getData('sale_price_mode');
    }

    public function isSalePriceModeNotSet()
    {
        return $this->getSalePriceMode() == self::PRICE_NOT_SET;
    }

    public function isSalePriceModeNone()
    {
        return $this->getSalePriceMode() == self::PRICE_NONE;
    }

    public function isSalePriceModeProduct()
    {
        return $this->getSalePriceMode() == self::PRICE_PRODUCT;
    }

    public function isSalePriceModeSpecial()
    {
        return $this->getSalePriceMode() == self::PRICE_SPECIAL;
    }

    public function isSalePriceModeAttribute()
    {
        return $this->getSalePriceMode() == self::PRICE_ATTRIBUTE;
    }

    public function isSalePriceModeFinal()
    {
        return $this->getSalePriceMode() == self::PRICE_FINAL;
    }

    public function getSalePriceCoefficient()
    {
        return $this->getData('sale_price_coefficient');
    }

    public function getSalePriceSource()
    {
        return array(
            'mode'        => $this->getSalePriceMode(),
            'coefficient' => $this->getSalePriceCoefficient(),
            'attribute'   => $this->getData('sale_price_custom_attribute')
        );
    }

    public function getSalePriceAttributes()
    {
        $attributes = array();
        $src = $this->getSalePriceSource();

        if ($src['mode'] == self::PRICE_ATTRIBUTE) {
            $attributes[] = $src['attribute'];
        }

        return $attributes;
    }

    //-------------------------

    public function getSalePriceStartDateMode()
    {
        return (int)$this->getData('sale_price_start_date_mode');
    }

    public function isSalePriceStartDateModeValue()
    {
        return $this->getSalePriceStartDateMode() == self::DATE_VALUE;
    }

    public function isSalePriceStartDateModeAttribute()
    {
        return $this->getSalePriceStartDateMode() == self::DATE_ATTRIBUTE;
    }

    public function getSalePriceStartDateValue()
    {
        return $this->getData('sale_price_start_date_value');
    }

    public function getSalePriceStartDateSource()
    {
        return array(
            'mode'        => $this->getSalePriceStartDateMode(),
            'value'       => $this->getSalePriceStartDateValue(),
            'attribute'   => $this->getData('sale_price_start_date_custom_attribute')
        );
    }

    public function getSalePriceStartDateAttributes()
    {
        $attributes = array();
        $src = $this->getSalePriceStartDateSource();

        if ($src['mode'] == self::DATE_ATTRIBUTE) {
            $attributes[] = $src['attribute'];
        }

        return $attributes;
    }

    //-------------------------

    public function getSalePriceEndDateMode()
    {
        return (int)$this->getData('sale_price_end_date_mode');
    }

    public function isSalePriceEndDateModeValue()
    {
        return $this->getSalePriceEndDateMode() == self::DATE_VALUE;
    }

    public function isSalePriceEndDateModeAttribute()
    {
        return $this->getSalePriceEndDateMode() == self::DATE_ATTRIBUTE;
    }

    public function getSalePriceEndDateValue()
    {
        return $this->getData('sale_price_end_date_value');
    }

    public function getSalePriceEndDateSource()
    {
        return array(
            'mode'        => $this->getSalePriceEndDateMode(),
            'value'       => $this->getSalePriceEndDateValue(),
            'attribute'   => $this->getData('sale_price_end_date_custom_attribute')
        );
    }

    public function getSalePriceEndDateAttributes()
    {
        $attributes = array();
        $src = $this->getSalePriceEndDateSource();

        if ($src['mode'] == self::DATE_ATTRIBUTE) {
            $attributes[] = $src['attribute'];
        }

        return $attributes;
    }

    //-------------------------

    public function getCustomerGroupId()
    {
        return (int)$this->getData('customer_group_id');
    }

    // ########################################

    public function getTrackingAttributes()
    {
        return array_unique(array_merge(
            $this->getQtyAttributes(),
            $this->getPriceAttributes(),
            $this->getSalePriceAttributes(),
            $this->getSalePriceStartDateAttributes(),
            $this->getSalePriceEndDateAttributes()
        ));
    }

    // ########################################
}