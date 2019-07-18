$(document).ready(() => {
    configView();
    $('#file').change(function (e) {
        var fileName = e.target.files[0].name;
        $('#file').parent().find('input[type="text"]').val(fileName);
    });
    $('#uploadForm').submit(function (e) {
        e.preventDefault();
        var form = $('#uploadForm')[0]; // You need to use standard javascript object here
        var formData = new FormData(form);
        var email = $('#uploadForm input[name=email]').val().replace(/\@/g, "_").replace(/\./g, "_");
        var time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/ /g, "_").replace(/-/g, "_").replace(/:/g, "_");
        $.ajax({
            url: '/apply/' + email + '/' + time,
            data: formData,
            type: 'POST',
            contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
            processData: false, // NEEDED, DON'T OMIT THIS
            success: function (res) {
                $('#uploadForm input').val(''); 
                $('#uploadForm input[type=submit]').val('APPLY'); 
                $('#uploadForm textarea').val('');
                
                show_noti();
            }
        });
    });
});

function show_noti() {
    // setTimeout(function () {
    //     $(".alert").fadeTo(500, 0).slideUp(500, function () {
    //         $(this).remove();
    //     });
    // }, 4000);
    alert('You have successfully applied to this job!')
}

function configView() {
    var topheight = $('#sectionsNav').height();
    $('#main-content').css({ 'margin-top': 'calc(' + topheight + 'px + 25px + 0.625rem)' })
}


function apply() {
    // var form = $('form')[0]; // You need to use standard javascript object here
    // var formData = new FormData(form);
    // for (var value of formData.values()) {
    //     console.log(value);
    // }
    // $.ajax({
    //     url: '/apply',
    //     data: formData,
    //     type: 'POST',
    //     contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
    //     processData: false, // NEEDED, DON'T OMIT THIS
    //     success: function (res) {
    //         console.log(res);
    //     }
    // });
}