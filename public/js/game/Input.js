/**
 * This class keeps track of the user input in global variables.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

/**
 * Empty constructor for the Input object.
 */
function Input() {
  throw new Error('Input should not be instantiated!');
}

/** @type {boolean} */
Input.LEFT_CLICK = false;
/** @type {boolean} */
Input.RIGHT_CLICK = false;
/** @type {Object<string, Array<number>>} */
Input.MOUSE = {};

/** @type {boolean} */
Input.LEFT = false;
/** @type {boolean} */
Input.UP = false;
/** @type {boolean} */
Input.RIGHT = false;
/** @type {boolean} */
Input.DOWN = false;
/** @type {Object<number, boolean>} */
Input.MISC_KEYS = {};

/**
 * This method is a callback bound to the onmousedown event on the document
 * and updates the state of the mouse click stored in the Input class.
 * @param {Event} e The event passed to this function.
 */
Input.onMouseDown = function(e) {
  if (e.which == 1) {
    Input.LEFT_CLICK = true;
  } else if (e.which == 3) {
    Input.RIGHT_CLICK = true;
  }
};

/**
 * This method is a callback bound to the onmouseup event on the document and
 * updates the state of the mouse click stored in the Input class.
 * @param {Event} e The event passed to this function.
 */
Input.onMouseUp = function(e) {
  if (e.which == 1) {
    Input.LEFT_CLICK = false;
  } else if (e.which == 3) {
    Input.RIGHT_CLICK = false;
  }
};

/**
 * This method is a callback bound to the onkeydown event on the document and
 * updates the state of the keys stored in the Input class.
 * @param {Event} e The event passed to this function.
 */
Input.onKeyDown = function(e) {
  switch (e.keyCode) {
    case 37:
    case 65:
      Input.LEFT = true;
      break;
    case 38:
    case 87:
      Input.UP = true;
      break;
    case 39:
    case 68:
      Input.RIGHT = true;
      break;
    case 40:
    case 83:
      Input.DOWN = true;
      break;
    default:
      Input.MISC_KEYS[e.keyCode] = true;
      break;
  }
};

/**
 * This method is a callback bound to the onkeyup event on the document and
 * updates the state of the keys stored in the Input class.
 * @param {Event} e The event passed to this function.
 */
Input.onKeyUp = function(e) {
  switch (e.keyCode) {
    case 37:
    case 65:
      Input.LEFT = false;
      break;
    case 38:
    case 87:
      Input.UP = false;
      break;
    case 39:
    case 68:
      Input.RIGHT = false;
      break;
    case 40:
    case 83:
      Input.DOWN = false;
      break;
    default:
      Input.MISC_KEYS[e.keyCode] = false;
  }
};

/**
 * This should be called during initialization to allow the Input
 * class to track user input.
 */
Input.applyEventHandlers = function() {
  document.addEventListener('mousedown', Input.onMouseDown);
  document.addEventListener('mouseup', Input.onMouseUp);
  document.addEventListener('keyup', Input.onKeyUp);
  document.addEventListener('keydown', Input.onKeyDown);
};

/**
 * This should be called any time an element needs to track mouse coordinates
 * over it.
 * @param {Element} element The element to apply the event listener to.
 * @param {string} identifier A unique identifier which the mouse coordinates
 *   will be stored with. This identifier should be a global constant since it
 *   will be used to access the mouse coordinates.
 */
Input.addMouseTracker = function(element, identifier) {
  if (Input.MOUSE[identifier]) {
    throw new Error('Non-unique identifier used!');
  }
  element.addEventListener('mousemove', function(event) {
    var boundingRect = element.getBoundingClientRect();
    Input.MOUSE[identifier] = [event.pageX - boundingRect.left,
                               event.pageY - boundingRect.top];
  });
};
