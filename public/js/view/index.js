$(document).ready(()=> {
    configView();
});

function configView() {
    var topheight = $('#sectionsNav').height();
    $('#main-content').css({'margin-top':'calc(' + topheight + 'px + 25px + 0.625rem)'})
}

function GotoJob(id) {
    location.href = "/checkjob/" + id;
}