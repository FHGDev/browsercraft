/**
 * This class stores global constants between the client and server.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

/**
 * Empty constructor for the Constants class.
 */
function Constants() {
  throw new Error('Constants should not be instantiated!');
}

/**
 * The world will always be a square, so there's no need for an x and y max.
 * All values are in pixels.
 */
/** @type {number} */
Constants.WORLD_MIN = 0;
/** @type {number} */
Constants.WORLD_MAX = 2500;
/** @type {number} */
Constants.CANVAS_WIDTH = 800;
/** @type {number} */
Constants.CANVAS_HEIGHT = 600;

/**
 * Constants.VISIBILITY_THRESHOLD_X = (Constants.CANVAS_WIDTH / 2) + 25
 * @type {number}
 */
Constants.VISIBILITY_THRESHOLD_X = 425;
/**
 * Constants.VISIBILITY_THRESHOLD_Y = (Constants.CANVAS_HEIGHT / 2) + 25
 * @type {number}
 */
Constants.VISIBILITY_THRESHOLD_Y = 325;

try {
  /** @nosideeffects */
  module.exports = Constants;
} catch (err) {}
