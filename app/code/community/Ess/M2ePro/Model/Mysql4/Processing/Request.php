<?php

/*
 * @copyright  Copyright (c) 2011 by  ESS-UA.
 */

class Ess_M2ePro_Model_Mysql4_Processing_Request extends Ess_M2ePro_Model_Mysql4_Abstract
{
    public function _construct()
    {
        $this->_init('M2ePro/Processing_Request', 'id');
    }
}