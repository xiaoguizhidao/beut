ListingOtherAutoMapHandler = Class.create();
ListingOtherAutoMapHandler.prototype = Object.extend(new CommonHandler(), {

    //----------------------------------

    initialize: function(M2ePro)
    {
        this.M2ePro = M2ePro;
    },

    //----------------------------------

    mapProductsAuto: function(product_ids)
    {
        var self = this;

        var selectedProductsString = product_ids;
        var selectedProductsArray = selectedProductsString.split(",");

        if (selectedProductsString == '' || selectedProductsArray.length == 0) {
            return;
        }

        var maxProductsInPart = 10;

        var result = new Array();
        for (var i=0;i<selectedProductsArray.length;i++) {
            if (result.length == 0 || result[result.length-1].length == maxProductsInPart) {
                result[result.length] = new Array();
            }
            result[result.length-1][result[result.length-1].length] = selectedProductsArray[i];
        }

        var selectedProductsParts = result;

        ListingProgressBarObj.reset();
        ListingProgressBarObj.show(self.M2ePro.text.automap_progress_title);
        GridWrapperObj.lock();
        $('loading-mask').setStyle({visibility: 'hidden'});

        self.sendPartsOfProducts(selectedProductsParts,selectedProductsParts.length,0);
    },

    sendPartsOfProducts : function(parts,totalPartsCount,isFailed)
    {
        var self = this;

        if (parts.length == 0) {
            if (isFailed == 1) {
                MagentoMessageObj.addError(self.M2ePro.text.failed_mapped);
            } else {
                MagentoMessageObj.addSuccess(self.M2ePro.text.successfully_mapped);
            }

            ListingProgressBarObj.setStatus(self.M2ePro.text.task_completed_message);
            ListingProgressBarObj.hide();
            ListingProgressBarObj.reset();
            GridWrapperObj.unlock();
            $('loading-mask').setStyle({visibility: 'visible'});

            eval(self.M2ePro.customData.gridId + '_massactionJsObject.unselectAll()');
            eval(self.M2ePro.customData.gridId + 'JsObject.reload()');

            return;
        }

        var part = parts.splice(0,1);
        part = part[0];
        var partString = implode(',',part);

        var partExecuteString = part.length;
        partExecuteString += '';

        ListingProgressBarObj.setStatus(str_replace('%s', partExecuteString, self.M2ePro.text.processing_data_message));

        new Ajax.Request(self.M2ePro.url.mapAutoToProductUrl, {
            method: 'post',
            parameters: {
                product_ids : partString
            },
            onSuccess: function (transport) {

                var percents = (100/totalPartsCount)*(totalPartsCount-parts.length);

                if (percents <= 0) {
                    ListingProgressBarObj.setPercents(0,0);
                } else if (percents >= 100) {
                    ListingProgressBarObj.setPercents(100,0);
                } else {
                    ListingProgressBarObj.setPercents(percents,1);
                }

                if (transport.responseText == 1) {
                    isFailed = 1;
                }

                setTimeout(function() {
                    self.sendPartsOfProducts(parts,totalPartsCount,isFailed);
                },500);
            }
        });
    }

    //----------------------------------
});