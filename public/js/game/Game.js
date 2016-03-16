/**
 * @fileoverview This is a class encapsulating the client side of the game,
 *   which handles the rendering of the lobby and game and the sending of
 *   user input to the server.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */
/**
 * Creates a Game on the client side to render the players and entities as
 * well as the player UI.
 * @constructor
 * @param {Object} socket The socket connected to the server.
 * @param {Input} inputHandler The Input object that will track user input.
 * @param {Drawing} drawing The Drawing object that will render the game.
 * @param {ViewPort} viewPort The ViewPort object that will manage the player's
 *   current view.
 */
function Game(socket, inputHandler, drawing, viewPort) {
  this.socket = socket;

  this.inputHandler = inputHandler;
  this.drawing = drawing;
  this.viewPort = viewPort;

  this.selfPlayer = null;
  this.otherPlayers = [];
}

/**
 * Factory method to create a Game object.
 * @param {Element} lobbyElement The element that the game lobby will be
 *   rendered in.
 * @param {Element} canvasElement The canvas element that the game will use to
 *   draw to.
 * @return {Game}
 */
Game.create = function(lobbyElement, canvasElement) {
  canvasElement.width = Constants.CANVAS_WIDTH;
  canvasElement.height = Constants.CANVAS_HEIGHT;
  var canvasContext = canvasElement.getContext('2d');

  var inputHandler = Input.create(canvasElement);
  var drawing = Drawing.create(canvasContext);
  var viewPort = new ViewPort();
  return new Game(socket, inputHandler, drawing, viewPort);
};

/**
 * Initializes the Game object and its child objects as well as setting the
 * event handlers.
 */
Game.prototype.init = function() {
  this.socket.on('update', bind(this, function(data) {
    this.receiveGameState(data);
  }));
};

/**
 * Updates the game's internal storage of all the powerups, called each time
 * the server sends packets.
 * @param {Object} state The game state received from the server.
 */
Game.prototype.receiveGameState = function(state) {
  this.self = state['self'];
  this.players = state['players'];
};

/**
 * Updates the state of the game client side and relays intents to the
 * server.
 */
Game.prototype.update = function() {
  if (this.self) {
    this.viewPort.update(this.self.x, this.self.y);

    // Emits an event for the containing the player's intention to move
    // or shoot to the server.
    var packet = {
      keyboardState: {
      }
    };
    this.socket.emit('player-action', packet);
  }
};

/**
 * Draws the state of the game onto the HTML5 canvas.
 */
Game.prototype.draw = function() {
  // Clear the canvas.
  this.drawing.clear();

};
