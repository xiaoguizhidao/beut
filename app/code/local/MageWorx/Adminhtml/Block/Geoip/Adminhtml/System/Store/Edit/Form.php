<?php
/**
 * MageWorx
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the MageWorx EULA that is bundled with
 * this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.mageworx.com/LICENSE-1.0.html
 *
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@mageworx.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade the extension
 * to newer versions in the future. If you wish to customize the extension
 * for your needs please refer to http://www.mageworx.com/ for more information
 * or send an email to sales@mageworx.com
 *
 * @category   MageWorx
 * @package    MageWorx_Adminhtml
 * @copyright  Copyright (c) 2009 MageWorx (http://www.mageworx.com/)
 * @license    http://www.mageworx.com/LICENSE-1.0.html
 */

/**
 * MageWorx Adminhtml extension
 *
 * @category   MageWorx
 * @package    MageWorx_Adminhtml
 * @author     MageWorx Dev Team <dev@mageworx.com>
 */

class MageWorx_Adminhtml_Block_Geoip_Adminhtml_System_Store_Edit_Form extends Mage_Adminhtml_Block_System_Store_Edit_Form
{
    public function __construct()
    {
        parent::__construct();
    }

    protected function _prepareForm()
    {
    	parent::_prepareForm();

    	if (Mage::registry('store_type') == 'store') {
            $storeModel = Mage::registry('store_data');

	    	$form = $this->getForm();
	    	$fieldset = $form->getElement('store_fieldset');

	        $fieldset->addField('geoip_country_code', 'multiselect', array(
	            'label'    => Mage::helper('geoip')->__('Country'),
	            'name'     => 'store[geoip_country_code][]',
	            'required' => true,
	            'value'    => $storeModel->getGeoipCountryCode(),
	            'values'   => Mage::getSingleton('adminhtml/system_config_source_country')->toOptionArray(true)
				),
				'store_code'
	        );
        }
        return $this;
    }
}