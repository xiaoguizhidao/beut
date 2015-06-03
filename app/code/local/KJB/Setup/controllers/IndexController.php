<?php
class KJB_Setup_IndexController extends Mage_Core_Controller_Front_Action
{
	public function sendmailAction(){
		$this->processSentMail();

    	/* $result = array();
		array_push( $result, array('error' => $error));
        echo json_encode($result); */
	}


	public function processSentMail(){
		$store_id = Mage::app()->getStore()->getId();

		$recepientName = "";

		/*** change email admin at here ***/
		$recepientEmail = Mage::getStoreConfig('kjbsetup/general/admin_email', $store_id);

		/*	only exits $recepientEmail then sent mail to recepient	*/
		if($recepientEmail != ''){
	    	//get template
			
			
			$customer = "Guest";
	    	if(Mage::getSingleton('customer/session')->isLoggedIn()){
				//$customer = Mage::getSingleton('customer/session')->getCustomer()->getName();
				$customer = Mage::getSingleton('customer/session')->getCustomer()->getEmail();
			}
				
			$templateId = Mage::getStoreConfig('kjbsetup/general/template_question_email', $store_id);

			//sender
			$sender = array(
					'name' => $_GET['your_name'],
					'email' => $_GET['your_email'] );

			//data array to sent mail
			$vars = array();
			$vars = array(
					  'subject'		=> Mage::getStoreConfig('kjbsetup/general/subject_email', $store_id),
					  'kjbname'		=> $_GET['your_name'],
					  'kjphone'		=> $_GET['your_phone'],
					  'kjemail'		=> $_GET['your_email'],
					  'question'    => $_GET['your_question'],
					  'kjaddress'		=> $_GET['your_address'],
					  'kjpostcode'		=> $_GET['your_postcode'],
					  'ip'			=> $_GET['your_url'],
					  'date'		=> date("j F Y, H:i:s"),
					  'store_name'	=> Mage::app()->getStore()->getName(),
					  'store_group'	=> Mage::app()->getStore()->getGroup()->getName(),
					  'customer'	=> $customer
			);

			//system info sendmail
			$translate = Mage::getSingleton('core/translate');
			Mage::getModel('core/email_template')
				->sendTransactional($templateId, $sender, $recepientEmail, $recepientName, $vars, $store_id);
			if ($translate->setTranslateInline(true)) {
					Mage::getSingleton('core/session')->addSuccess("Your question has been sent successfully!");
			}
			else {
					Mage::getSingleton('core/session')->addError("There is an error when sending your question!");
			}
			echo $_GET['your_url'];
			return;
		}
    }
}