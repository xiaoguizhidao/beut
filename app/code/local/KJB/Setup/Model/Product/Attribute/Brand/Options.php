<?php

class KJB_Setup_Model_Product_Attribute_Brand_Options extends Mage_Eav_Model_Entity_Attribute_Source_Abstract
{
    public function getAllOptions($forFrontend = true)
    {

        $options = array(
            array(
                'value' => '0',
                'label' => 'In Store Only',
            ),
            array(
                'value' => '1',
                'label' => 'In Stock',
            ),
            array(
                'value' => '2',
                'label' => 'Out Of Stock',
            )
        );


        return $options;
    }
}