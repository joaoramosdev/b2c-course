'use strict';
var server = require('server');
 
var page = require('app_storefront_base/cartridge/controllers/Cart');
 
server.extend(page);
 
server.append('AddProduct', function (req, res, next) {
    var ProductMgr = require('dw/catalog/ProductMgr');
    var Mail = require('dw/net/Mail');
    var HashMap = require('dw/util/HashMap');
    var Template = require('dw/util/Template');
    var Resource = require('dw/web/Resource');
    var Site = require('dw/system/Site');
 
    var product = ProductMgr.getProduct(req.form.pid);
 
 
    var confirmationEmail = new Mail();
    var context = new HashMap();
    var subject = Resource.msg('msg.emailsubject.addproduct', 'cart', null);
    context.put("Product", product);
    context.put("MailSubject", subject);
 
    var template = new Template('cart/confirmation/confirmationEmail');
    var content = template.render(context).text;
 
 
    confirmationEmail.addTo(customer.getProfile().getEmail());
    confirmationEmail.setSubject(subject);
    confirmationEmail.setFrom(Site.current.getCustomPreferenceValue('customerServiceEmail')
        || 'no-reply@salesforce.com');
 
    confirmationEmail.setContent(content, 'text/html', 'UTF-8');
    confirmationEmail.send();
 
    next();
});
 
module.exports = server.exports();