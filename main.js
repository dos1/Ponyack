define(['mods/menu','libs/path', 'libs/jquery', 'libs/underscore'], function(Menu) {
  _.templateSettings = {
    interpolate : /\{\{(.+?)\}\}/g,
       evaluate : /\{\|(.+?)\|\}/g
  };

  window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
    })();

  function AddRoute(route, callback, leave) {
    Path.map("#"+route).to(function () {
      var params = this.params;
      if (leave) leave();
      $('#loading').fadeIn(500);
      $('#wrapper').fadeOut(500, function() {
        callback(function() {
          $('#loading').fadeOut(500);
          $('#wrapper').removeClass('hidden').fadeIn(500);
        }, params);
      });
    });
  }
  
  AddRoute("/", function(cb) { Menu.init(); cb(); });
  AddRoute("/about", function(cb) { 
    require(['mods/about'], function(About) {
      About.init();
      cb();
    });
  });
  AddRoute("/explore", function(cb) {
    require(['mods/explore'], function(Explore) {
      Explore.init(cb);
    });
  });

  AddRoute("/explore/:id", function(cb, params) {
    require(['mods/character'], function(Character) {  
      Character.init(params.id, cb);
    });
  });

  AddRoute("/login", function(cb) {
    require(['mods/login'], function(Login) {
      Login.init(cb);
    });
  });

  AddRoute("/game", function(cb) {
    require(['mods/game'], function(Game) {
      Game.init(null, cb);
    });
  });

  AddRoute("/game/intro", function(cb) {
    require(['mods/intro'], function(Intro) {
      Intro.init(cb);
    });
  });

  AddRoute("/game/create", function(cb) {
    require(['mods/create'], function(Create) {
      Create.init(cb);
    });
  });

  AddRoute("/logout", function(cb) {
    $.get('server/logout', {}, function() {
      $('#wrapper').css('visibility','hidden');
      window.location = '#/';
      window.location.reload();
    });
  });

  Path.root("#/");
  Path.rescue(function() {
    window.location.replace('#/');
  });

  $(function() {
    $.get('server/login', {}, function(data) {
      window.user = data; // FIXME
      //Menu.init();
      Path.listen();
      //$('#loading').fadeOut(1000);
      //$('#wrapper').hide().removeClass('hidden').fadeIn(1000);
    }, 'json').error(function() { alert('Server error - try again later!'); });
  });
});
