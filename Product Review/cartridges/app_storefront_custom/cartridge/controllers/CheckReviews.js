'use strict';
 
var server = require('server');
 
server.get('Start', function(req, res, next) {
    var CustomObjectMgr = require("dw/object/CustomObjectMgr");
    var reviews = CustomObjectMgr.getAllCustomObjects('AverageProductRating').asList();
    res.render('reviewsTable', {reviews: reviews});
    return next();
})
 
server.post('Approve', function(req, res, next) {
    var CustomObjectMgr = require("dw/object/CustomObjectMgr");
    var Transaction = require('dw/system/Transaction');
    var params = request.httpParameterMap;
    var reviews = params.reviews.value;
    reviews = reviews.replace('[','');
    reviews = reviews.replace(']','');
    reviews = reviews.split('"').join('');
    reviews = reviews.split(',');
    var object;
    Transaction.begin();
    for (var i = 0; i < reviews.length; i++) {
        object = CustomObjectMgr.getCustomObject("AverageProductRating", reviews[i]);
        if (object != null) {
            object.custom.approved = true;
        }
    }
    Transaction.commit();
 
    res.json(params);
    return next();
})
 
module.exports = server.exports();