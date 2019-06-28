
$(function () {
    $('.btn-modal').click(function(){
      $('.modal').addClass('click')
    });

    $('.display').click(function(){
      $('.modal').removeClass('click')
    });
    $('.menu-app').on('click', function() {
      $('.menu-glase').slideToggle(100, function(){
       	if( $(this).css('display') === "none"){
                  $(this).removeAttr('style');
                }
              }); 
    });
        $('.lab__btn, .btn').click(function (e) {
      e.preventDefault();
      var elementClick = $(this).attr("href");
      var destination = $(elementClick).offset().top;
      $('html, body').animate({ scrollTop: destination }, 600);
      return false;
    });


});
	// $('.menu-app').click(function(e) { 
	//   $('.menu-glase').toggleClass("active-n"); 
	//   e.preventDefault();
	//   }); 




