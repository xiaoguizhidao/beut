<?php

class Extendware_EWAutoSwitcher_Block_Adminhtml_Currency_Rule_Grid extends Extendware_EWCore_Block_Mage_Adminhtml_Widget_Grid
{
    public function __construct($attributes = array())
    {
        parent::__construct($attributes);
        $this->setDefaultSort('currency_rule_id');
    }

    protected function _prepareCollection()
    {
        $collection = Mage::getModel('ewautoswitcher/currency_rule')->getCollection();
        $collection->joinWebsiteTable(array('website_name' => 'name'));
        $collection->joinStoreTable(array('store_name' => 'name'));
        $this->setCollection($collection);
        return parent::_prepareCollection();
    }

    protected function _prepareColumns()
    {
        $this->addColumn('currency_rule_id', array(
        	//'type'		=> 'number',
            'header'    => $this->__('ID'),
        	'index'     => 'currency_rule_id',
            'align'     => 'right',
            'width'     => '50px',
        ));
        
        $this->addColumn('status', array(
            'header'    =>  $this->__('Status'),
            'align'     =>  'left',
            'index'     =>  'status',
        	'type'      => 'options',
            'options'   => Mage::getModel('ewautoswitcher/currency_rule')->getStatusOptionModel()->toGridOptionArray(),
			'width'		=> '80px',
        ));
        
        $this->addColumn('currency_code', array(
            'header'    => $this->__('Currency'),
            'index'     => 'currency_code',
        	'width'		=> '120px',
        ));
        
		$this->addColumn('website_name', array(
            'header'    => $this->__('Website'),
            'index'     => 'website_name',
        	'width'		=> '120px',
        	'default'	=> ' ---- ',
        ));
		
        $this->addColumn('store_name', array(
            'header'    => $this->__('Store'),
            'index'     => 'store_name',
        	'width'		=> '120px',
        	'default'	=> ' ---- ',
        ));

        $this->addColumn('name', array(
            'header'    => $this->__('Name'),
            'index'     => 'name',
        	'default'	=> ' ---- ',
        ));
        
        $this->addColumn('countries', array(
            'header'    => $this->__('Countries'),
        	'renderer'	=> 'Extendware_EWAutoSwitcher_Block_Adminhtml_Currency_Rule_Grid_Renderer_Countries',
        	'sortable'	=> false,
        	'filter'	=> false,
        ));
        
        $this->addColumn('updated_at', array(
            'header'    => $this->__('Updated'),
            'index'     => 'updated_at',
            'type'      => 'datetime',
            'width'     => '155px',
            'gmtoffset' => true,
            'default'	=> ' ---- ',
        ));

        $this->addColumn('created_at', array(
            'header'    => $this->__('Created'),
            'index'     => 'created_at',
            'type'      => 'datetime',
            'width'     => '155px',
            'gmtoffset' => true,
            'default'	=> ' ---- ',
        ));
		
        $this->addColumn('action', array(
			'header' => $this->__('Action'),
			'width' => '50px',
			'type' => 'action',
			'getter' => 'getId',
			'actions' => array(
				array(
					'caption' => $this->__('Edit'),
					'url' => array('base' => '*/*/edit'), 'field' => 'id'
				)
				
			),
			'filter' => false,
			'sortable' => false,
			'is_system' => true
		));
		
        return parent::_prepareColumns();
    }

    public function getRowUrl($row)
    {
        return $this->getUrl('*/*/edit', array('id' => $row->getId()));
    }

    protected function _prepareMassaction(){
        $this->setMassactionIdField('currency_rule_id');
        $this->getMassactionBlock()->setFormFieldName('ids');

        $this->getMassactionBlock()->addItem('status', array(
			'label' => $this->__('Change status'),
			'url' => $this->getUrl('*/*/massStatus'),
			'confirm' => $this->__('Are you sure?'),
			'additional' => array(
                    'visibility' => array(
                         'name' => 'status',
                         'type' => 'select',
                         'class' => 'required-entry',
                         'label' => $this->__('Status'),
                         'values' => Mage::getSingleton('ewautoswitcher/currency_rule_data_option_status')->toGridMassActionOptionArray()
                     )
             )
		));
        
        $this->getMassactionBlock()->addItem('delete', array(
			'label' => $this->__('Delete'),
			'url' => $this->getUrl('*/*/massDelete'),
			'confirm' => $this->__('Are you sure?')
		));
        
        return $this;
    }
}