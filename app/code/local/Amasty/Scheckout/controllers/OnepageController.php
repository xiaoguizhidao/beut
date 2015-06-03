<?php
require_once 'Mage/Checkout/controllers/OnepageController.php';
class Amasty_Scheckout_OnepageController extends Mage_Checkout_OnepageController
{
    
    protected $_skip_generate_html = false;
//    public function getOnepage()
//    {
//        return Mage::getSingleton('amscheckout/type_onepage');
//    }
//    
    protected function _saveSteps($completeOrder = FALSE){
        $ret = NULL;
        
        if ($this->_expireAjax()) {
            return;
        }
        
        if ($this->getRequest()->isPost()) {
            
            $quote = $this->getOnepage()->getQuote();
            
            $billing = $this->getRequest()->getPost('billing', array());
            
            $beforeResponse = $this->getResponse();
            
            $amResponse = Mage::getModel("amscheckout/response");
            $this->_response = $amResponse;
            
            $this->_skip_generate_html = true;
            
            $this->saveMethodAction();
            
            $this->saveBillingAction();
            
            $usingShippingCase = isset($billing['use_for_shipping']) ? (int)$billing['use_for_shipping'] : 0;
            
            if (!$usingShippingCase)
                $this->saveShippingAction();
            
            $this->saveShippingMethodAction();
            
            $this->getOnepage()->getQuote()->setTotalsCollectedFlag(false);
            $this->getOnepage()->getQuote()->collectTotals();
            $this->getOnepage()->getQuote()->save();
            
            if (!$quote->getShippingAddress()->getShippingMethod()){
                $hlr = Mage::helper("amscheckout");
                $this->getRequest()->setPost('shipping_method', $hlr->getDefaultShippingMethod($quote));
                $this->saveShippingMethodAction();
            }
            
            $this->savePaymentAction();
                                
                $this->getOnepage()->getQuote()->setTotalsCollectedFlag(false);
            
            if ($completeOrder && $amResponse->getErrorsCount() == 0 && !$amResponse->getRedirect()){
                $this->saveOrderAction();
            }
            
            $this->getOnepage()->getQuote()->collectTotals();
            $this->getOnepage()->getQuote()->save();
            
            $this->_skip_generate_html = false;
            
            $this->_response = $beforeResponse;
            
            $ret = $amResponse;
        }
        
        return $ret;
    }
    
    
    protected function _getRequiredFields(){
        $ret = array(
            "billing" => array(),
            "shipping" => array(),
        );
        
        $hlr = Mage::helper("amscheckout");
        $billingFields = $hlr->getFields("billing");
        $shippingFields = $hlr->getFields("shipping");
        
        foreach($billingFields as $field){
            if ($field["field_required"] == 1 && $field["field_disabled"] == 0)
                $ret["billing"][] = str_replace("billing:", "", $field["field_key"]);
        }
        
        foreach($shippingFields as $field){
            if ($field["field_required"] == 1 && $field["field_disabled"] == 0)
                $ret["shipping"][] = str_replace("shipping:", "", $field["field_key"]);
        }
        return $ret;
        
    }
    
    protected function _reloadRequest($skipRequired = TRUE){
        
        
        $billingDefaults = array(
            'prefix' => '-',
            'postfix' => '-',
            'firstname' => '-',
            'lastname' => '-',
            'email' => 'email@example.com',
            'street' => array(
                '-'
            ),
            'city' => '-',
            'region_id' => '-',
            'region' => '-',
            'postcode' => '-',
            'telephone' => '-',
            'fax' => '-',
            'customer_password' => 'email@example.com',
            'confirm_password' => 'email@example.com'
        );
        
        $shippingDefaults = array(
            'prefix' => '-',
            'postfix' => '-',
            'firstname' => '-',
            'lastname' => '-',
            'street' => array(
                '-'
            ),
            'city' => '-',
            'region_id' => '-',
            'region' => '-',
            'postcode' => '-',
            'telephone' => '-',
            'fax' => '-',
        );
        
        $billing = $this->getRequest()->getPost('billing', array());
        $shipping = $this->getRequest()->getPost('shipping', array());
        
        $requiredFields = $this->_getRequiredFields();
        
        foreach($billingDefaults as $key => $def){
            $val = isset($billing[$key]) ? $billing[$key] : "";

            $empty = $val == "" || (is_array($val) && implode("", $val) == "");
            
            if ($empty){
                
                if ($skipRequired || !in_array($key, $requiredFields["billing"])){
                    $billing[$key] = $def;
                }
                
            }
        }
        
        if (
                isset($billing['customer_password']) &&
                $billing['customer_password'] != $billing['confirm_password'] && 
                $skipRequired
            ){
            
            $billing['confirm_password'] = $billing['customer_password'];
        }
        
        foreach($shippingDefaults as $key => $def){
            $val = isset($shipping[$key]) ? $shipping[$key] : "";

            $empty = $val == "" || (is_array($val) && implode("", $val) == "");
            
            if ($empty){
                
                if ($skipRequired || !in_array($key, $requiredFields["shipping"])){
                    $shipping[$key] = $def;
                }
                
            } 
        }
        
        
        
//        foreach($billing as $key => $val){
//            $empty = $val == "" || (is_array($val) && implode("", $val) == "");
//            if ($empty && isset($billingDefaults[$key])){
//                $billing[$key] = $billingDefaults[$key];
//            }
//        }
//        
//        foreach($shipping as $key => $val){
//            $empty = $val == "" || (is_array($val) && implode("", $val) == "");
//            if ($empty && isset($shippingDefaults[$key])){
//                $shipping[$key] = $shippingDefaults[$key];
//            }
//        }
        $this->getRequest()->setPost('billing', $billing);
        $this->getRequest()->setPost('shipping', $shipping);
    }
    
    public function updateAction(){
        $this->_reloadRequest();
        $amResponse = $this->_saveSteps(FALSE);
        $this->_redirect('*/*/render', array('_secure' => true));
    }
    
    public function renderAction(){
        
        $this->getOnepage()->getQuote()->setTotalsCollectedFlag(false);
        $this->getOnepage()->getQuote()->collectTotals();
        $this->getOnepage()->getQuote()->save();
        
        $this->getResponse()->setBody(Mage::helper('core')->jsonEncode(array(
            "html" => array(
                "review" => $this->_getReviewHtml(),
                "shipping_method" => $this->_getShippingMethodsHtml(),
                "payment_method" => $this->_getPaymentMethodsHtml(),
                
            )
        )));
        
    }
    
    protected function _updateShoppingCart(){
        $hlr = Mage::helper("amscheckout");
        
        $cartData = $this->getRequest()->getParam($hlr->isShoppingCartOnCheckout() && !$hlr->isMergeShoppingCartCheckout() ?
            'cart' : 'review'
        , array());
            
        $filter = new Zend_Filter_LocalizedToNormalized(
            array('locale' => Mage::app()->getLocale()->getLocaleCode())
        );
        foreach ($cartData as $index => $data) {
            if (isset($data['qty'])) {
                $cartData[$index]['qty'] = $filter->filter(trim($data['qty']));
            }
        }

        $cart = $this->_getCart();
        if (! $cart->getCustomerSession()->getCustomer()->getId() && $cart->getQuote()->getCustomerId()) {
            $cart->getQuote()->setCustomerId(null);
        }

        $cartData = $cart->suggestItemsQty($cartData);
        $cart->updateItems($cartData)->save();
    }
    
    protected function _emptyShoppingCart()
    {
        $this->_getCart()->truncate()->save();   
    }
    
    public function cartAction(){
        if ($this->_expireAjax()) {
            return;
        }
        
        $updateAction = (string)$this->getRequest()->getParam('update_cart_action');

        switch ($updateAction) {
            case 'empty_cart':
                $this->_emptyShoppingCart();
                break;
            case 'update_qty':
                $this->_updateShoppingCart();
                break;
            default:
                $this->_updateShoppingCart();
        }
        
        $this->_reloadRequest();
        $amResponse = $this->_saveSteps(FALSE);
        
        
        $this->getResponse()->setBody(Mage::helper('core')->jsonEncode(array(
            "html" => array(
                "review" => $this->_getReviewHtml(),
                "cart" => $this->_getCartHtml(),
                
                "shipping_method" => $this->_getShippingMethodsHtml(),
                "payment_method" => $this->_getPaymentMethodsHtml(),
            )
        )));
    }
    
    public function deleteAction(){
        if ($this->_expireAjax()) {
            return;
        }
        $id = (int) $this->getRequest()->getParam('delete_cart_id');
        
        $this->_getCart()->removeItem($id)
                  ->save();
        
        $this->_reloadRequest();
        $amResponse = $this->_saveSteps(FALSE);
        
        $this->getResponse()->setBody(Mage::helper('core')->jsonEncode(array(
            "html" => array(
                "review" => $this->_getReviewHtml(),
                "cart" => $this->_getCartHtml(),
                
                "shipping_method" => $this->_getShippingMethodsHtml(),
                "payment_method" => $this->_getPaymentMethodsHtml(),
            )
        )));
    }
    
    
    
    public function checkoutAction(){
        $res = array();
        $this->_reloadRequest(FALSE);
        
        $amResponse = $this->_saveSteps(FALSE);
        
        $paymentMethod = $this->getOnepage()->getQuote()->getPayment()->getMethod();
        if (
            $paymentMethod == 'sagepayserver' ||
            $paymentMethod == 'sagepaydirectpro' ||
            $paymentMethod == 'sagepayform'
        ){
            if ($requiredAgreements = Mage::helper('checkout')->getRequiredAgreementIds()) {
                $postedAgreements = array_keys($this->getRequest()->getPost('agreement', array()));
                if ($diff = array_diff($requiredAgreements, $postedAgreements)) {
                    $amResponse = $this->_saveSteps(TRUE);
                }
            }
            
            if ($amResponse->getErrorsCount() == 0){
                
                if ($paymentMethod == 'sagepayserver') {
                    $this->_forward('saveOrder', 'serverPayment', 'sgps', $this->getRequest()->getParams());
                    return;
                } else if ($paymentMethod == 'sagepaydirectpro') {
                    $this->_forward('saveOrder', 'directPayment', 'sgps', $this->getRequest()->getParams());
                    return;
                } else if ($paymentMethod == 'sagepayform') {
                    $this->_forward('saveOrder', 'formPayment', 'sgps', $this->getRequest()->getParams());
                    return;
                }

//                $url = "";
//                
//                if ($paymentMethod == 'sagepaydirectpro'){
//                   $url = Mage::getUrl('sgps/directPayment/saveOrder', $this->getRequest()->getParams()); 
//                } else if ($paymentMethod == 'sagepayform') {
//                   $url = Mage::getUrl('sgps/formPayment/saveOrder', $this->getRequest()->getParams()); 
//                } else {
//                   $url = Mage::getUrl('sgps/serverPayment/saveOrder', $this->getRequest()->getParams());
//                }
//                $res = array(
//                    "ajax_url" => $url
//                );
            } else {
                $res = array(
                    "status" => "error",
                    "errors" => implode("\n", $amResponse->getErrors())
                );
            }
        
        } else {
        $amResponse = $this->_saveSteps(TRUE);
        
        $redirectUrl = $amResponse->getRedirect();
        
        
        if ($redirectUrl){
            $res = array(
                "redirect_url" => $redirectUrl
            );
        }
        else if ($amResponse->getErrorsCount() == 0){
            $res = array(
                "status" => "ok"
            );
        } else {
            $res = array(
                "status" => "error",
                "errors" => implode("\n", $amResponse->getErrors())
            );
        }
        }
        
        $this->getResponse()->setBody(Mage::helper('core')->jsonEncode($res));
        
    }
    
    public function testAction()
    {
        print $this->_getReviewHtml();
    }
    
    public function savePaymentAction()
    {
        $result = array();
        
        if ($this->_expireAjax()) {
            return;
        }
        
        $payment = $this->getRequest()->getPost('payment', array());
        
        try{
                $this->getOnepage()->savePayment($payment);
                
                if($payment){
                    $this->getOnepage()->getQuote()->getPayment()->importData($payment);
                }
                $paymentRedirect = $this->getOnepage()->getQuote()->getPayment()->getCheckoutRedirectUrl();
                
                if ($paymentRedirect){
                    $this->getResponse()->setBody(Mage::helper('core')->jsonEncode(array(
                       'redirect' => $paymentRedirect
                    )));
                } 
                
                
                
        }
        catch(Exception $e) {
                //
        }
        
        return ;
    }
    
    protected function _getShippingMethodsHtml()
    {
        $output = "";
        
        if (!$this->_skip_generate_html){
            $this->getLayout()->getUpdate()->setCacheId(uniqid("amscheckout_shipping"));
            $output = parent::_getShippingMethodsHtml();
        }
        
        return $output;
    }

    protected function _getPaymentMethodsHtml()
    {
        $output = "";
        
        if (!$this->_skip_generate_html){
            
            $this->getLayout()->getUpdate()->setCacheId(uniqid("amscheckout_payment"));
            $output = parent::_getPaymentMethodsHtml();
        }
        
        return $output;
    }

    protected function _getReviewHtml()
    {
        $output = "";
        
        if (!$this->_skip_generate_html){

            $this->getLayout()->getUpdate()->setCacheId(uniqid("amscheckout_review"));
            
            $layout = $this->getLayout();
            $update = $layout->getUpdate();
            $update->load('checkout_onepage_review');
            $layout->generateXml();
            $layout->generateBlocks();
            $output = $layout->getOutput();
            
        }
        
        return $output;
    }
    
    protected function _getCouponHtml()
    {
        $output = "";
        
        if (!$this->_skip_generate_html){
            Mage::app()->getRequest()->setActionName('coupon');
            $this->getLayout()->getUpdate()->setCacheId(uniqid("amscheckout_coupon"));
            $layout = $this->getLayout();
            $update = $layout->getUpdate();
            $update->load('amscheckout_onepage_coupon');
            $layout->generateXml();
            $layout->generateBlocks();
            $output = $layout->getOutput();
            return $output;
        }
        
        return $output;
    }
    
    protected function _getCartHtml()
    {
        $output = "";
        $hlr = Mage::helper("amscheckout");
        
        if (!$this->_skip_generate_html && $hlr->isShoppingCartOnCheckout() && !$hlr->isMergeShoppingCartCheckout()){
            $this->getLayout()->getUpdate()->setCacheId(uniqid("amscheckout_cart"));
            $layout = $this->getLayout();
            $update = $layout->getUpdate();
            $update->load('amscheckout_cart');
            $layout->generateXml();
            $layout->generateBlocks();
            $output = $layout->getOutput();
            return $output;
        }
        
        return $output;
    }
    
    protected function _getCart()
    {
        return Mage::getSingleton('checkout/cart');
    }
    
    public function couponPostAction(){
       
        $response = array(
            "html" => array(
                "coupon" => array(
                    "success" => NULL,
                    "error" => NULL,
                    "output" => NULL
                )
            )
        );
        
        $success = &$response["html"]["coupon"]["success"];
        $error = &$response["html"]["coupon"]["error"];
        $output = &$response["html"]["coupon"]["output"];
        
        $couponCode = (string) $this->getRequest()->getParam('coupon_code');
        if ($this->getRequest()->getParam('remove') == 1) {
            $couponCode = '';
        }
        $oldCouponCode = $this->getOnepage()->getQuote()->getCouponCode();

        if (!strlen($couponCode) && !strlen($oldCouponCode)) {
            
        } else {

            try {
                $codeLength = strlen($couponCode);
        
                $isCodeLengthValid = $codeLength && $codeLength <= 255;

                $this->getOnepage()->getQuote()->getShippingAddress()->setCollectShippingRates(true);
                    $this->getOnepage()->getQuote()->setCouponCode($isCodeLengthValid ? $couponCode : '')
                        ->collectTotals()
                        ->save();

                if ($codeLength) {
                    if ($isCodeLengthValid && $couponCode == $this->getOnepage()->getQuote()->getCouponCode()) {
                        $success = $this->__('Coupon code "%s" was applied.', Mage::helper('core')->escapeHtml($couponCode));
                    } else {
                        $error = $this->__('Coupon code "%s" is not valid.', Mage::helper('core')->escapeHtml($couponCode));
                    }
                } else {
                    $success = $this->__('Coupon code was canceled.');
                }
                
                
                if (!empty($success)){
                    $output = $this->_getCouponHtml();
                    $this->_reloadRequest();
                    $this->_saveSteps(FALSE);
                    $response["html"]["review"] = $this->_getReviewHtml();
                    $response["html"]["shipping_method"] = $this->_getShippingMethodsHtml();
                    $response["html"]["payment_method"] = $this->_getPaymentMethodsHtml();
                }

            } catch (Mage_Core_Exception $e) {
                $error = $e->getMessage();
            } catch (Exception $e) {
                $error = $this->__('Cannot apply the coupon code.');
                Mage::logException($e);
            }
        }
        
        $this->getResponse()->setBody(Mage::helper('core')->jsonEncode($response));
    }
}
?>