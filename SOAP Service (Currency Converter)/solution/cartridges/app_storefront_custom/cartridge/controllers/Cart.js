'use strict';
 
var server = require('server');
var RON_CURRENCY = "RON";
 
server.extend(module.superModule)
 
/**
 * Adds new parameter with the grandTotal in RON currency
 */
server.append('Show', function(req, res, next){   
    var viewData = res.getViewData();
    var currency = viewData.items;
    currency = currency[0].price.sales.currency;
 
    var conversionRate = callCurrencyService(currency);
 
    viewData.ronTotal = '';
    if (conversionRate) {
        var basketTotal = viewData.totals.grandTotal;
        basketTotal = basketTotal.substr(1);
        ronTotal = conversionRate.object * basketTotal * 100;
        ronTotal = Math.round(ronTotal)/100;
 
        viewData.ronTotal = ' / '+ronTotal + ' '+RON_CURRENCY;
    }
 
    res.setViewData(viewData);
    return next();
})
 
/**
 * Call Soap Service
 * obtains the value of the RON for parameter currency
 * @param {*} currency
 */
function callCurrencyService(currency) {
    var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');
    var currencyService = LocalServiceRegistry.createService("custom.soap.infovalutar.GetLatestValue", {
        initServiceClient: function() {
             webReference = webreferences2.infovalutar;
             return webReference.getService('Curs',"CursSoap");
        },
        createRequest: function(svc, parameter) {
            return svc.serviceClient.getLatestValue(parameter);
        },
        execute: function(svc, requestObject) {
            return requestObject;
        }
    });
 
    var result = currencyService.call(currency);
    if(result) {
       return result;
    }
    return null;
}
module.exports = server.exports();