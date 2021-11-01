$('#deleteBasket').click(function() {
    var currentUrl = window.location.href;
    var url = $('#removeUrl').val();
    $.ajax({
        url: url,
        type: 'get'
    }).done(function (data) {
        location.href = currentUrl;
        return;   
    });
    return;
})