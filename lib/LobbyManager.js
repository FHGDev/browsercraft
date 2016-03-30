/**
 * @fileoverview This class manages the players in the lobby and handles the
 *   creation and joining of game rooms. For the purposes of nomenclature,
 *   a room's name and ID are the same and using the terms are
 *   interchangeable when referring to it.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

var HashMap = require('hashmap');

var Constants = require('../shared/Constants');

/**
 * Constructor for a LobbyManager.
 * @constructor
 */
function LobbyManager(io) {
  this.io = io;

  /**
   * This is a HashMap storing all players connected to the server.
   * @type {HashMap}
   */
  this.players = new HashMap();

  /**
   * This is a HashMap storing all rooms in the lobby.
   * @type {HashMap}
   */
  this.rooms = new HashMap();
}

/**
 * Factory method for a LobbyManager class.
 * @param {Object} io The Socket.IO server
 * @return {LobbyManager}
 */
LobbyManager.create = function(io) {
  return new LobbyManager(io);
};

/**
 * This method is used to ouput the state of the lobby for debugging purposes.
 */
LobbyManager.prototype.printDebug = function() {
  console.log("PLAYERS");
  console.log(this.players.keys(), this.players.values());
  console.log("ROOMS");
  console.log(this.rooms.keys());
  this.rooms.forEach(function(value, key) {
    console.log(value.keys(), value.values());
  });
};

/**
 * This method adds a player to the internal hashmaps given their username
 * and socket ID.
 * @param {string} username The player's username
 * @param {string} id The ID of their Socket object
 */
LobbyManager.prototype.addNewPlayer = function(id, username) {
  this.players.forEach(function(value, key) {
    if (value.username == username) {
      return {
        success: false,
        message: "You are already logged in!"
      }
    }
  });
  this.players.set(id, {
    username: username,
    status: Constants.STATUS_IN_LOBBY
  });
  return {
    success: true
  }
};

/**
 * This method removes a player from the the internal hashmaps given the
 * socket ID of the player.
 * @param {string} id The socket ID of the player to remove
 * @return {Object}
 */
LobbyManager.prototype.removePlayer = function(id) {
  this.players.remove(id);
  this.rooms.forEach(function(value, key) {
    value.remove(id);
  })
};

/**
 * This method attempts to create a room with the given name.
 * @param {string} roomName The name of the room to create
 * @return {Object}
 */
LobbyManager.prototype.createRoom = function(roomName) {
  if (this.rooms.has(roomName)) {
    return {
      success: false,
      message: "A room named " + roomName + "already exists!"
    }
  }
  this.rooms.set(roomName, new HashMap());
  return {
    success: true
  }
};

/**
 * This method adds a given player into a given room.
 * @param {string} joinerId The socket ID of the player who is joining the room
 * @param {string} roomName The name of the room to join
 * @param {boolean} isOwner Whether or not the joiner is the owner of the room
 */
LobbyManager.prototype.joinRoom = function(roomName, joinerId, isOwner) {
  isOwner = !!isOwner;
  if (this.players.has(joinerId)) {
    if (this.rooms.has(roomName)) {
      var player = this.players.get(joinerId);
      this.rooms.get(roomName).set(joinerId, {
        username: player.username,
        ready: false,
        isOwner: isOwner
      });
      return {
        success: true
      }
    }
    return {
      success: false,
      message: "Room does not exist!"
    }
  }
  return {
    success: false,
    message: "You do not exist!"
  }
};

/**
 * This method removes a player from a given room.
 * @param {string} roomName The name of the room to leave.
 * @param {string} leaverId The socket ID of the player leaving the room.
 */
LobbyManager.prototype.leaveRoom = function(roomName, leaverId) {
  if (this.players.has(leaverId)) {
    if (this.rooms.has(roomName)) {
      var room = this.rooms.get(roomName);
      room.remove(leaverId);
      if (room.values().length == 0) {
        this.rooms.remove(roomName);
      }
    }
    return {
      success: false,
      message: "Room does not exist!"
    }
  }
  return {
    success: false,
    message: "You do not exist!"
  }
};

/**
 * This line is needed on the server side since this is loaded as a module
 * into the node server.
 */
module.exports = LobbyManager;
