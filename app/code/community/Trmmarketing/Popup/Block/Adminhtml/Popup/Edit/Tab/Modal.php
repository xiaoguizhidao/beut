<?php
/**
 * @category    Trmmarketing
 * @package     Trmmarketing_PopupWidgets
 * @copyright   Copyright (c) 2013 TRM Marketing LLC
 * @license     http://www.trm-marketing.com/solutions/license/TRM-Marketing-Standard-License-Agreement.html
 */

class Trmmarketing_Popup_Block_Adminhtml_Popup_Edit_Tab_Modal extends Mage_Adminhtml_Block_Widget_Form
{
  protected function _prepareForm()
  {
      $form = new Varien_Data_Form();
      $this->setForm($form);
      $fieldset = $form->addFieldset('popup_form', array('legend'=>Mage::helper('popup')->__('Modal Background Settings')));
     
	 
	 $fieldset->addType('Videoupload','Trmmarketing_Popup_Lib_Varien_Data_Form_Element_Videoupload');
	 $fieldset->addField('modal_video_mp4', 'Videoupload', array(
          'label'     => Mage::helper('popup')->__('Modal Video Background MP4'),
          'required'  => false,
          'name'      => 'modal_video_mp4',
      ));
	  
	  $fieldset->addField('modal_video_ogv', 'Videoupload', array(
          'label'     => Mage::helper('popup')->__('Modal Video Background OGV'),
          'required'  => false,
          'name'      => 'modal_video_ogv',
      ));
	  
	  $fieldset->addField('modal_video_loop', 'select', array(
          'label'     => Mage::helper('popup')->__('Video Loop'),
          'name'      => 'modal_video_loop',
          'values'    => array(
              array(
                  'value'     => 1,
                  'label'     => Mage::helper('popup')->__('Enabled'),
              ),

              array(
                  'value'     => 0,
                  'label'     => Mage::helper('popup')->__('Disabled'),
              ),
          ),
      ));
	  
		
		$fieldset->addField('modal_background', 'image', array(
          'label'     => Mage::helper('popup')->__('Modal Background'),
          'required'  => false,
          'name'      => 'modal_background',
      ));
	  
	  $fieldset->addField('modal_color', 'text', array(
          'label'     => Mage::helper('popup')->__('Modal Color'),
		  'class'  => 'color {hash:true,required:false}',
          'required'  => false,
          'name'      => 'modal_color',
      ));
	  
	  
	  
	  $fieldset->addField('modal_opacity', 'select', array(
          'label'     => Mage::helper('popup')->__('Modal Opacity Override'),
          'name'      => 'modal_opacity',
          'required'  => false,
          'values'    => array(
              array(
                  'value'     => '',
                  'label'     => Mage::helper('popup')->__('Use Default'),
              ),

              array(
                  'value'     => '0.1',
                  'label'     => Mage::helper('popup')->__('10%'),
              ),
			  
			  array(
                  'value'     => '0.2',
                  'label'     => Mage::helper('popup')->__('20%'),
              ),
			  
			  array(
                  'value'     => '0.3',
                  'label'     => Mage::helper('popup')->__('30%'),
              ),
			  
			  array(
                  'value'     => '0.4',
                  'label'     => Mage::helper('popup')->__('40%'),
              ),
			  
			  array(
                  'value'     => '0.5',
                  'label'     => Mage::helper('popup')->__('50%'),
              ),
			  
			  array(
                  'value'     => '0.6',
                  'label'     => Mage::helper('popup')->__('60%'),
              ),
			  
			  array(
                  'value'     => '0.7',
                  'label'     => Mage::helper('popup')->__('70%'),
              ),
			  
			  array(
                  'value'     => '0.8',
                  'label'     => Mage::helper('popup')->__('80%'),
              ),
			  
			  array(
                  'value'     => '0.9',
                  'label'     => Mage::helper('popup')->__('90%'),
              ),
			  
			  array(
                  'value'     => '1',
                  'label'     => Mage::helper('popup')->__('100%'),
              ),
			  
          ),
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