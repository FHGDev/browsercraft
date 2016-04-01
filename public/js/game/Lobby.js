/**
 * @fileoverview This is a class on the client side that handles the drawing
 *   and update of the lobby.
 * DEPENDS ON JQUERY
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */


/**
 * Constructor for a Lobby class.
 * @constructor
 * @param {Object} socket
 * @param {Element} lobbyElement
 */
function Lobby(socket, lobbyElement, playersContainerElement,
               roomsContainerElement) {
  this.socket = socket;
  this.lobbyElement = lobbyElement;
  this.playersContainerElement = playersContainerElement;
  this.roomsContainerElement = roomsContainerElement;

  this.username = null;
}

Lobby.create = function(socket) {
  var lobbyElement = $('#game-lobby-container');
  var playersContainerElement = $('#players-container');
  var roomsContainerElement = $('#rooms-container');
  lobby = new Lobby(socket, lobbyElement, playersContainerElement,
      roomsContainerElement);
  lobby.init();
  return lobby;
};

/**
 *
 */
Lobby.prototype.init = function() {
  this.socket.emit('new-player', {}, bind(this, function(data) {
    if (!data['success']) {
      window.alert(data.message);
      window.location = '/';
      return;
    }
    this.username = data['username'];
  }));

  this.socket.on('lobby-state', bind(this, this.update));
};

/**
 *
 */
Lobby.prototype.update = function(data) {
  if (this.username) {
    var players = data['players'];
    var playerIds = Object.keys(players);
    var difference = playerKeys.length -
        this.playersContainerElement.children().length;
    while (difference != 0) {
      if (difference > 0) {
        this.playersContainerElement.append($('<div></div>'));
        difference--;
      } else {
        this.playersContainerElement.children().first().remove();
        difference++;
      }
    }

    this.playersContainerElement.find('div').each(function(index) {
      $(this).text(players[playerIds[index]]['username']);
    });
  }

};
