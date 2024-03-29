<?php

/*
 * @copyright  Copyright (c) 2011 by  ESS-UA.
 */

class Ess_M2ePro_Adminhtml_Ebay_FeedbackController extends Ess_M2ePro_Controller_Adminhtml_MainController
{
    //#############################################

    protected function _initAction()
    {
        $this->loadLayout()
             ->_setActiveMenu('m2epro/communication')
             ->_title(Mage::helper('M2ePro')->__('M2E Pro'))
             ->_title(Mage::helper('M2ePro')->__('Communication'))
             ->_title(Mage::helper('M2ePro')->__('Feedbacks'));

        $this->getLayout()->getBlock('head')
             ->addJs('M2ePro/Ebay/FeedbackHandler.js');

        return $this;
    }

    protected function _isAllowed()
    {
        return Mage::getSingleton('admin/session')->isAllowed('m2epro/communication/feedback');
    }
    //#############################################

    public function indexAction()
    {
        $this->_initAction();
        $this->_addContent($this->getLayout()->createBlock('M2ePro/adminhtml_ebay_feedback'));
        $this->renderLayout();
    }

    public function gridAction()
    {
        $response = $this->loadLayout()->getLayout()->createBlock('M2ePro/adminhtml_ebay_feedback_grid')->toHtml();
        $this->getResponse()->setBody($response);
    }

    //#############################################

    public function saveAction()
    {
        $feedbackId = $this->getRequest()->getParam('feedback_id');
        $feedbackText = $this->getRequest()->getParam('feedback_text');

        $feedbackText = strip_tags($feedbackText);

        $feedback = Mage::getModel('M2ePro/Ebay_Feedback')->loadInstance($feedbackId);
        $feedback->sendResponse($feedbackText, Ess_M2ePro_Model_Ebay_Feedback::TYPE_POSITIVE);
    }

    //#############################################

    public function getFeedbackTemplatesAction()
    {
        $feedbackId = $this->getRequest()->getParam('feedback_id');

        $account = Mage::getModel('M2ePro/Ebay_Feedback')->loadInstance($feedbackId)->getAccount();
        $feedbacksTemplates = $account->getChildObject()->getFeedbackTemplates(false);

        exit(json_encode(array(
            'feedbacks_templates' => $feedbacksTemplates
        )));
    }

    //#############################################

    public function goToOrderAction()
    {
        $feedbackId = $this->getRequest()->getParam('feedback_id');

        if (is_null($feedbackId)) {
            $this->_getSession()->addError(Mage::helper('M2ePro')->__('Feedback is not defined.'));
            return $this->_redirect('*/adminhtml_order/index');
        }

        /** @var $feedback Ess_M2ePro_Model_Ebay_Feedback */
        $feedback = Mage::getModel('M2ePro/Ebay_Feedback')->loadInstance((int)$feedbackId);
        $order = $feedback->getOrder();

        if (is_null($order)) {
            $this->_getSession()->addError(Mage::helper('M2ePro')->__('Requested order was not found.'));
            return $this->_redirect('*/adminhtml_order/index');
        }

        $this->_redirect('*/adminhtml_ebay_order/view', array('id' => $order->getId()));
    }

    //#############################################

    public function goToItemAction()
    {
        $feedbackId = $this->getRequest()->getParam('feedback_id');

        if (is_null($feedbackId)) {
            $this->_getSession()->addError(Mage::helper('M2ePro')->__('Feedback is not defined.'));
            return $this->_redirect('*/*/index');
        }

        /** @var $feedback Ess_M2ePro_Model_Ebay_Feedback */
        $feedback = Mage::getModel('M2ePro/Ebay_Feedback')->loadInstance((int)$feedbackId);
        $itemId = $feedback->getData('ebay_item_id');

        $listingProduct = Mage::getModel('M2ePro/Ebay_Listing_Product')
            ->getParentInstanceByEbayItem($feedback->getData('ebay_item_id'));

        if (!is_null($listingProduct)) {
            $itemUrl = Mage::helper('M2ePro/Component_Ebay')->getItemUrl(
                $itemId,
                $listingProduct->getGeneralTemplate()->getAccount()->getChildObject()->getMode(),
                $listingProduct->getGeneralTemplate()->getMarketplaceId()
            );

            return $this->_redirectUrl($itemUrl);
        }

        $order = $feedback->getOrder();

        if (!is_null($order) && !is_null($order->getMarketplaceId())) {
            $itemUrl = Mage::helper('M2ePro/Component_Ebay')->getItemUrl(
                $itemId,
                $order->getAccount()->getChildObject()->getMode(),
                $order->getMarketplaceId()
            );

            return $this->_redirectUrl($itemUrl);
        }

        $this->_getSession()->addError(Mage::helper('M2ePro')->__('Item\'s Marketplace is Unknown.'));

        return $this->_redirect('*/*/index');
    }

    //#############################################
}