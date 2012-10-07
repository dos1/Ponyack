define(['mods/menu','libs/jquery', 'libs/underscore'], function(Menu) {
  _.templateSettings = {
    interpolate : /\{\{(.+?)\}\}/g,
       evaluate : /\{\|(.+?)\|\}/g
  };
  
  $(function() {
    $.get('server/login', {}, function(data) {
      window.user = data; // FIXME
      Menu.init();
      $('#loading').fadeOut(1000);
      $('#wrapper').hide().removeClass('hidden').fadeIn(1000);
    }, 'json').error(function() { alert('Server error - try again later!'); });
  });
});
