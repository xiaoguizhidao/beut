<?php
class Extendware_EWCore_Model_Override_Mage_Adminhtml_Url extends Extendware_EWCore_Model_Override_Mage_Adminhtml_Url_Bridge
{
	public function getUrl($routePath = null, $routeParams = null)
    {
    	$routePathParts = explode('/', $routePath);
    	if (preg_match('/^extendware/', $routePathParts[0])) {
    		$routePathTest = preg_replace('/^extendware/', 'gentosonic', $routePathParts[0]);
    		if ((string)@Mage::getConfig()->getNode()->admin->routers->$routePathTest->args->frontName) {
	    		$routePath = preg_replace('/^extendware/', 'gentosonic', $routePath);
	    	}
    	}
    	
    	return parent::getUrl($routePath, $routeParams);
    }
}
