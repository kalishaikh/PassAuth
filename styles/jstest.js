$(".btn.btn-danger.btn-sm").click(function () {
    $(this).closest('li').remove();
});

$(".btn.btn-success.btn-sm").click(function () {
    var input = $(this).prev('input').val();
    console.log("button clicked");
});

$(".alert").fadeOut(3000);

$(document).ready(function () {
    const testerinput = "this data";
    $("#testform").on('submit',function(){
        event.preventDefault();
        console.log('form is stopped');
    $.ajax({
        type: "POST",
        url: "/users/test/",
        data: testerinput,
        contentType: 'application/json',
        success: function(result){
            console.log(result);
        }
    });
});
});