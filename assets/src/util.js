// http://stackoverflow.com/a/28857255
export function getElementOffset(element) {
  const de = document.documentElement;
  const box = element.getBoundingClientRect();
  const top = box.top + window.pageYOffset - de.clientTop;
  const left = box.left + window.pageXOffset - de.clientLeft;
  return { top, left };
}

/**
http://stackoverflow.com/questions/118241/calculate-text-width-with-javascript
* Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
* 
* @param {String} text The text to be rendered.
* @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
* 
* @see http://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
*/
export function getTextWidth(text, font) {
  // re-use canvas object for better performance
  var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
  var context = canvas.getContext("2d");
  context.font = font;
  var metrics = context.measureText(text);
  return metrics.width;
};