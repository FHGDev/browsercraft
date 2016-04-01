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
 * @param {Object} io The Socket.IO server object.
 */
function LobbyManager(io) {
  this.io = io;

  /**
   * This is an Object storing all players connected to the server.
   * @type {Object}
   */
  this.players = {};

  /**
   * This is an Object storing all rooms in the lobby.
   * @type {Object}
   */
  this.rooms = {};
}

/**
 * Factory method for a LobbyManager class.
 * @param {Object} io The Socket.IO server object.
 * @return {LobbyManager}
 */
LobbyManager.create = function(io) {
  return new LobbyManager(io);
};

/**
 * This method is used to ouput the state of the lobby for debugging purposes.
 */
LobbyManager.prototype.printDebug = function() {
  console.log(this.players);
  console.log(this.rooms);
};

/**
 * This method adds a player to the internal hashmaps given their username
 * and socket ID.
 * @param {string} id The ID of their Socket object
 * @param {string} username The player's username
 * @return {Object}
 */
LobbyManager.prototype.addPlayer = function(id, username) {
  for (var key in this.players) {
    if (this.players[key] == username) {
      return {
        success: false,
        message: 'You are already logged in!'
      };
    }
  }
  this.players[id] = {
    username: username,
    status: Constants.STATUS_IN_LOBBY
  };
  return {
    success: true,
    username: username
  };
};

/**
 * This method removes a player from the the internal hashmaps given the
 * socket ID of the player.
 * @param {string} id The socket ID of the player to remove.
 */
LobbyManager.prototype.removePlayer = function(id) {
  if (this.players[id]) {
    delete this.players[id];
  }
  for (var key in this.rooms) {
    if (this.rooms[key][id]) {
      delete this.rooms[key][id];
    }
  }
};

/**
 * This method attempts to create a room with the given name.
 * @param {string} roomName The name of the room to create
 * @return {Object}
 */
LobbyManager.prototype.createRoom = function(roomName) {
  if (this.rooms[roomName]) {
    return {
      success: false,
      message: 'A room named ' + roomName + ' already exists!'
    };
  }
  this.rooms[roomName] = {};
  return {
    success: true
  };
};

/**
 * This method adds a given player into a given room.
 * @param {string} roomName The name of the room to join.
 * @param {string} joinerId The socket ID of the player who is joining the room.
 * @param {boolean} isOwner Whether or not the joiner is the owner of the room.
 * @return {Object}
 */
LobbyManager.prototype.joinRoom = function(roomName, joinerId, isOwner) {
  isOwner = !!isOwner;
  if (this.players[joinerId]) {
    if (this.rooms[roomName]) {
      var player = this.players[joinerId];
      this.rooms[roomName][joinerId] = {
        username: player.username,
        ready: false,
        isOwner: isOwner
      };
      return {
        success: true
      };
    }
    return {
      success: false,
      message: 'Room does not exist!'
    };
  }
  return {
    success: false,
    message: 'You do not exist!'
  };
};

/**
 * This method removes a player from a given room.
 * @param {string} roomName The name of the room to leave.
 * @param {string} leaverId The socket ID of the player leaving the room.
 * @return {Object}
 */
LobbyManager.prototype.leaveRoom = function(roomName, leaverId) {
  if (this.players[leaverId]) {
    if (this.rooms[roomName]) {
      delete this.rooms[roomName][leaverId];
      if (Object.keys(this.rooms[roomName]).length == 0) {
        delete this.rooms[roomName];
      }
      return {
        success: true
      };
    }
    return {
      success: false,
      message: 'Room does not exist!'
    };
  }
  return {
    success: false,
    message: 'You do not exist!'
  };
};

/**
 * This method sets the ready status of a player in a room.
 * @param {string} roomName The name of the room that the player is in.
 * @param {string} memberId The socket ID of the player to set the status of.
 * @param {boolean} status The ready status of the player.
 * @return {Object}
 */
LobbyManager.prototype.setReadyStatus = function(roomName, memberId, status) {
  if (this.players[memberId]) {
    if (this.rooms[roomName]) {
      if (this.rooms[roomName][memberId]) {
        this.rooms[roomName][memberId].ready = status;
        return {
          success: true
        };
      }
      return {
        success: false,
        message: 'You are not in a room!'
      };
    }
    return {
      success: false,
      message: 'Room does not exist!'
    };
  }
  return {
    success: false,
    message: 'You do not exist!'
  };
};

/**
 * This method sends the state of the lobby to all connected players.
 */
LobbyManager.prototype.sendState = function() {
  this.io.sockets.emit('lobby-state', {
    players: this.players,
    rooms: this.rooms
  });
};

/**
 * This line is needed on the server side since this is loaded as a module
 * into the node server.
 */
module.exports = LobbyManager;
