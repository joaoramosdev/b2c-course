'use strict';
 
var server = require('server');
 
server.post('Add', function(req, res, next) {
    var UUIDUtils = require('dw/util/UUIDUtils');
    var CustomObjectMgr = require("dw/object/CustomObjectMgr");
    var Transaction = require("dw/system/Transaction");
    var params = request.httpParameterMap;
    var review = {
        productId: params.productId.value,
        review: params.review.value,
        stars: params.stars.value,
        customerId: customer.ID,
        id: UUIDUtils.createUUID()
    }
 
    var object = CustomObjectMgr.getCustomObject("AverageProductRating", review.id);
    if (object == null) {
        Transaction.begin();
        object = CustomObjectMgr.createCustomObject("AverageProductRating", review.id);
        object.custom.feedback = review.review;
        object.custom.processed = false;
        object.custom.approved = false;
        object.custom.productId = review.productId;
        object.custom.mark = parseInt(review.stars);
        object.custom.customerID = review.customerId;
        Transaction.commit();
    }  
    res.json(review);
    return next();
});
 
module.exports = server.exports();