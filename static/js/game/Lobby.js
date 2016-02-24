/**
 * This class manages the display of the lobby on the client side and handles
 * sending intents to join or leave a room.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

function Lobby(socket, containerElement) {
  this.socket = socket;
  this.containerElement = containerElement;
}

Lobby.create = function(socket, containerElement) {
  return new Lobby(socket, containerElement);
};

Lobby.prototype.init = function() {
  this.socket.on('event', function() {
  });
};

