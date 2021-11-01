"use strict";
 
var server = require("server");
 
server.extend(module.superModule);
 
server.append("Show", function(req, res, next) {
    var ProductMgr = require("dw/catalog/ProductMgr");
    var CustomObjectMgr = require("dw/object/CustomObjectMgr");
    var viewData = res.getViewData();
    var productId = viewData.product.id;
    var product = ProductMgr.getProduct(productId);
 
    if (product.custom.totalMark) {
        viewData.totalMark = product.custom.totalMark;
    }
    var query = "custom.approved = true AND custom.productId ='" + productId + "'";
    var reviews = CustomObjectMgr.queryCustomObjects('AverageProductRating', query,  "creationDate desc", null).asList(0,2);
    viewData.reviews = reviews;
    res.setViewData(viewData);
    return next();
});
 
module.exports = server.exports();