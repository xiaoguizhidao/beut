<?php

/*
 * @copyright  Copyright (c) 2011 by  ESS-UA.
 */

class Ess_M2ePro_Model_Mysql4_Ebay_Message extends Ess_M2ePro_Model_Mysql4_Abstract
{
    public function _construct()
    {
        $this->_init('M2ePro/Ebay_Message', 'id');
    }
}