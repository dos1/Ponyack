define(['mods/menu','libs/jquery', 'libs/underscore'], function(Menu) {
  $(function() {
    Menu.init();
    $('#loading').fadeOut(1000);
    $('#wrapper').hide().removeClass('hidden').fadeIn(1000);
  });
});
