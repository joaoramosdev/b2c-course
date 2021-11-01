'use strict'
 
var server = require('server');
 
server.extend(module.superModule);
 
server.append('Details', function(req, res, next) {
    var URLUtils = require('dw/web/URLUtils');
    var viewData = res.getViewData();
    var orderID = req.querystring.orderID;
    viewData.reorderUrl = URLUtils.url('Order-Reorder', 'orderID', orderID).toString();
    res.setViewData(viewData);
    return next();
})
 
 
server.get('Reorder', function(req, res, next) {
    var URLUtils = require('dw/web/URLUtils');
    var Transaction = require('dw/system/Transaction');
    var BasketMgr = require('dw/order/BasketMgr');
    var OrderMgr = require('dw/order/OrderMgr');
    var cartHelper = require('*/cartridge/scripts/cart/cartHelpers');
    var currentBasket = BasketMgr.getCurrentOrNewBasket();
    var orderID = req.querystring.orderID;
    var order = OrderMgr.getOrder(orderID);
    var productLineItems = order.productLineItems; //.quantityValue
    var quantity, productID;
 
    Transaction.begin();
    for (var i = 0; i < productLineItems.length; i++) {
        quantity = productLineItems[i].quantityValue;
        productID = productLineItems[i].productID;
        cartHelper.addProductToCart(
            currentBasket,
            productID,
            quantity,
            [], []
        );
    }
    Transaction.commit();
 
    res.redirect(URLUtils.url('Order-Details', 'orderID', orderID));
    return next();   
})
 
module.exports = server.exports();