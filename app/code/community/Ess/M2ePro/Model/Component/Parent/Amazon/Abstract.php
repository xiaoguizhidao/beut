<?php

/*
 * @copyright  Copyright (c) 2011 by  ESS-UA.
 */

abstract class Ess_M2ePro_Model_Component_Parent_Amazon_Abstract extends Ess_M2ePro_Model_Component_Parent_Abstract
{
    // ########################################

    public function __construct()
    {
        $args = func_get_args();
        empty($args[0]) && $args[0] = array();
        $params = $args[0];

        $params['child_mode'] = Ess_M2ePro_Helper_Component_Amazon::NICK;

        parent::__construct($params);
    }

    // ########################################
}