<?php
class Extendware_EWMinify_Helper_Layout extends Extendware_EWCore_Helper_Abstract
{
	public function isImageOptimizationAllowed() {
		return Extendware_EWCore_Model_Module_License::isFeatureEnabled('Extendware_EWMinify', 'image_optimization');
	}
}