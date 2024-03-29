<?php

/*
 * @copyright  Copyright (c) 2012 by  ESS-UA.
 */

class Ess_M2ePro_Model_Connector_Server_Buy_Product_List_MultipleResponser
    extends Ess_M2ePro_Model_Connector_Server_Buy_Product_Responser
{
    // ########################################

    protected function processSucceededListingsProducts(array $listingsProducts = array())
    {
        foreach ($listingsProducts as $listingProduct) {

            /** @var $listingProduct Ess_M2ePro_Model_Listing_Product */

            $requestData = $this->getListingProductRequestNativeData($listingProduct);

            $tempParams = array(
                'status_changer' => $this->getStatusChanger()
            );

            Mage::getModel('M2ePro/Buy_Connector_Product_Helper')
                        ->updateAfterListAction($listingProduct,$requestData,$tempParams);

            // Parser hack -> Mage::helper('M2ePro')->__('Item was successfully listed');
            $this->addListingsProductsLogsMessage($listingProduct, 'Item was successfully listed',
                                                  Ess_M2ePro_Model_Log_Abstract::TYPE_SUCCESS,
                                                  Ess_M2ePro_Model_Log_Abstract::PRIORITY_MEDIUM);
        }

        $this->updateGeneralIdsWhenItIsEmpty($listingsProducts);
    }

    // ########################################

    protected function updateGeneralIdsWhenItIsEmpty(array $listingsProducts = array())
    {
        $tempListingsProducts = array();
        foreach ($listingsProducts as $listingProduct) {
            if ($listingProduct->getChildObject()->getGeneralId() > 0) {
                continue;
            }
            $tempListingsProducts[] = $listingProduct;
        }

        if (count($tempListingsProducts) <= 0) {
            return;
        }

        /** @var $generalTemplate Ess_M2ePro_Model_Template_General */
        $generalTemplate = $tempListingsProducts[0]->getGeneralTemplate();

        $listingProductsPacks = array_chunk($tempListingsProducts,5,true);

        foreach ($listingProductsPacks as $listingProductsPack) {

            $skus = array();

            foreach ($listingProductsPack as $key => $listingProduct) {
                $skus[$key] = $listingProduct->getChildObject()->getSku();
            }

            try {

                /** @var $dispatcherObject Ess_M2ePro_Model_Connector_Server_Buy_Dispatcher */
                $dispatcherObject = Mage::getModel('M2ePro/Buy_Connector')->getDispatcher();
                $response = $dispatcherObject->processVirtualAbstract('product','search','skuByReferenceId',
                    array('items' => $skus),'items', $generalTemplate->getMarketplaceId(),
                                                     $generalTemplate->getAccountId());

            } catch (Exception $exception) {
                Mage::helper('M2ePro/Exception')->process($exception,true);
                continue;
            }

            foreach($response as $key => $value) {

                if ($value === false || empty($value['general_id']) ) {
                    continue;
                }

                $data = array(
                    'general_id' => $value['general_id']
                );

                $listingProductsPack[$key]->addData($data)->save();
            }
        }
    }

    // ########################################
}