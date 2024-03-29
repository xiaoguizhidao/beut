<?php

/*
 * @copyright  Copyright (c) 2012 by  ESS-UA.
 */

abstract class Ess_M2ePro_Model_Connector_Server_Buy_Abstract extends Ess_M2ePro_Model_Connector_Server_Command
{
    const COMPONENT = 'Buy';
    const COMPONENT_VERSION = 1;

    /**
     * @var Ess_M2ePro_Model_Marketplace|null
     */
    protected $marketplace = NULL;

    /**
     * @var Ess_M2ePro_Model_Account|null
     */
    protected $account = NULL;

    // ########################################

    public function __construct(array $params = array(),
                                Ess_M2ePro_Model_Marketplace $marketplace = NULL,
                                Ess_M2ePro_Model_Account $account = NULL)
    {
        $this->marketplace = $marketplace;
        $this->account = $account;
        parent::__construct($params);
    }

    // ########################################

    protected function getComponent()
    {
        return self::COMPONENT;
    }

    protected function getComponentVersion()
    {
        return self::COMPONENT_VERSION;
    }

    // ########################################

    public function process()
    {
        if (!is_null($this->account)) {
            $this->requestExtraData['account'] = $this->account->getChildObject()->getServerHash();
        }

        return parent::process();
    }

    // ########################################
}
