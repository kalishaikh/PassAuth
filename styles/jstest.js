var deletedTask;
var addedTask;
$(document).ready(function () {

   //Delete a task

$(document).on('click',".btn.btn-success.btn-sm",function (event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    deletedTask = $(this).prev('input').val().trim();
    $(this).prev('input').fadeOut("slow");
    $(this).parent().fadeOut("slow");
    console.log('Delete Task Form Stopped: ');
    console.log('Delted task is "' +deletedTask+'"');
$.ajax({
    type: "POST",
    url: "/users/deleteTask/",
    data: JSON.stringify({"deletedTask" : deletedTask}),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function(result){
        console.log('Elements in the mongoDB array are : ' + result);
    }
    });
});
    


//Add a task
$(document).on('submit', "#addTask", function(event){
    event.preventDefault();
    event.stopImmediatePropagation();
    if($("#arrayMe").val() == ''){
        alert("Task cannot be blank");
    }
    else{
    console.log('Added task form is stopped');
    addedTask = $("#arrayMe").val();
    console.log("Value of input is " + addedTask);

    $.ajax({
        type: "POST",
        url: "/users/addedTask/",
        data: JSON.stringify({"addedTask" : addedTask}),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(result){
            $(".taskForm").prepend('<div class="input-group mb-3"><input type = "text" class = "form-control" name = "testerinput" value = "' +addedTask+ ' "><button class = "btn btn-success btn-sm" type = "submit"><i class="fa fa-check fa-sm"></i></button></div>');
            $("#arrayMe").val("");
        }
    });
    }
});

$(document).on('keypress', 'input', function(event){
    if(event.which == 13 && $(this).attr('name') == 'testerinput'){
        const updated = {
            "newEntry" : $(this).val(),
            "original_val" : $(this).attr("value"),
        };

       event.preventDefault();
       event.stopImmediatePropagation();
       console.log("i kno ur clicked");
       console.log($(this).val());

       $.ajax({
        type: "POST",
        url: "/users/editTask/",
        data: JSON.stringify({"update" : updated}),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        });
    }
});


$(".alert").fadeOut(3000);

});

    

