$(document).ready(()=> {
    configView();
});

function configView() {
    var topheight = $('#sectionsNav').height();
    $('#main-content').css({'margin-top':'calc(' + topheight + 'px + 25px + 0.625rem)'});
    var desc = $('.job-desc pre').text().trim();
    $('.job-desc pre').html(desc);
}