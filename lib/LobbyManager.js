/**
 * This class manages the players in the lobby and handles the creation and
 * joining of game rooms.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

var HashMap = require('hashmap');

/**
 * Constructor for a LobbyManager.
 * @constructor
 */
function LobbyManager() {
  /**
   * @type {HashMap}
   */
  this.openPlayers = new HashMap();

  /**
   * Key: Socket ID
   * Value: {
   *   owner: Socket object of owner
   *   members: Hashmap with the socket IDs of the members as keys and
   *            the socket objects of the members as values.
   * }
   */
  this.activeRooms = new HashMap();
}

/**
 * Factory method for a LobbyManager class.
 * @return {LobbyManager}
 */
LobbyManager.create = function() {
};

/** 
 * This method adds a player to the internal hashmaps given a socket ID
 * and Socket ID.
 * @param {string} id The ID of the Socket object.
 * @param {Object} socket The Socket object.
 */
LobbyManager.prototype.addPlayer = function(id, socket) {
  this.openPlayers.set(id, socket);
};

/** 
 * This method removes a player from the the internal hashmaps given the
 * socket ID of the player.
 */
LobbyManager.prototype.removePlayer = function(id) {
  var playerSocket = this.openPlayers.get(id);
  this.openPlayers.remove(id);
  return playerSocket;
};

LobbyManager.prototype.createRoom = function(id) {
  var playerSocket = this.removePlayer(id);
  if (playerSocket) {
    this.activeRooms.set(id, {
      owner: playerSocket,
      members: new HashMap()
    });
  }
};

LobbyManager.prototype.joinRoom = function(joinerId, roomOwnerId) {
  var playerSocket = this.removePlayer(joinerId);
  var room = this.activeRooms.get(roomOwnerId);
  if (room && playerSocket) {
    room.members.push(playerSocket);
  }
};

LobbyManager.prototype.leaveRoom = function(leaverId, roomOwnerId) {
  var room = this.activeRooms.get(roomOwnerId);
  if (room && roomOwnerId != leaverId) {
    room.members.remove(leaverId);
  }
  if (room && roomOwnerId == leaverId) {
    var context = this;
    room.members.keys().forEach(function(value, index, array) {
      this.addPlayer(value, room.members.get(value));
    });
    this.addPlayer(roomOwnerId, room.owner)
    this.activeRooms.remove(roomOwnerId);
  }
};

module.exports = LobbyManager;
