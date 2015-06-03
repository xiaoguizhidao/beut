<?php
/**
* @author Amasty Team
* @copyright Amasty
* @package Amasty_Ogrid
*/
class Amasty_Scheckout_Model_Observer 
{
    protected function _getOnepage()
    {
        return Mage::getSingleton('checkout/type_onepage');
    }
    
    public function onControllerActionPredispatch($observer){
       if($observer->getEvent()->getControllerAction()->getFullActionName() == 'checkout_cart_index'
               ){
           $hlr = Mage::helper("amscheckout");
            
           if ($hlr->isShoppingCartOnCheckout()) {
                $quote = $this->_getOnepage()->getQuote();
                     if (!$quote->hasItems() || $quote->getHasError() || !$quote->validateMinimumAmount()) {
                         return;
                     } else {
                    // Compose array of messages to add
                     $messages = array();
                     foreach ( $this->_getOnepage()->getQuote()->getMessages() as $message) {
                         if ($message) {
                             // Escape HTML entities in quote message to prevent XSS
                             $message->setCode(Mage::helper('core')->escapeHtml($message->getCode()));
                             $messages[] = $message;
                         }
                     }

                    Mage::getSingleton('customer/session')->addUniqueMessages($messages);

                    foreach(Mage::getSingleton('checkout/session')->getMessages()->getItems() as $message){

                        Mage::getSingleton('customer/session')->addMessage($message);
                    }


                    $url = Mage::getUrl('checkout/onepage', array('_secure'=>true));
                    Mage::app()->getFrontController()->getResponse()->setRedirect($url)->sendResponse();   
                }
           } else {
//               $this->_initQuote();
           }
       } else if ($observer->getEvent()->getControllerAction()->getFullActionName() == 'checkout_onepage_index'){
           $this->_initQuote();
        }
    }
    
    protected function _initQuote(){
        $quote = $this->_getOnepage()->getQuote();
           
        $hlr = Mage::helper("amscheckout");

        if (count($quote->getAllItems()) > 0){

         if ($quote->isVirtual()) {
              $quote->getBillingAddress()->setPaymentMethod($hlr->getDefaultPeymentMethod($quote));
          } else {
              $quote->getShippingAddress()->setPaymentMethod($hlr->getDefaultPeymentMethod($quote));
          }

         $payment = $quote->getPayment();
         $payment->importData(array("method" => $hlr->getDefaultPeymentMethod($quote)));

//           if (!$quote->getBillingAddress()
//                    ->getCountryId()) {

              $quote->getBillingAddress()
                  ->setCountryId($hlr->getDefaultCountry())
                  ->setCity($hlr->getDefaultCity())
                  ->setPostcode($hlr->getDefaultPostcode());
//            }

//            if (!$quote->getShippingAddress()
//                    ->getCountryId()) {

              $quote->getShippingAddress()
                  ->setCountryId($hlr->getDefaultCountry())
                  ->setCity($hlr->getDefaultCity())
                  ->setPostcode($hlr->getDefaultPostcode())
                  ->setSameAsBilling(1)
                  ->setSaveInAddressBook(0)
                  ->setCollectShippingRates(true)
                  ->setShippingMethod($hlr->getDefaultShippingMethod($quote));
//           }

//           $quote->getPayment()->setMethod($hlr->getDefaultPeymentMethod($quote));
         $quote->setTotalsCollectedFlag(false);
         $quote->collectTotals();
         $quote->save();
      }
    }
    
    public function handleBlockOutput($observer)
    {
        
        $block = $observer->getBlock();
        
        $transport = $observer->getTransport();
        $html = null;
        
        if ($block instanceof Mage_Checkout_Block_Onepage_Shipping_Method) {
            $html = $this->_prepareOnepageShippingMethodHtml($transport);
        } else if ($block instanceof Mage_Checkout_Block_Onepage_Payment){
            $html = $this->_prepareOnepagePaymentHtml($transport);
        } else if ($block instanceof  Mage_Checkout_Block_Onepage_Shipping_Method_Available){
            $hlr = Mage::helper("amscheckout");
            if ($hlr->reloadAfterShippingMethodChanged()) {
                $html = $this->_prepareOnepageShippingMethodAvailableHtml($transport);
            }
        } else if ($block instanceof  Mage_Checkout_Block_Onepage_Payment_Methods){
            $hlr = Mage::helper("amscheckout");

            if ($hlr->reloadPaymentShippingMethodChanged()) {
                $html = $this->_prepareOnepagePaymentMethodsHtml($transport);
            }
        } else if ($block instanceof Mage_Checkout_Block_Onepage_Review){
            $html = $this->_prepareOnepageReviewHtml($transport);
        } else if ($block instanceof Mage_Checkout_Block_Agreements){
            $html = $this->_prepareOnepageAgreementsHtml($transport);
        }
        
        if ($html)
            $transport->setHtml($html);
    }
    
     protected function _prepareOnepageShippingMethodAvailableHtml($transport){
        $html = $transport->getHtml();
        $js = array('<script>');
        
        $js[] = '
            $$("#checkout-shipping-method-load input[type=radio]").each(function(input){
                input.observe("click", function(){
                    updateCheckout();
                })
            })
        ';
        
        $js[] = '</script>';
        
        return $html.implode('', $js);
    }
    
    protected function _prepareOnepagePaymentMethodsHtml($transport){
        $html = $transport->getHtml();
        $js = array('<script>');
        
        $js[] = '
            $$("#co-payment-form input[type=checkbox]").each(function(input){
                input.observe("click", function(){
                    updateCheckout();
                })
            })
            
            $$("#co-payment-form input[type=radio]").each(function(input){
                input.observe("click", function(){
                    updateCheckout();
                })
            })
        ';
        
        $js[] = '</script>';
        
        return $html.implode('', $js);
    }
    
    protected function _insertHtml($html, $id, $insert){
        return str_replace(":AM_REPLACE", $insert, $html);
    }
    
    protected function _getLayoutHtml($id){
        
        
        $layout =  Mage::app()->getLayout();
        $layout->getUpdate()->setCacheId(uniqid("amscheckout_".$id));
        $update = $layout->getUpdate();
        $update->load($id);
        $layout->generateXml();
        $layout->generateBlocks();
        return$layout->getOutput();
    }
        
    protected function _prepareOnepageShippingMethodHtml($transport){
        $html = $transport->getHtml();
        $output = $this->_getLayoutHtml("checkout_onepage_shippingmethod");
        return $this->_insertHtml($html, "checkout-shipping-method-load", $output);
    }
    
    protected function _prepareOnepagePaymentHtml($transport){
        $html = $transport->getHtml();
        
        $output = $this->_getLayoutHtml("checkout_onepage_paymentmethod");
        
        return $this->_insertHtml($html, "co-payment-form", $output);
    }
    
    protected function _prepareOnepageReviewHtml($transport){
        $html = $transport->getHtml();
        
        $output = $this->_getLayoutHtml("checkout_onepage_review");
        
        return $this->_insertHtml($html, "checkout-review-load", $output);
    }
    
    protected function _prepareOnepageAgreementsHtml($transport){
        $html = $transport->getHtml();
        $html = str_replace("form", "div", $html);
        return $html;
    }
}
?>