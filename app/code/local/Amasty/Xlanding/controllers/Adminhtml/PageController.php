<?php
/**
 * @copyright   Copyright (c) 2009-2012 Amasty (http://www.amasty.com)
 */ 
class Amasty_Xlanding_Adminhtml_PageController extends Mage_Adminhtml_Controller_Action
{
    protected $_title     = 'Landing Page';
    protected $_modelName = 'page';
    
    protected function _setActiveMenu($menuPath)
    {
        $this->getLayout()->getBlock('menu')->setActive($menuPath);
        $this->_title($this->__('Catalog'))->_title($this->__($this->_title));     
        return $this;
    } 
    
    public function indexAction()
    {
        $this->loadLayout(); 
        $this->_setActiveMenu('catalog/amlanding/' . $this->_modelName . 's');
        $this->_addContent($this->getLayout()->createBlock('amlanding/adminhtml_' . $this->_modelName));         
		$this->renderLayout();
    }

    public function newAction()
    {
        $this->editAction();
    }
    
    public function optionsAction()
    {
        $result = '<input id="attr_value" name="attr_value[]" value="" class="input-text" type="text" />';
        
        $code = $this->getRequest()->getParam('code');
        if (!$code){
            $this->getResponse()->setBody($result);
            return;
        }
        
        $attribute = Mage::getModel('catalog/product')->getResource()->getAttribute($code);
        if (!$attribute){
            $this->getResponse()->setBody($result);
            return;            
        }

        if (!in_array($attribute->getFrontendInput(), array('select', 'multiselect')) ){
            $this->getResponse()->setBody($result);
            return;            
        }
        
        $options = $attribute->getFrontend()->getSelectOptions();
        //array_shift($options);  
        
        $result = '<select id="attr_value" name="attr_value[]" class="select">';
        foreach ($options as $option){
            $result .= '<option value="'.$option['value'].'">'.$option['label'].'</option>';      
        }
        $result .= '</select>';    
        
        $this->getResponse()->setBody($result);
        
    }     
    
    public function editAction() 
    {
        $id     = (int) $this->getRequest()->getParam('id');
        $model  = Mage::getModel('amlanding/' . $this->_modelName)->load($id);
        
        if ($id && !$model->getId()) {
            Mage::getSingleton('adminhtml/session')->addError(Mage::helper('amlanding')->__('Record does not exist'));
            $this->_redirect('*/*/');
            return;
        }
        
        $data = Mage::getSingleton('adminhtml/session')->getFormData(true);
        if (!empty($data)) {
            $model->setData($data);
        }
        else {
            $this->prepareForEdit($model);
        }
        
        
        Mage::register('amlanding_' . $this->_modelName, $model);
        
        $this->loadLayout();
        
        $this->_setActiveMenu('catalog/amlanding/' . $this->_modelName . 's');
        $this->_title($this->__('Edit'));
        
               
        $this->_addContent($this->getLayout()->createBlock('amlanding/adminhtml_' . $this->_modelName . '_edit'));
        $this->_addLeft($this->getLayout()->createBlock('amlanding/adminhtml_' . $this->_modelName . '_edit_tabs'));
        
		$this->renderLayout();
    }

    public function saveAction() 
    {
        if ($data = $this->getRequest()->getPost()) {
        	
            //init model and set data
            $model = Mage::getModel('amlanding/page');

            if ($id = $this->getRequest()->getParam('id')) {
                $model->load($id);
            }
            
            $model->setData($data);
            
			$this->prepareForSave($model);
            

            //validating
            if (!$this->_validatePostData($data)) {
                $this->_redirect('*/*/edit', array('id' => $model->getPageId(), '_current' => true));
                return;
            }

            // try to save it
            try {
                // save the data
                $model->save();

                // display success message
                Mage::getSingleton('adminhtml/session')->addSuccess(
                    Mage::helper('amlanding')->__('The page has been saved.'));
                // clear previously saved data from session
                Mage::getSingleton('adminhtml/session')->setFormData(false);
                // check if 'Save and Continue'
                if ($this->getRequest()->getParam('continue')) {
                    $this->_redirect('*/*/edit', array('id' => $model->getPageId(), '_current'=>true));
                    return;
                }
                // go to grid
                $this->_redirect('*/*/');
                return;

            } catch (Mage_Core_Exception $e) {
                $this->_getSession()->addError($e->getMessage());
            }
            catch (Exception $e) {
                $this->_getSession()->addException($e,
                    Mage::helper('amlanding')->__('An error occurred while saving the page.'));
            }

            $this->_getSession()->setFormData($data);
            $this->_redirect('*/*/edit', array('id' => $this->getRequest()->getParam('id')));
            return;
        }
        $this->_redirect('*/*/'); 
    } 
    
    public function deleteAction()
    {
        $id     = (int) $this->getRequest()->getParam('id');
        $model  = Mage::getModel('amlanding/' . $this->_modelName)->load($id);

        if ($id && !$model->getId()) {
            Mage::getSingleton('adminhtml/session')->addError($this->__('Record does not exist'));
            $this->_redirect('*/*/');
            return;
        }
         
        try {
            $model->delete();
            Mage::getSingleton('adminhtml/session')->addSuccess(
                $this->__($this->_title . ' has been successfully deleted'));
        } 
        catch (Exception $e) {
            Mage::getSingleton('adminhtml/session')->addError($e->getMessage());
        }
        
        $this->_redirect('*/*/');
    }    
        
    public function massDeleteAction()
    {
        $ids = $this->getRequest()->getParam($this->_modelName . 's');
        if (!is_array($ids)) {
             Mage::getSingleton('adminhtml/session')->addError(Mage::helper('amlanding')->__('Please select records'));
             $this->_redirect('*/*/');
             return;
        }
        try {
            foreach ($ids as $id) {
                $model = Mage::getModel('amlanding/' . $this->_modelName)->load($id);
                $model->delete();
                // TODO remove files
            }
            Mage::getSingleton('adminhtml/session')->addSuccess(
                Mage::helper('adminhtml')->__(
                    'Total of %d record(s) were successfully deleted', count($ids)
                )
            );
        } 
        catch (Exception $e) {
            Mage::getSingleton('adminhtml/session')->addError($e->getMessage());
        }
        $this->_redirect('*/*/');   
    }
    
    public function massActivateAction()
    {
        return $this->_modifyStatus(1);
    }
    
    public function massInactivateAction()
    {
        return $this->_modifyStatus(0);
    }     
    
    protected function _modifyStatus($status)
    {
        $ids = $this->getRequest()->getParam('pages');
        if ($ids && is_array($ids)){
            try {
                Mage::getModel('amlanding/' . $this->_modelName)->massChangeStatus($ids, $status);
                $message = $this->__('Total of %d record(s) have been updated.', count($ids));
                $this->_getSession()->addSuccess($message);
            } 
            catch (Exception $e) {
                $this->_getSession()->addError($e->getMessage());
            }
        }
        else {
            $this->_getSession()->addError($this->__('Please select page(s).'));
        }
        
        return $this->_redirect('*/*');
    }     
    
    /**
     * Prepare model
     * @param Amasty_Xlanding_Model_Page $model
     * @return boolean
     */
    public function prepareForSave($model)
    {
		$attributeCodes = $model->getData('attr_code');
		$attributeValues = $model->getData('attr_value');
		
		$validArray = array();
		
		foreach ($attributeValues as $index => $value) {
			if (isset($attributeCodes[$index]) && $attributeCodes[$index] != '') {
				if(!isset($validArray[$attributeCodes[$index]])) {
					$validArray[$attributeCodes[$index]] = array();
				}
				if ($value != '') {
					$validArray[$attributeCodes[$index]][] = $value;
				}
			}
		}
		$model->setData('attributes', serialize($validArray));
        
        return true;
    }
    
    public function prepareForEdit($model)
    {
        $fields = array('stores', 'cust_groups', 'cats');
        foreach ($fields as $f){
            $val = $model->getData($f);
            if (!is_array($val)){
                $model->setData($f, explode(',', $val));    
            }    
        }
        
        //$model->getConditions()->setJsFormObject('rule_conditions_fieldset');
        return true;
    }
    
     /**
     * Validate post data
     *
     * @param array $data
     * @return bool     Return FALSE if someone item is invalid
     */
    protected function _validatePostData($data)
    {
        $errorNo = true;
        if (!empty($data['layout_update_xml']) || !empty($data['custom_layout_update_xml'])) {
            /** @var $validatorCustomLayout Mage_Adminhtml_Model_LayoutUpdate_Validator */
            $validatorCustomLayout = Mage::getModel('adminhtml/layoutUpdate_validator');
            if (!empty($data['layout_update_xml']) && !$validatorCustomLayout->isValid($data['layout_update_xml'])) {
                $errorNo = false;
            }
            foreach ($validatorCustomLayout->getMessages() as $message) {
                $this->_getSession()->addError($message);
            }
        }
        return $errorNo;
    } 
    
    protected function _title($text = null, $resetIfExists = true)
    {
        if (Mage::helper('ambase')->isVersionLessThan(1,4)){
            return $this;
        }
        return parent::_title($text, $resetIfExists);
    }
}