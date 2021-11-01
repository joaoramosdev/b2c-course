'use strict';
var run = function () {
    var CustomObjectMgr = require("dw/object/CustomObjectMgr");
    var ProductMgr = require("dw/catalog/ProductMgr");
    var Transaction = require('dw/system/Transaction');
    var productsId = [], product;
    var reviews = CustomObjectMgr.queryCustomObjects('AverageProductRating', 'custom.approved = true', null, null).asList();
 
    var productId;
    //adding all products id to the array
    for (var i = 0; i < reviews.length; i++) {
        productId = reviews[i].custom.productId;
        productsId.push(productId);
    }
 
    var uniqueProducts = [productsId[0]];
    var unique;
    //adding only unique products id to the array
    for (var i = 1; i < productsId.length; i++) {
        unique = true;
        for (var j = 0; j < uniqueProducts.length; j++) {
            if (productsId[i] == uniqueProducts[j] ){
                unique = false;
            }
        }
        if (unique){
            uniqueProducts.push(productsId[i]);
        }  
    }
 
    var query, mark;
    //counting and setting products totalMark
    for (var i = 0; i < uniqueProducts.length; i++) {
        mark = 0;
        Transaction.begin();
        product = ProductMgr.getProduct(uniqueProducts[i]);
        query = "custom.approved = true AND custom.productId = '"+ uniqueProducts[i] + "'";
        reviews = CustomObjectMgr.queryCustomObjects('AverageProductRating', query , null, null).asList();
        for (var j = 0; j < reviews.length; j++) {
            mark += reviews[0].custom.mark;
        }  
        mark /= reviews.length;
        product.custom.totalMark = mark;
        Transaction.commit();
    } 
}
 
exports.Run = run;