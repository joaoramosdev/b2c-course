'use strict';
var server = require('server');
 
var page = require('app_storefront_base/cartridge/controllers/Cart');
 
server.extend(page);
 
server.get('GetCartTotal', function(req, res, next) {
    var BasketMgr = require('dw/order/BasketMgr');
    var currentBasket = BasketMgr.getCurrentBasket();
    res.render('cart/cartwarning', {
        grandTotal: currentBasket.getMerchandizeTotalGrossPrice()
    });
 
    next();
});
 
module.exports = server.exports();