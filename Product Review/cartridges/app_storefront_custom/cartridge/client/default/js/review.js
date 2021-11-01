$('#submitReview').click(function() {
    var starValue = $('input[name="rate"]:checked').val();
    var review = $('#productReview').val();
    var productId = $('#productId').val();
    var url = $('#addReviewUrl').val();
 
    if(!starValue) return;
    if(!review) return;
 
    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        data: {stars: starValue, review: review, productId: productId, approved: false, processed: false},
        success: function(data) {
            location.href = window.location.href; 
        }
    });
    return;
})