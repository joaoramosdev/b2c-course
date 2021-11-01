"use strict";
 
var server = require("server");
 
server.extend(module.superModule);
 
server.append("Show", function(req, res, next) {
    var Resource = require('dw/web/Resource');
    var Site = require("dw/system/Site");
    var ProductMgr = require('dw/catalog/ProductMgr')
 
    var viewData = res.getViewData();
    var productId = viewData.product.id;
    var product = ProductMgr.getProduct(productId);
    var availabilityModel = product.getAvailabilityModel();
    var available = availabilityModel.availability;
    var threshold = Site.getCurrent().getCustomPreferenceValue("availabilityThreshold");
    var message;
 
    if (available == 0) {
        message = Resource.msg('message.sold', 'available', null);
    } else if (available <= threshold) {
        message = Resource.msgf('message.only', 'available', null, available);
    }
 
    viewData.availableMessage = message;
 
    res.setViewData(viewData);
 
    return next();
});
 
module.exports = server.exports();