'use strict';
 
$('.wishlist-new, .wishlist-owner').on('click', function (e) {
    $(this).hide();
    $(this).next().show();
});
 
$('.wishlist-input-name').on('focusout', function (e) {
    $(this).closest('form').hide();
    $(this).closest('form').prev().show();
});
 
$('.wishlistTile').on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).hide();
    $(this).next().show();
});
 
/**
 * appends params to a url
 * @param {string} data - data returned from the server's ajax call
 * @param {Object} icon - icon that was clicked to add a product to the wishlist
 */
function displayMessageAndChangeIcon(data, icon, modal) {
    $.spinner().stop();
    $(modal).modal('hide');
    var status;
    if (data.success) {
        status = 'alert-success';
        if (icon.hasClass('fa-heart-o')) {
            icon.removeClass('fa-heart-o').addClass('fa-heart');
        }
    } else {
        status = 'alert-danger';
    }
 
    if ($('.add-to-wishlist-messages').length === 0) {
        $('body').append(
            '<div class="add-to-wishlist-messages "></div>'
        );
    }
    $('.add-to-wishlist-messages')
        .append('<div class="add-to-wishlist-alert text-center ' + status + '">' + data.msg + '</div>');
 
    setTimeout(function () {
        $('.add-to-wishlist-messages').remove();
    }, 5000);
}
 
$('.tile-wishlist-move').on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    // var icon = $(this).find($('i'));
    var icon = $(this).closest('.wishlistTile2').find($('i'));
    var url = $(this).attr('href');
    var pid = $(this).data('pid');
    var lid = $(this).data('lid');
    var modal = $(this).data('modal');
    var optionId = $(this).closest('.product-detail').find('.product-option').attr('data-option-id');
    var optionVal = $(this).closest('.product-detail').find('.options-select option:selected').attr('data-value-id');
    optionId = optionId || null;
    optionVal = optionVal || null;
    if (!url || !pid) {
        return;
    }
 
    $.spinner().start();
    $.ajax({
        url: url,
        type: 'post',
        dataType: 'json',
        data: {
            lid: lid,
            pid: pid,
            optionId: optionId,
            optionVal: optionVal
        },
        success: function (data) {
            displayMessageAndChangeIcon(data, icon, modal);
        },
        error: function (err) {
            displayMessageAndChangeIcon(err, icon, modal);
        }
    });
});