var magicToolboxLinks = [];
var optionLabels = {};
var optionTitles = {};
var optionProductIDs = {};
var choosedOptions = {};
//var magicToolboxOptionTitles = '';//defined in header.phtml
//var magicToolboxSwitchMetod = 'click';//defined in header.phtml
//var magicToolboxMouseoverDelay = 0;//defined in header.phtml

var allowMagicToolboxChange = true;

function MagicToolboxPrepareOptions() {
    var pid = optionsPrice.productId;
    var container = document.getElementById('MagicToolboxSelectors'+pid);
    if(container) magicToolboxLinks = container.getElementsByTagName('a');
    //for configurable products
    if(typeof spConfig != 'undefined' && typeof spConfig.config.attributes != 'undefined') {
        for(var attributeID in spConfig.config.attributes) {
            optionLabels[attributeID] = {};
            optionProductIDs[attributeID] = {};
            optionTitles[attributeID] = spConfig.config.attributes[attributeID].label.toLowerCase();
            for(var optionID in spConfig.config.attributes[attributeID].options) {
                var option = spConfig.config.attributes[attributeID].options[optionID];
                if(typeof option == 'object') {
                    optionLabels[attributeID][option.id] = option.label.replace(/(^\s+)|(\s+$)/g, "")/*.replace(/"/g, "'")*/.toLowerCase();
                    optionProductIDs[attributeID][option.id] = {};
                    for(var i = 0, productsLength = option.products.length; i < productsLength; i++) {
                        optionProductIDs[attributeID][option.id][i] = option.products[i];
                    }
                }
            }
            //NOTE: for select in configurable.phtml
            var selectEl = document.getElementById('attribute'+attributeID);
            if(selectEl) {
                $mjs(selectEl).je1('change', function(e) {
                    var objThis = e.target || e.srcElement;
                    var attrID = objThis.id.replace('attribute', '');
                    MagicToolboxChangeOptionConfigurable(objThis, optionTitles[attrID]);
                });
            }
        }
    }
    //if(typeof opConfig != 'undefined') opConfig.reloadPrice();
}

function MagicToolboxClickElement(element, eventType, eventName) {
    var event;
    if(document.createEvent) {
        event = document.createEvent(eventType);
        event.initEvent(eventName, true, true);
        element.dispatchEvent(event);
    } else {
        event = document.createEventObject();
        event.eventType = eventType;
        element.fireEvent('on' + eventName, event);
    }
    return event;
}

function MagicToolboxChangeOption(element, optionTitle) {

    if(!allowMagicToolboxChange) {
        allowMagicToolboxChange = true;
        return;
    }

    if(MagicToolboxInArray(optionTitle, magicToolboxOptionTitles)) {
        var id = '';
        if(element.type == 'radio' && element.checked) {
            id = element.name.replace('options[', '').replace(']', '');
        } else if(element.type == 'select-one') {
            id = element.id.replace('select_', '').replace('attribute', '');
        } else {
            return;
        }
        if(element.value == '' || (typeof optionLabels[id][element.value] == 'undefined')) {
            return;
        }
        var label = optionLabels[id][element.value];
        for(var j = 0, linksLength = magicToolboxLinks.length; j < linksLength; j++) {
            if(magicToolboxLinks[j].firstChild.getAttribute('alt').replace(/(^\s+)|(\s+$)/g, "")/*.replace(/"/g, "'")*/.toLowerCase() == label) {
                allowMagicToolboxChange = false;
                MagicToolboxClickElement(magicToolboxLinks[j], 'MouseEvents', magicToolboxSwitchMetod);
                break;
            }
        }
    }

}

function MagicToolboxChangeSelector(a) {
    if(!allowMagicToolboxChange) {
        allowMagicToolboxChange = true;
        return;
    }
    var label = a.firstChild.getAttribute('alt').replace(/(^\s+)|(\s+$)/g, "").toLowerCase();
    var reloadPrice = false;
    for(var optionID in optionLabels) {
        for(var optionValue in optionLabels[optionID]) {
            if(optionLabels[optionID][optionValue] == label && MagicToolboxInArray(optionTitles[optionID], magicToolboxOptionTitles)) {
                var elementNames = ['options['+optionID+']', 'super_attribute['+optionID+']'];
                for(var elementNameIndex = 0, elementNamesLength = elementNames.length; elementNameIndex < elementNamesLength; elementNameIndex++) {
                    var elements = document.getElementsByName(elementNames[elementNameIndex]);
                    for(var i = 0, l = elements.length; i < l; i++) {
                        if(elements[i].type == 'radio') {
                            if(elements[i].value == optionValue) {
                                setTimeout(function(element) {
                                    return function() {
                                        var radios = document.getElementsByName(element.name);
                                        for(var radioIndex = 0, radiosLength = radios.length; radioIndex < radiosLength; radioIndex++) {
                                            radios[radioIndex].checked = false;
                                        }
                                        element.checked = true;
                                        allowMagicToolboxChange = false;
                                        MagicToolboxClickElement(element, 'Event', 'click');
                                    }
                                }(elements[i]), magicToolboxMouseoverDelay);
                                return;
                            }
                        } else if(elements[i].type == 'select-one') {
                            if(elements[i].options && !elements[i].disabled) {
                                for(var j = 0, k = elements[i].options.length; j < k; j++) {
                                    if(elements[i].options[j].value == optionValue) {
                                        setTimeout(function(element, optionValue) {
                                            return function() {
                                                element.value = optionValue;
                                                element.selectedIndex = j;
                                                allowMagicToolboxChange = false;
                                                MagicToolboxClickElement(element, 'Event', 'change');
                                            }
                                        }(elements[i], elements[i].options[j].value), magicToolboxMouseoverDelay);
                                        return;
                                    }
                                }
                            }
                        } else {
                            break;
                        }
                    }
                }
            }
        }
    }
}

function MagicToolboxInArray(needle, haystack) {
    var o = {};
    for(var i = 0, l = haystack.length; i < l; i++) {
        o[haystack[i]] = '';
    }
    if(needle in o) {
        return true;
    }
    return false;
}

function MagicToolboxChangeOptionConfigurable(element, optionTitle) {

    if(!allowMagicToolboxChange) {
        allowMagicToolboxChange = true;
        return;
    }

    if(typeof useAssociatedProductImages != 'undefined') {

        var attributeId = element.id.replace(/[a-z]*/, '');

        if(typeof choosedOptions[attributeId] != 'undefined') {
            delete choosedOptions[attributeId];
        }

        //clear child elements in choosedOptions
        if(element.childSettings) {
            for(var i=0,l= element.childSettings.length;i<l;i++){
                var childAttributeId = element.childSettings[i].id.replace(/[a-z]*/, '');
                if(typeof choosedOptions[childAttributeId] != 'undefined') {
                    delete choosedOptions[childAttributeId];
                }
            }
        }

        var configurableProductId = spConfig.config.productId;
        var mainSelectorImage = document.getElementById('imageMain'+configurableProductId);

        if(element.value.length === 0) {
            //if(mainSelectorImage) {
            //    mainSelectorImage.parentNode.click();
            //}
            return;
        }

        var associatedProductId = MagicToolboxFindProduct(attributeId, element.value);
        //add new option or replace one
        choosedOptions[attributeId] = element.value;

        var associatedImage = document.getElementById('imageConfigurable'+associatedProductId);
        if(associatedImage) {
            //associatedImage.parentNode.click();
            MagicToolboxClickElement(associatedImage.parentNode, 'MouseEvents', magicToolboxSwitchMetod);
            return;
        } else {
            /*if(mainSelectorImage) {
                //mainSelectorImage.parentNode.click();
                MagicToolboxClickElement(mainSelectorImage.parentNode, 'MouseEvents', magicToolboxSwitchMetod);
            }
            return;*/
        }

    }

    MagicToolboxChangeOption(element, optionTitle);

}

function MagicToolboxFindProduct(attributeId, optionId) {

    for(var i in optionProductIDs[attributeId][optionId]) {
        //product associated with current option
        var pId = optionProductIDs[attributeId][optionId][i];
        for(var attrId in choosedOptions) {
            //selected option's ID
            var optId = choosedOptions[attrId];
            for(var j in optionProductIDs[attrId][optId]) {
                if(pId == optionProductIDs[attrId][optId][j]) {
                    optId = null;
                    break;
                }
            }
            if(optId != null) {
                pId = null;
                break;
            }
        }
        if(pId != null) {
            return pId;
        }
    }
    return optionProductIDs[attributeId][optionId][0];

}

