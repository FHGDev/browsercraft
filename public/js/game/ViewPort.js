/**
 * Manages the player viewport when they move around.
 * @author kennethli.3470@gmail.com (Kenneth Li)
 */

/**
 * This class manages the viewport of the client. It is mostly
 * an abstract class that handles the math of converting absolute
 * coordinates to appropriate canvas coordinates.
 * @constructor
 */
function ViewPort() {
  this.selfCoords = [];
}

/**
 * This is the factory method for creating a ViewPort.
 * @return {ViewPort}
 */
ViewPort.create = function() {
  return new ViewPort();
};

/**
 * This method updates the ViewPort with the new absolute world coordinates
 * of its center.
 * @param {number} x The new x coordinate of the center of the ViewPort.
 * @param {number} y The new y coordinate of the center of the ViewPort.
 */
ViewPort.prototype.update = function(x, y) {
  this.selfCoords = [x, y];
};

/**
 * Given an object, returns an array containing the object's converted
 * coordinates. The object must be a valid data structure sent by the
 * server with an x and y value.
 * @param {Array<number>} coords The object whose converted coords should be
 *   returned.
 * @return {Array<number>}
 */
ViewPort.prototype.toCanvasCoords = function(coords) {
  var translateX = this.selfCoords[0] - Constants.CANVAS_WIDTH / 2;
  var translateY = this.selfCoords[1] - Constants.CANVAS_HEIGHT / 2;
  return [coords[0] - translateX,
          coords[1] - translateY];
};

/**
 *
 * @param {Array<number>} coords The coords to convert
 * @return {Array<number>}
 */
ViewPort.prototype.toAbsoluteCoords = function(coords) {
  var translateX = this.selfCoords[0] - Constants.CANVAS_WIDTH / 2;
  var translateY = this.selfCoords[1] - Constants.CANVAS_HEIGHT / 2;
  return [coords[0] + translateX,
          coords[1] + translateY];
};
