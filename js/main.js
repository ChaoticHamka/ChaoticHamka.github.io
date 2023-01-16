$(document).ready(function(){
    /* Плавная прокрутка меню */
    
      $('nav a[href^="#"]').click(function() {
          let target = $(this).attr('href');
  $('html,body').animate({
      scrollTop: $(target).offset().top
  },1000);
  $('nav a[href^="#"]').parent().removeClass('active');
  $(this).parent().addClass('active');
  $('.menu_mob .menu').toggle(500);
  $('.menu_burger').toggleClass('close');
  return false;
      });
  /* Мобильное меню */
  $('.menu_burger').click(function(){
      $('.menu_mob .menu').toggle(500);
      $(this).toggleClass('close');
  });
  
  });