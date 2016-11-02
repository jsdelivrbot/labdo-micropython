
var colorStepSize = 10.0;

function parseResponse(data) {
  var dataParts = data.split(',');
  return [parseInt(dataParts[0]), parseInt(dataParts[1]), parseInt(dataParts[2])];
}

function sendColorData(color {
  var xmlhttp = new XMLHttpRequest(
  xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var color = parseResponse(xmlhttp.responseText);
			console.log('RECV:', color);
      updateIndicator(color);
		}
	}

  xmlhttp.open("GET", "Color=" + color.join(','), true);
  xmlhttp.send();
}

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

function rgb2hsv (rgb) {
  var r = rgb[0] / 255.0;
  var g = rgb[1] / 255.0;
  var b = rgb[2] / 255.0;

  var rr, gg, bb,
      h, s,
      v = Math.max(r, g, b),
      diff = v - Math.min(r, g, b),
      diffc = function(c) {
          return (v - c) / 6 / diff + 1 / 2;
      };

  if (diff == 0) {
      h = s = 0;
  } else {
      s = diff / v;
      rr = diffc(r);
      gg = diffc(g);
      bb = diffc(b);

      if (r === v) {
          h = bb - gg;
      } else if (g === v) {
          h = (1 / 3) + rr - bb;
      } else if (b === v) {
          h = (2 / 3) + gg - rr;
      }
      if (h < 0) {
          h += 1;
      } else if (h > 1) {
          h -= 1;
      }
  }
  return { h: h, s: s, v: v };
}

function createElement(tagname, id, parent, styles) {
  var result = document.createElement(tagname);
  if (id) {
    result.id = id;
  }
  if (parent) {
    parent.appendChild(result);
  } else {
    document.body.appendChild(result);
  }

  if (styles) {
    for (var i in styles) {
      result.style[i] = styles[i];
    }
  }

  return result;
}

function createDiv(id, parent, styles) {
  return createElement('div', id, parent, styles);
}

function createCanvas(id, parent, styles) {
  return createElement('canvas', id, parent, styles);
}

function initDocumentStyles() {
  document.body.style.backgroundColor = '#999';
  document.body.style.margin = 0;
  document.body.style.padding = 0;
}

function rainbow(hueFacotr, saturationFactor) {
    var rgb = HSVtoRGB(hueFacotr, 1.0, saturationFactor);
    return 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')';
}

function drawPixels(canvas) {
  var ctx = canvas.getContext('2d');

  var w = canvas.width/colorStepSize;
  var h = canvas.height/colorStepSize;
  for(var x = 0; x < w; x++) {
    for(var y = 0; y < h; y++) {
        ctx.fillStyle = rainbow(x/w, y/h);
        ctx.fillRect(x * colorStepSize, y * colorStepSize, colorStepSize, colorStepSize);
    }
  }
}

function getColorAt(x, y) {
  var ctx = document.getElementById('colorCanvas').getContext('2d');
  return ctx.getImageData(x, y, 1, 1).data;
}

function createColorpicker(parent) {
  var result = createDiv('colorPicker', parent);
  result.style.width = '100%';
  result.style.height = '100%';

  var canvas = createCanvas('colorCanvas', result);
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;

  drawPixels(canvas);

  return result;
}
function createIndicator(parent) {
  var result = createDiv('indicator', parent, {
    width: 21,
    height: 20,
    position: 'absolute',
    left: 0,
    top: 0
  });

  createDiv(null, result, { borderBottom: '1px solid white', borderRight: '1px solid white', width: 10, height: 10, display: 'inline-block' });
  createDiv(null, result, { borderBottom: '1px solid white', width: 10, height: 10, display: 'inline-block' });
  createDiv(null, result, { borderRight: '1px solid white', width: 10, height: 10, display: 'inline-block' });

  return result;
}

function updateIndicator(color) {
  var indicator = document.getElementById('indicator');
  var colorCanvas = document.getElementById('colorCanvas');
  var w = colorCanvas.width;
  var h = colorCanvas.height;

  var hsv = rgb2hsv(color);

  var x = hsv.h * w - 10;
  var y = hsv.v * h - 10;

  indicator.style.left = x + 'px';
  indicator.style.top = y + 'px';
}

function onClick(e) {
  var color = getColorAt(e.offsetX, e.offsetY);
  sendColorData(color);
  console.log('color: ', color);
}

function init() {
  initDocumentStyles();

  var container = createDiv('container');
  createColorpicker(container);
  createIndicator(container);

  document.addEventListener('click', onClick);
}

init();
