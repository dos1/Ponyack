define(["libs/text!templates/login.tpl", "libs/text!drawings/login.txt", "libs/canvas", "libs/jquery", "libs/underscore"], function(TLogin, DLogin, Canvas) {

  var $node;
  
  function init(cb) {

    if (window.user.login) {
      window.location.replace('#/game');
      return;
    }

    $node = $('#content');
    var template=_.template(TLogin);
    $node.empty().append(template());

    var canvas = Canvas.init($node.find('canvas'), true);
    //canvas.pause(true);
    canvas.draw(26, 23, JSON.parse(DLogin), 1);
    
    $node.find('form').on('submit', function() {
      var login = $('#nickname').val(), pass = $('#pass').val();
      if (!(login && pass)) return false;
      $('#wrapper').fadeOut(500, function() {
        $node.html('Please wait...');
        $('#wrapper').fadeIn(500, function() {
          $.post('server/login', {login:login, pass:pass}, function(data) {
            //var data={status:"OK", hasCharacter: false};
            if (data.status==="OK") {
              window.user = data;
              window.location.replace('#/game');
            } else {
              init();
              $node.prepend($('<div></div>').html('Wrong password or nickname already taken.'));
            }
          }, 'json').error(function() { alert('Error!'); window.location.reload(); });
        });
      });
      return false;
    });

    cb();
  }
  
  return { init: init };
});
