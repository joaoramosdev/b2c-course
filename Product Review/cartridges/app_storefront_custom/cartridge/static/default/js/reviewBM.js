"use strict";
 
jQuery("#submitApprove").click(function(){
    var url = jQuery('#approveUrl').val();
    var reviews = [];
    jQuery.each(jQuery("input[name='approve']:checked"), function(){
        reviews.push(jQuery(this).val());
    });
 
    jQuery.ajax({
        url: url,
        type: "post",
        data: {reviews: JSON.stringify(reviews)},
        success: function(data) {
            location.href = window.location.href; 
        }
    });
    return;
});
 
jQuery("#approveAll").change(function() {
    jQuery("input[name='approve']").prop('checked', this.checked);
});