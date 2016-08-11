function name(params) {
    return 0;
}

$('.video').embed();

$('.main-head').visibility({
    once: false,
    continuous: true,
    onPassing: function (calculations) {          
        var opacity = 1 - calculations.percentagePassed;
        $(this).css('opacity', opacity);
    },
    onBottomPassed: function(){
        $('.menu-scrolled').addClass('visible');
    },
    onBottomVisible: function(){
        $('.menu-scrolled').removeClass('visible');
    }
});