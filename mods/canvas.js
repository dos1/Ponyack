define(["libs/underscore"], function() {

  function init ($el, supportDrawing) {
    var canvas, context, canvaso, contexto, lines = [], animation = { inprogress: false, skip: false }, callbacks = [], paused = false;

    // The general-purpose event handler. This function just determines the mouse
    // position relative to the canvas element.
    function ev_canvas (ev) {
      if (paused) return;
      if (animation.inprogress && ev.type=="mousedown") {
        animation.skip = true;
        return;
      }
      if (tool.started && (ev.type=="mouseup" || ev.type=="mouseout")) {
        // pass last line as argument
        var last = [];
        var i = lines.length-1;
        while (!lines[i][2]) {
          last.unshift({x:lines[i][0],y:lines[i][1]});
          i--;
        }
        last.unshift({x:lines[i][0],y:lines[i][1]});
        _.each(callbacks, function(callback) {
          callback(last);
        });
      }
      
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
      var con = context;
      if (!supportDrawing) {
        con = contexto;
        //context.clearRect(0, 0, canvaso.width, canvaso.height);
      }

      con.lineJoin = "round";
      
      for(var i=0; i < lines.length; i++)
      {
        if (!lines[i][3]) {
          con.beginPath();
          if (!lines[i][2] && i){
            con.moveTo(lines[i-1][0], lines[i-1][1]);
          } else {
            con.moveTo(lines[i][0], lines[i][1]);
          }
          con.lineTo(lines[i][0], lines[i][1]);
          con.closePath();
          con.stroke();
          lines[i][3]=true;
        }
      }
      if (supportDrawing) {
        contexto.drawImage(canvas, 0, 0);
        con.clearRect(0, 0, canvas.width, canvas.height);
      }
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

    if (supportDrawing) {
      // Add the temporary canvas.
      var container = canvaso.parentNode;
      canvas = document.createElement('canvas');
      if (!canvas) {
        alert('Error: I cannot create a new canvas element!');
        return;
      }

      canvas.id     = canvaso.id+'imageTemp';
      canvas.setAttribute('class', 'imageTemp');
      canvas.width  = canvaso.width;
      canvas.height = canvaso.height;
      container.appendChild(canvas);

      context = canvas.getContext('2d');
    }

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

    if (supportDrawing) {
      // Attach the mousedown, mousemove and mouseup event listeners.
      canvas.addEventListener('mousedown', ev_canvas, false);
      canvas.addEventListener('mousemove', ev_canvas, false);
      canvas.addEventListener('mouseout',  ev_canvas, false);
      canvas.addEventListener('mouseup',   ev_canvas, false);
    }

    // public

    function get() {
      var l = [], tmp={ points:[], type: 'pencil' };
      for (var i in lines) {
        if ((lines[i][2]) && (tmp.points.length)) {
          l.push(tmp);
          tmp={ points:[], type: 'pencil' };
        }
        if (i>0) {
          if (lines[i-1][0] == lines[i][0] && lines[i-1][1] == lines[i][1]) {
            // don't insert duplicated entries
            continue;
          }
        }
        tmp.points.push({ x: lines[i][0], y: lines[i][1] });
      }
      if (tmp.points.length) {
        l.push(tmp);
      }
      return l;
    }
    
    function draw(x, y, data, delay, steps, callback, skip_callback) {
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
        animation.inprogress = true;
        if (!steps) steps=1;
        var i=0;
        var d = function() {
          while (i<steps) {
            if (animation.skip) {
              _.each(wrapped, function(p) {
                lines.push(p);
              });
              img_update();
              animation.inprogress = false;
              animation.skip = false;
              clearInterval(interval);
              if (skip_callback) skip_callback();
              if (callback) callback();
              return;
            }
            if (!wrapped.length) {
              clearInterval(interval);
              animation.inprogress = false;
              if (callback) callback();
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
      if (supportDrawing) {
        context.clearRect(0, 0, canvaso.width, canvaso.height);
      }
      contexto.clearRect(0, 0, canvaso.width, canvaso.height);
    }

    function addCallback(callback) {
      callbacks.push(callback);
    }

    function pause(p) {
      paused = p;
    }

    function undo() {
      if (supportDrawing) {
        context.clearRect(0, 0, canvaso.width, canvaso.height);
      }
      contexto.clearRect(0, 0, canvaso.width, canvaso.height);
      var i = lines.length-1;
      if (i<0) return;
      while (!lines[i][2]) {
        lines.pop();
        i--;
      }
      lines.pop();
      for (var i in lines) {
        lines[i][3] = false;
      }
      img_update();
    }

    return {get:get, draw:draw, clear:clear, addCallback:addCallback, pause: pause, undo: undo, getContext: function() { return contexto; }};
  }

  return {init:init};
});
