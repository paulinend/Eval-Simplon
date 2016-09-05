$('.signup').click(function(){
  if( $('.main-content').hasClass('active') ){
    $('.main-content').removeClass('active');
    $('main-content2').addClass('active');
  }
});
