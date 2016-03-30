/**
 * @fileoverview This is a class on the client side that handles the drawing
 *   and update of the lobby.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

function Lobby(socket, lobbyElement) {
  this.socket = socket;
  this.lobbyElement = lobbyElement;
}

Lobby.createButton = function(class, onclick) {

};

Lobby.create = function(socket, lobbyElement) {



  return new Lobby(socket, lobbyElement);
};
