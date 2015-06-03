<?php
/**
 * @category    Trmmarketing
 * @package     Trmmarketing_PopupWidgets
 * @copyright   Copyright (c) 2013 TRM Marketing LLC
 * @license     http://www.trm-marketing.com/solutions/license/TRM-Marketing-Standard-License-Agreement.html
 */

class Trmmarketing_Popup_Block_Adminhtml_Popup_Edit_Tab_Template extends Mage_Adminhtml_Block_Widget_Form
{
  protected function _prepareForm()
  {
      $form = new Varien_Data_Form();
      $this->setForm($form);
      $fieldset = $form->addFieldset('popup_form', array('legend'=>Mage::helper('popup')->__('Template Settings')));
     
	  
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

             
          ),
      ));
	  
	  
		
		$fieldset->addField('filename', 'image', array(
          'label'     => Mage::helper('popup')->__('Background Image'),
          'required'  => false,
          'name'      => 'filename',
      ));
	  
	  $fieldset->addField('background_color', 'text', array(
          'label'     => Mage::helper('popup')->__('Background Color'),
		  'class'  => 'color {hash:true,required:false}',
          'required'  => false,
          'name'      => 'background_color',
      ));
	  
	
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
	  
	  
	  $fieldset->addField('timestatus', 'select', array(
          'label'     => Mage::helper('popup')->__('Open Delay'),
          'name'      => 'timestatus',
		  'class'     => 'required-entry',
          'required'  => true,
          'values'    => array(
              array(
                  'value'     => 0,
                  'label'     => Mage::helper('popup')->__('Open Immediately'),
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
   /*
	 $fieldset->addField('sort_order', 'text', array(
          'label'     => Mage::helper('popup')->__('Sort Order'),
          'required'  => false,
          'name'      => 'sort_order',
	  ));
	 */ 
	 
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