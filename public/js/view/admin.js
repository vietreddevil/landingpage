$(document).ready(()=> {
    configView();
});

function configView() {
    var topheight = $('#sectionsNav').height();
    $('#main-content').css({'margin-top':'calc(' + topheight + 'px + 25px + 0.625rem)'})
}

function EditJob(id) {
    location.href = "/editjob/" + id;
}
