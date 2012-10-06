define(['mods/menu','libs/jquery', 'libs/underscore'], function() {
  $(window).on('load', function() {
    $('#loading').fadeOut(1000);
    $('#wrapper').fadeIn(1000);
  });
});
