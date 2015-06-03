<?php

/*
 * @copyright  Copyright (c) 2011 by  ESS-UA.
 */

class Ess_M2ePro_Block_Adminhtml_Order extends Ess_M2ePro_Block_Adminhtml_Component_Tabs_Container
{
    public function __construct()
    {
        parent::__construct();

        // Set header text
        //------------------------------
        $this->_headerText = Mage::helper('M2ePro')->__('Orders');
        //------------------------------

        $this->_addButton('feedbacks', array(
            'label'     => Mage::helper('M2ePro')->__('Feedbacks'),
            'onclick'   => 'setLocation(\'' .$this->getUrl('*/adminhtml_ebay_feedback/index').'\')',
            'class'     => 'button_link'
        ));

        $this->_addButton('accounts', array(
            'label'     => Mage::helper('M2ePro')->__('Accounts'),
            'onclick'   => 'setLocation(\'' .$this->getUrl('*/adminhtml_account/index').'\')',
            'class'     => 'button_link'
        ));

        $this->_addButton('logs', array(
            'label'     => Mage::helper('M2ePro')->__('View Logs'),
            'onclick'   => 'setLocation(\'' .$this->getUrl('*/adminhtml_log/order').'\')',
            'class'     => 'button_link'
        ));

        $this->_addButton('reset', array(
            'label'     => Mage::helper('M2ePro')->__('Refresh'),
            'onclick'   => 'CommonHandlerObj.reset_click()',
            'class'     => 'reset'
        ));

        $this->useAjax = true;
        $this->tabsAjaxUrls = array(
            self::TAB_ID_EBAY   => $this->getUrl('*/adminhtml_ebay_order/index'),
            self::TAB_ID_AMAZON => $this->getUrl('*/adminhtml_amazon_order/index'),
            self::TAB_ID_BUY    => $this->getUrl('*/adminhtml_buy_order/index'),
        );
    }

    // ########################################

    protected function getHelpBlockJavascript($helpContainerId)
    {
        if (!$this->getRequest()->isXmlHttpRequest()) {
            return '';
        }

        return <<<JAVASCRIPT
<script type="text/javascript">
    setTimeout(function() {
        ModuleNoticeObj.observeModulePrepareStart($('{$helpContainerId}'));
        OrderHandlerObj.initializeGrids();
    }, 50);
</script>
JAVASCRIPT;
    }

    // ########################################

    protected function getEbayTabBlock()
    {
        if (!$this->getChild('ebay_tab')) {
            $this->setChild('ebay_tab', $this->getLayout()->createBlock('M2ePro/adminhtml_ebay_order_grid'));
        }
        return $this->getChild('ebay_tab');
    }

    public function getEbayTabHtml()
    {
        $helpBlock = $this->getLayout()->createBlock('M2ePro/adminhtml_ebay_order_help');
        $javascript = $this->getHelpBlockJavascript($helpBlock->getContainerId());

        $filtersBlock = $this->getLayout()->createBlock('M2ePro/adminhtml_account_switcher', '', array(
            'component_mode' => Ess_M2ePro_Helper_Component_Ebay::NICK,
            'controller_name' => 'adminhtml_order'
        ));
        $filtersBlock->setUseConfirm(false);

        return $javascript . $helpBlock->toHtml() . $filtersBlock->toHtml() . parent::getEbayTabHtml();
    }

    // ########################################

    protected function getAmazonTabBlock()
    {
        if (!$this->getChild('amazon_tab')) {
            $this->setChild('amazon_tab', $this->getLayout()->createBlock('M2ePro/adminhtml_amazon_order_grid'));
        }
        return $this->getChild('amazon_tab');
    }

    public function getAmazonTabHtml()
    {
        $helpBlock = $this->getLayout()->createBlock('M2ePro/adminhtml_amazon_order_help');
        $javascript = $this->getHelpBlockJavascript($helpBlock->getContainerId());

        return $javascript . $helpBlock->toHtml() . $this->getAmazonTabBlockFilterHtml() . parent::getAmazonTabHtml();
    }

    private function getAmazonTabBlockFilterHtml()
    {
        $marketplaceFilterBlock = $this->getLayout()->createBlock('M2ePro/adminhtml_marketplace_switcher', '', array(
            'component_mode' => Ess_M2ePro_Helper_Component_Amazon::NICK,
            'controller_name' => 'adminhtml_order'
        ));
        $marketplaceFilterBlock->setUseConfirm(false);

        $accountFilterBlock = $this->getLayout()->createBlock('M2ePro/adminhtml_account_switcher', '', array(
            'component_mode' => Ess_M2ePro_Helper_Component_Amazon::NICK,
            'controller_name' => 'adminhtml_order'
        ));
        $accountFilterBlock->setUseConfirm(false);

        return '<div class="filter_block">' .
            $marketplaceFilterBlock->toHtml() .
            $accountFilterBlock->toHtml() .
            '</div>';
    }

    // ########################################

    protected function getBuyTabBlock()
    {
        if (!$this->getChild('buy_tab')) {
            $this->setChild('buy_tab', $this->getLayout()->createBlock('M2ePro/adminhtml_buy_order_grid'));
        }
        return $this->getChild('buy_tab');
    }

    public function getBuyTabHtml()
    {
        $helpBlock = $this->getLayout()->createBlock('M2ePro/adminhtml_buy_order_help');
        $javascript = $this->getHelpBlockJavascript($helpBlock->getContainerId());

        return $javascript . $helpBlock->toHtml() . $this->getBuyTabBlockFilterHtml() . parent::getBuyTabHtml();
    }

    private function getBuyTabBlockFilterHtml()
    {
        $accountFilterBlock = $this->getLayout()->createBlock('M2ePro/adminhtml_account_switcher', '', array(
            'component_mode' => Ess_M2ePro_Helper_Component_Buy::NICK,
            'controller_name' => 'adminhtml_order'
        ));
        $accountFilterBlock->setUseConfirm(false);

        return '<div class="filter_block">' . $accountFilterBlock->toHtml() . '</div>';
    }

    // ########################################

    protected function _componentsToHtml()
    {
        $tempGridIds = array();
        Mage::helper('M2ePro/Component_Ebay')->isActive()   && $tempGridIds[] = $this->getEbayTabBlock()->getId();
        Mage::helper('M2ePro/Component_Amazon')->isActive() && $tempGridIds[] = $this->getAmazonTabBlock()->getId();

        $generalBlock = $this->getLayout()->createBlock('M2ePro/adminhtml_order_general');
        $generalBlock->setGridIds($tempGridIds);

        return $generalBlock->toHtml() . parent::_componentsToHtml();
    }

    // ########################################
}