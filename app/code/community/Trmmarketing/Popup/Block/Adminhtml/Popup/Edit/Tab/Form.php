<?php
/**
 * @category    Trmmarketing
 * @package     Trmmarketing_PopupWidgets
 * @copyright   Copyright (c) 2013 TRM Marketing LLC
 * @license     http://www.trm-marketing.com/solutions/license/TRM-Marketing-Standard-License-Agreement.html
 */

class Trmmarketing_Popup_Block_Adminhtml_Popup_Edit_Tab_Form extends Mage_Adminhtml_Block_Widget_Form
{
  protected function _prepareForm()
  {
      $form = new Varien_Data_Form();
      $this->setForm($form);
      $fieldset = $form->addFieldset('popup_form', array('legend'=>Mage::helper('popup')->__('Pop-up Settings')));
     
      $fieldset->addField('title', 'text', array(
          'label'     => Mage::helper('popup')->__('Title'),
          'class'     => 'required-entry',
          'required'  => true,
          'name'      => 'title',
      ));
	  
	  /*
	  
	  $fieldset->addField('template', 'select', array(
          'label'     => Mage::helper('popup')->__('Template'),
          'name'      => 'template',
		  'onclick'=>'modifyTargetElement(this)',
		  'onchange'=>'modifyTargetElement(this)',
          'values'    => array(
              array(
                  'value'     => 'blank',
                  'label'     => Mage::helper('popup')->__('Blank'),
              ),
			  
			  array(
                  'value'     => 'blank_no_close',
                  'label'     => Mage::helper('popup')->__('Blank No Close Button'),
              ),

              array(
                  'value'     => 'email_signup',
                  'label'     => Mage::helper('popup')->__('Email Sign Up'),
              ),
			  
			  array(
                  'value'     => 'countdown',
                  'label'     => Mage::helper('popup')->__('Countdown'),
              ),
			  
			  array(
                  'value'     => 'email_signup_countdown',
                  'label'     => Mage::helper('popup')->__('Email Sign Up + Countdown'),
              ),
          ),
      ));
	  
	  */
	  /*
		
		$fieldset->addField('filename', 'image', array(
          'label'     => Mage::helper('popup')->__('Background Image'),
          'required'  => false,
          'name'      => 'filename',
      ));
	  
	  $fieldset->addField('background_color', 'text', array(
          'label'     => Mage::helper('popup')->__('Background Color'),
          'required'  => false,
          'name'      => 'background_color',
      ));
	  
	  */
	 // if (!Mage::app()->isSingleStoreMode()) {
   $fieldset->addField('stores_id', 'multiselect', array(
           'name'      => 'stores[]',
           'label'     => Mage::helper('popup')->__('Store View'),
           'title'     => Mage::helper('popup')->__('Store View'),
           'required'  => true,
           'values'    => Mage::getSingleton('adminhtml/system_store')->getStoreValuesForForm(false, true),
   ));
 // }
 // else {
 //  $fieldset->addField('store_id', 'hidden', array(
 //          'name'      => 'stores[]',
//           'value'     => Mage::app()->getStore(true)->getId()
//   ));
//   $model->setStoreId(Mage::app()->getStore(true)->getId());
//  }
	  
	  $fieldset->addField('cookie_value', 'text', array(
          'label'     => Mage::helper('popup')->__('Unique Cookie Name'),
          'class'     => 'required-entry',
          'required'  => true,
          'name'      => 'cookie_value',
      ));
	  /*
	  $fieldset->addField('cookie_expiry', 'text', array(
          'label'     => Mage::helper('popup')->__('Cookie Expiry'),
          'class'     => 'required-entry',
          'required'  => true,
          'name'      => 'cookie_expiry',
      ));
	  */
	  $fieldset->addField('cookie_expiry', 'select', array(
          'label'     => Mage::helper('popup')->__('Cookie Expiry'),
          'name'      => 'cookie_expiry',
		  'class'     => 'required-entry',
          'required'  => true,
          'values'    => array(
              array(
                  'value'     => 10,
                  'label'     => Mage::helper('popup')->__('10 Seconds'),
              ),

              array(
                  'value'     => 100,
                  'label'     => Mage::helper('popup')->__('100 Seconds'),
              ),
			  
			  array(
                  'value'     => 1800,
                  'label'     => Mage::helper('popup')->__('30 minutes'),
              ),
			  
			  array(
                  'value'     => 3600,
                  'label'     => Mage::helper('popup')->__('1 Hour'),
              ),
			  
			  array(
                  'value'     => 43200,
                  'label'     => Mage::helper('popup')->__('12 Hours'),
              ),
			  
			  array(
                  'value'     => 86400,
                  'label'     => Mage::helper('popup')->__('24 Hours'),
              ),
			  
			  array(
                  'value'     => 172800,
                  'label'     => Mage::helper('popup')->__('2 Days'),
              ),
			  
			  array(
                  'value'     => 604800,
                  'label'     => Mage::helper('popup')->__('1 Week'),
              ),
			  
			  array(
                  'value'     => 1209600,
                  'label'     => Mage::helper('popup')->__('2 Weeks'),
              ),
			  
			  array(
                  'value'     => 2419200,
                  'label'     => Mage::helper('popup')->__('1 Month'),
              ),
			  
			  array(
                  'value'     => 7257600,
                  'label'     => Mage::helper('popup')->__('3 Months'),
              ),
			  
			  array(
                  'value'     => 14515200,
                  'label'     => Mage::helper('popup')->__('6 Months'),
              ),
			  
			  array(
                  'value'     => 29030400,
                  'label'     => Mage::helper('popup')->__('1 Year'),
              ),
			  
			  
          ),
      ));
	  /*
	  $fieldset->addField('timestatus', 'select', array(
          'label'     => Mage::helper('popup')->__('Countdown Based On'),
          'name'      => 'timestatus',
		  'onclick'=>'modifyTimestatusElement(this)',
		  'onchange'=>'modifyTimestatusElement(this)',
		  
          'values'    => array(
              array(
                  'value'     => 1,
                  'label'     => Mage::helper('popup')->__('Coupon'),
              ),
			  
			   array(
                  'value'     => 2,
                  'label'     => Mage::helper('popup')->__('Until Date'),
              ),
          ),
      ));
	 
	
		
		$fieldset->addField('coupon_id', 'text', array(
          'label'     => Mage::helper('popup')->__('Coupon Code'),
          'required'  => false,
          'name'      => 'coupon_id',
      ));
	  
	  
	 */
		
		
	  
	  $fieldset->addField('begin_time', 'date', array(
		  'name' => 'begin_time',
		  'title' => Mage::helper('popup')->__('Show Pop-up From Date'),
		  'label' => Mage::helper('popup')->__('From date'),
		  'class'     => 'required-entry',
		  'required'  => true,
		  'image' => $this->getSkinUrl('images/grid-cal.gif'),
		  //'input_format' => Varien_Date::DATE_INTERNAL_FORMAT,
		  'format' => Mage::app()->getLocale()->getDateFormat(Mage_Core_Model_Locale::FORMAT_TYPE_SHORT),
		));
		/*
		$fieldset->addField('begin_hour', 'time', array(
          'label'     => Mage::helper('popup')->__('Begin Hour'),
          'required'  => false,
          'name'      => 'begin_hour',
		  'input_format' => Varien_Date::DATETIME_INTERNAL_FORMAT,
		  'format' => Mage::app()->getLocale()->getTimeFormat(Mage_Core_Model_Locale::FORMAT_TYPE_SHORT),
      ));
		*/
		$fieldset->addField('end_time', 'date', array(
		  'name' => 'end_time',
		  'title' => Mage::helper('popup')->__('Show Pop-up Until Date'),
		  'label' => Mage::helper('popup')->__('Until date'),
		  'class'     => 'required-entry',
		  'required'  => true,
		  'image' => $this->getSkinUrl('images/grid-cal.gif'),
		  //'input_format' => Varien_Date::DATE_INTERNAL_FORMAT,
		  'format' => Mage::app()->getLocale()->getDateFormat(Mage_Core_Model_Locale::FORMAT_TYPE_SHORT),
		));
		/*
	  $fieldset->addField('end_hour', 'time', array(
          'label'     => Mage::helper('popup')->__('End Hour'),
          'required'  => false,
          'name'      => 'end_hour',
		  'format' => Mage::app()->getLocale()->getTimeFormat(Mage_Core_Model_Locale::FORMAT_TYPE_SHORT),
      ));
	  */
	  /*
	  $fieldset->addField('width', 'text', array(
          'label'     => Mage::helper('popup')->__('Width'),
          'class'     => 'required-entry',
          'required'  => true,
          'name'      => 'width',
      ));
	  
	  $fieldset->addField('height', 'text', array(
          'label'     => Mage::helper('popup')->__('Height'),
          'class'     => 'required-entry',
          'required'  => true,
          'name'      => 'height',
      ));
	  
	  
		*/
      $fieldset->addField('status', 'select', array(
          'label'     => Mage::helper('popup')->__('Status'),
          'name'      => 'status',
          'values'    => array(
              array(
                  'value'     => 1,
                  'label'     => Mage::helper('popup')->__('Enabled'),
              ),

              array(
                  'value'     => 2,
                  'label'     => Mage::helper('popup')->__('Disabled'),
              ),
          ),
      ));
	  /*
	  $fieldset->addField('styles', 'editor', array(
          'label'     => Mage::helper('popup')->__('Additional Styles'),
          'title'     => Mage::helper('popup')->__('Content'),
          'style'     => 'width:700px; height:70px;',
		  'wysiwyg'   => false,
          'required'  => false,
          'name'      => 'styles',
      ));
*/
      /*
	  $fieldset->addField('delay', 'text', array(
          'label'     => Mage::helper('popup')->__('Delay'),
		  'class'     => 'required-entry',
          'required'  => true,
          'name'      => 'delay',
	  ));
	  */
	  /*
	  $fieldset->addField('delay', 'select', array(
          'label'     => Mage::helper('popup')->__('Auto-close Delay'),
          'name'      => 'delay',
		  'class'     => 'required-entry',
          'required'  => true,
          'values'    => array(
              array(
                  'value'     => 0,
                  'label'     => Mage::helper('popup')->__('Disabled'),
              ),

              array(
                  'value'     => 5,
                  'label'     => Mage::helper('popup')->__('5 Seconds'),
              ),
			  
			  array(
                  'value'     => 10,
                  'label'     => Mage::helper('popup')->__('10 Seconds'),
              ),
			  
			  array(
                  'value'     => 15,
                  'label'     => Mage::helper('popup')->__('15 Seconds'),
              ),
			  
			  array(
                  'value'     => 30,
                  'label'     => Mage::helper('popup')->__('30 Seconds'),
              ),
			  
			  array(
                  'value'     => 60,
                  'label'     => Mage::helper('popup')->__('60 Seconds'),
              ),
			  
			  array(
                  'value'     => 120,
                  'label'     => Mage::helper('popup')->__('120 Seconds'),
              ),
          ),
      ));
	  */
   /*  
      $fieldset->addField('popup_content', 'editor', array(
          'name'      => 'popup_content',
          'label'     => Mage::helper('popup')->__('Content'),
          'title'     => Mage::helper('popup')->__('Content'),
          'style'     => 'width:700px; height:500px;',
		  'config'    => Mage::getSingleton('cms/wysiwyg_config')->getConfig(),
          'wysiwyg'   => true,
          'required'  => true,
      ));
     */
	 $fieldset->addField('sort_order', 'text', array(
          'label'     => Mage::helper('popup')->__('Sort Order'),
          'required'  => false,
          'name'      => 'sort_order',
	  ));
	  
	 
      if ( Mage::getSingleton('adminhtml/session')->getPopupData() )
      {
          $form->setValues(Mage::getSingleton('adminhtml/session')->getPopupData());
          Mage::getSingleton('adminhtml/session')->setPopupData(null);
      } elseif ( Mage::registry('popup_data') ) {
          $form->setValues(Mage::registry('popup_data')->getData());
      }
      return parent::_prepareForm();
  }
}