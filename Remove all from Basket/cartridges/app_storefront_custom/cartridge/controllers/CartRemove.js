'use strict';
 
var server = require('server');
 
server.get('Remove', function(req, res, next) {
    var Transaction = require('dw/system/Transaction');
    var BasketMgr = require('dw/order/BasketMgr');
    var Resource = require('dw/web/Resource');
 
    var currentBasket = BasketMgr.getCurrentBasket();
    var basketItems =  currentBasket.getAllProductLineItems();
 
    Transaction.wrap(function () {
        for (var i = 0; i < basketItems.length; i++) {
            var item = basketItems[i];
            currentBasket.removeProductLineItem(item);
        }
    });
 
    res.json({message: Resource.msg('remove.status', 'removeCart', null)});
    return next();
})
 
module.exports = server.exports();