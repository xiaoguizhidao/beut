<?php

/*
 * @copyright  Copyright (c) 2011 by  ESS-UA.
 */

class Ess_M2ePro_Model_Mysql4_Amazon_Listing_Product_Variation extends Ess_M2ePro_Model_Mysql4_Component_Child_Abstract
{
    protected $_isPkAutoIncrement = false;

    public function _construct()
    {
        $this->_init('M2ePro/Amazon_Listing_Product_Variation', 'listing_product_variation_id');
        $this->_isPkAutoIncrement = false;
    }
}