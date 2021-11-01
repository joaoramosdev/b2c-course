'use strict';
 
var formValidation = require('../components/formValidation');
 
var url;
var isDefault;
 
module.exports = {
    submitNewsletter: function () {
        $('form.newsletter-form').submit(function (e) {
            var $form = $(this);
            e.preventDefault();
            url = $form.attr('action');
            $('.newsletter-confirmation-btn').click(function (f) {
                f.preventDefault();
                $form.spinner().start();
                $('form.newsletter-form').trigger('newsletter:submit', e);
                $.ajax({
                    url: url,
                    type: 'post',
                    dataType: 'json',
                    data: $form.serialize(),
                    success: function (data) {
                        $form.spinner().stop();
                        if (!data.success) {
                            formValidation($form, data);
                        } else {
                            location.href = data.redirectUrl;
                        }
                    },
                    error: function (err) {
                        if (err.responseJSON.redirectUrl) {
                            window.location.href = err.responseJSON.redirectUrl;
                        }
                        alert('fim');
                        $form.spinner().stop();
                    }
                });
            });
 
            return false;
        });
    }
};