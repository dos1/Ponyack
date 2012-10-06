define(['libs/jquery'], function() {
  $(window).on('load', function() {
    $('#loading').fadeOut(1000);
    $('h1, #content').fadeIn(1000);
  });
});
