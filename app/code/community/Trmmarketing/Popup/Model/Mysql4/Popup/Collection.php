<?php
/**
 * @category    Trmmarketing
 * @package     Trmmarketing_PopupWidgets
 * @copyright   Copyright (c) 2013 TRM Marketing LLC
 * @license     http://www.trm-marketing.com/solutions/license/TRM-Marketing-Standard-License-Agreement.html
 */
class Trmmarketing_Popup_Model_Mysql4_Popup_Collection extends Mage_Core_Model_Mysql4_Collection_Abstract
{
    public function _construct()
    {
        parent::_construct();
        $this->_init('popup/popup');
    }
}