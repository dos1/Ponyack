define([], function() {

  function init ($el) {
    var canvas, context, canvaso, contexto, lines = [], animation = { inprogress: false, skip: false };

    // The general-purpose event handler. This function just determines the mouse
    // position relative to the canvas element.
    function ev_canvas (ev) {
      if (ev.layerX || ev.layerX == 0) { // Firefox
        ev._x = ev.layerX;
        ev._y = ev.layerY;
      } else if (ev.offsetX || ev.offsetX == 0) { // Opera
        ev._x = ev.offsetX;
        ev._y = ev.offsetY;
      }
      
      // Call the event handler of the tool.
      var func = tool[ev.type];
      if (func) {
        func(ev);
      }
    }
    
    // The event handler for any changes made to the tool selector.
    function ev_tool_change (ev) {
      if (tools[this.value]) {
        tool = new tools[this.value]();
      }
    }
    
    // This function draws the #imageTemp canvas on top of #imageView, after which
    // #imageTemp is cleared. This function is called each time when the user
    // completes a drawing operation.
    function img_update () {
      context.lineJoin = "round";
      
      for(var i=0; i < lines.length; i++)
      {
        if (!lines[i][3]) {
          context.beginPath();
          if (!lines[i][2] && i){
            context.moveTo(lines[i-1][0], lines[i-1][1]);
          } else {
            context.moveTo(lines[i][0], lines[i][1]);
          }
          context.lineTo(lines[i][0], lines[i][1]);
          context.closePath();
          context.stroke();
          lines[i][3]=true;
        }
      }
      contexto.drawImage(canvas, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    // This object holds the implementation of each drawing tool.
    var tools = {};
    
    // The drawing pencil.
    tools.pencil = function () {
      var tool = this;
      this.started = false;
      
      // This is called when you start holding down the mouse button.
      // This starts the pencil drawing.
      this.mousedown = function (ev) {
        tool.started = true;
        lines.push([ev._x, ev._y, true, false]);
      };
      
      this.mouseout = function (ev) {
        tool.started = false;
      };
      
      // This function is called every time you move the mouse. Obviously, it only
      // draws if the tool.started state is set to true (when you are holding down
      // the mouse button).
      this.mousemove = function (ev) {
        if (tool.started) {
          lines.push([ev._x, ev._y, false, false]);
          img_update();
        }
      };
      
      // This is called when you release the mouse button.
      this.mouseup = function (ev) {
        tool.started = false;
      };
    };
    
    // The rectangle tool.
    tools.rect = function () {
      var tool = this;
      this.started = false;
      
      this.mousedown = function (ev) {
        tool.started = true;
        tool.x0 = ev._x;
        tool.y0 = ev._y;
      };
      
      this.mousemove = function (ev) {
        if (!tool.started) {
          return;
        }
        
        var x = Math.min(ev._x,  tool.x0),
       y = Math.min(ev._y,  tool.y0),
       w = Math.abs(ev._x - tool.x0),
       h = Math.abs(ev._y - tool.y0);
       
       context.clearRect(0, 0, canvas.width, canvas.height);
       
       if (!w || !h) {
         return;
       }
       
       context.strokeRect(x, y, w, h);
      };
      
      this.mouseup = function (ev) {
        if (tool.started) {
          tool.mousemove(ev);
          tool.started = false;
          img_update();
        }
      };
    };
    
    // The line tool.
    tools.line = function () {
      var tool = this;
      this.started = false;
      
      this.mousedown = function (ev) {
        tool.started = true;
        tool.x0 = ev._x;
        tool.y0 = ev._y;
      };
      
      this.mousemove = function (ev) {
        if (!tool.started) {
          return;
        }
        
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        context.beginPath();
        context.moveTo(tool.x0, tool.y0);
        context.lineTo(ev._x,   ev._y);
        context.stroke();
        context.closePath();
      };
      
      this.mouseup = function (ev) {
        if (tool.started) {
          tool.mousemove(ev);
          tool.started = false;
          img_update();
        }
      };
    };
    

    // The active tool instance.
    var tool;
    var tool_default = 'pencil';

    // Find the canvas element.
    canvaso = $el[0];
    if (!canvaso) {
      alert('Error: I cannot find the canvas element!');
      return;
    }

    if (!canvaso.getContext) {
      alert('Error: no canvas.getContext!');
      return;
    }

    // Get the 2D canvas context.
    contexto = canvaso.getContext('2d');
    if (!contexto) {
      alert('Error: failed to getContext!');
      return;
    }

    // Add the temporary canvas.
    var container = canvaso.parentNode;
    canvas = document.createElement('canvas');
    if (!canvas) {
      alert('Error: I cannot create a new canvas element!');
      return;
    }

    canvas.id     = 'imageTemp';
    canvas.width  = canvaso.width;
    canvas.height = canvaso.height;
    container.appendChild(canvas);

    context = canvas.getContext('2d');

    // Get the tool select input.
    /*var tool_select = document.getElementById('dtool');
    if (!tool_select) {
      alert('Error: failed to get the dtool element!');
      return;
    }
    tool_select.addEventListener('change', ev_tool_change, false);*/

    // Activate the default tool.
    if (tools[tool_default]) {
      tool = new tools[tool_default]();
      //tool_select.value = tool_default;
    }

    // Attach the mousedown, mousemove and mouseup event listeners.
    canvas.addEventListener('mousedown', ev_canvas, false);
    canvas.addEventListener('mousemove', ev_canvas, false);
    canvas.addEventListener('mouseout', ev_canvas, false);
    canvas.addEventListener('mouseup',   ev_canvas, false);

    // public

    function get() {
      var l = [], tmp={ points:[], type: 'pencil' };
      for (var i in lines) {
        if ((lines[i][2]) && (tmp.points.length)) {
          l.push(tmp);
          tmp={ points:[], type: 'pencil' };
        }
        tmp.points.push({ x: lines[i][0], y: lines[i][1] });
      }
      if (tmp.points.length) {
        l.push(tmp);
      }
      return l;
    }
    
    function draw(x, y, data, delay, steps, callback) {
      // TODO: support delay
      
      var wrapped = [];
      _.each(data, function(d) {
        var started = true;
        _.each(d.points, function(point) {
          wrapped.push([point.x+x, point.y+y, started, false]);
          started = false;
        });
      });

      if (delay) {
        if (!steps) steps=1;
        var i=0;
        var d = function() {
          while (i<steps) {
            if (!wrapped.length) {
              if (callback) callback();
              clearInterval(interval);
              return;
            }
            lines.push(wrapped[0]);
            wrapped.shift();
            img_update();
            i++;
          }
          i=i-steps;
        };
        var interval = setInterval(d, delay);
      } else {
        _.each(wrapped, function(p) {
          lines.push(p);
        });
        img_update();
        if (callback) callback();
      }
    }
    
    function clear() {
      lines = [];
      context.clearRect(0, 0, canvas.width, canvas.height);
      contexto.clearRect(0, 0, canvas.width, canvas.height);
    }

    return {get:get, draw:draw, clear:clear};
  }

  return {init:init};
});
