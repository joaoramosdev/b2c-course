'use strict';
 
var baseModule = module.superModule;
 
var Site = require('dw/system/Site');
 
/**
 * Sends a confirmation to the current user
 * @param {dw.order.Order} order - The current user's order
 * @param {string} locale - the current request's locale id
 * @returns {void}
 */
function sendConfirmationEmail(order, locale) {
    var OrderModel = require('*/cartridge/models/order');
    var emailHelpers = require('*/cartridge/scripts/helpers/emailHelpers');
    var Resource = require('dw/web/Resource');
    var Locale = require('dw/util/Locale');
 
    var currentLocale = Locale.getLocale(locale);
 
    var orderModel = new OrderModel(order, { countryCode: currentLocale.country, containerView: 'order' });
 
    var orderObject = { order: orderModel };
 
    // Gift message
    var giftMsg = isGeoGift() ? Resource.msg('msg.gift', 'confirmation', null) : Resource.msg('msg.no.gift', 'confirmation', null);
    orderObject.giftMsg = giftMsg;
 
    var emailObj = {
        to: order.customerEmail,
        subject: Resource.msg('subject.order.confirmation.email', 'order', null),
        from: Site.current.getCustomPreferenceValue('customerServiceEmail') || 'no-reply@salesforce.com',
        type: emailHelpers.emailTypes.orderConfirmation
    };
 
    emailHelpers.sendEmail(emailObj, 'checkout/confirmation/confirmationEmail', orderObject);
}
 
function isGeoGift() {
    var giftCoordinates = Site.current.getCustomPreferenceValue('giftCoordinates').split(',');
    var latitude = +giftCoordinates[0];
    var longitude = +giftCoordinates[1];
    var lat1deg = 110.574; // 110.574 km in 1 latitude deg
    var latitudeDelta1000km = 1000 / lat1deg;
    var latitude1000kmDown = latitude - latitudeDelta1000km;
    var longitude1000kmRight = longitude + 1000 / (111.32 * Math.cos(latitude)); // in 1 longitude deg is 111.32km * cos(latitude)
 
    var geo = request.geolocation;
    var userLatitude = geo.latitude;
    var userLongitude = geo.longitude;
 
    if ( userLatitude > latitude || userLatitude < latitude1000kmDown ) {
        return false;
    }
    if ( userLongitude < longitude || userLongitude > longitude1000kmRight ) {
        return false;
    }
 
    return true;
}
 
baseModule.sendConfirmationEmail = sendConfirmationEmail;
 
module.exports = baseModule;