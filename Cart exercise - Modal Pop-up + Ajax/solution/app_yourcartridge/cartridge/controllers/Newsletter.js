'use strict';
 
var server = require('server');
 
var URLUtils = require('dw/web/URLUtils');
var Resource = require('dw/web/Resource');
 
function sendEmail(formData) {
    var Mail = require('dw/net/Mail');
    var HashMap = require('dw/util/HashMap');
    var Template = require('dw/util/Template');
    var Resource = require('dw/web/Resource');
    var Site = require('dw/system/Site');
 
    var confirmationEmail = new Mail();
    var context = new HashMap();
    var subject = Resource.msg('newsletter.emailsubject', 'newsletter', null);
    context.put("NewsletterData", formData);
 
    var template = new Template('newsletter/confirmationEmail');
    var content = template.render(context).text;
 
 
    confirmationEmail.addTo(formData.email);
    confirmationEmail.setSubject(subject);
    confirmationEmail.setFrom(Site.current.getCustomPreferenceValue('customerServiceEmail')
        || 'no-reply@salesforce.com');
 
    confirmationEmail.setContent(content, 'text/html', 'UTF-8');
    confirmationEmail.send();
}
 
server.get('Show', function (req, res, next) {
    var actionUrls = {
        saveActionUrl: URLUtils.url('Newsletter-Subscribe').toString()
    };
    var newsletterForm = server.forms.getForm('newsletter');
    newsletterForm.clear();
    res.render('newsletter/newsletterSubscribeForm', {
        newsletterForm: newsletterForm,
        actionUrls: actionUrls,
        breadcrumbs: [
            {
                htmlValue: Resource.msg('global.home', 'common', null),
                url: URLUtils.home().toString()
            },
            {
                htmlValue: Resource.msg('page.title.myaccount', 'account', null),
                url: URLUtils.url('Account-Show').toString()
            }
        ]
    });
    next();
});
 
server.post('Subscribe', function (req, res, next) {
 
    var Transaction = require('dw/system/Transaction');
    var formErrors = require('app_storefront_base/cartridge/scripts/formErrors');
    var CustomObjectMgr = require('dw/object/CustomObjectMgr');
    var formErrors = require('app_storefront_base/cartridge/scripts/formErrors');
 
 
    var newsletterForm = server.forms.getForm('newsletter');
    var newsletterFormObj = newsletterForm.toObject();
    newsletterFormObj.newsletterForm = newsletterForm;
 
 
    if (newsletterForm.valid) {
 
        res.setViewData(newsletterFormObj);
        this.on('route:BeforeComplete', function () { // eslint-disable-line no-shadow
            Transaction.wrap(function () {
                var formInfo = res.getViewData();
                var obj = CustomObjectMgr.getCustomObject('Newsletter', formInfo.email);
                if (empty(obj)) {
                    var newsletter = CustomObjectMgr.createCustomObject('Newsletter', formInfo.email);
                    newsletter.custom.firstName = formInfo.firstName;
                    newsletter.custom.lastName = formInfo.lastName;
                    sendEmail(formInfo);
 
                    res.json({
                        success: true,
                        redirectUrl: URLUtils.url('Newsletter-Show').toString()
                    });
                } else {
                    formInfo.newsletterForm.valid = false;
                    formInfo.newsletterForm.email.valid = false;
                    formInfo.newsletterForm.email.error = Resource.msg('newsletter.error.message.emailalreadyexists', 'newsletter', null);
                    res.json({
                        success: false,
                        fields: formErrors.getFormErrors(newsletterForm)
                    });
                }
            });
        });
    } else {
        res.json({
            success: false,
            fields: formErrors(newsletterForm)
        });
    }
    return next();
});
 
 
module.exports = server.exports();