<?php
/**
* @author Amasty Team
* @copyright Amasty
* @package Amasty_Scheckout
*/
class Amasty_Scheckout_Model_Mysql4_Country extends Mage_Core_Model_Mysql4_Abstract
{
    public function _construct()
    {    
        $this->_init('amscheckout/country', 'ip_country_id');
    }
}
?>