/**
 * This class manages sessions and session keys for users.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

var HashMap = require('hashmap');

var Util = require('../shared/Util');

function SessionManager() {
  /**
   * This JSON object stores the sessions and their expiration time.
   */
  this.sessions = new HashMap();
};

SessionManager.TIMEOUT = 60000;

SessionManager.TOKEN_LENGTH = 64;

SessionManager.create = function() {
  return new SessionManager();
};

/**
 * Adds a session for the current user and returns their session token.
 * @param {string} username The username of the user to assign a session token
 *   to.
 * @return {string} The token of the user.
 */
SessionManager.prototype.assignSessionToken = function(username) {
  var token = Util.generateUID(SessionManager.TOKEN_LENGTH);
  var expires = new Date(Date.now() + SessionManager.TIMEOUT);
  // If by some chance, this token was generated before, then regenerate
  // the token.
  while (this.sessions.get(token)) {
    token = Util.generateUID(SessionManager.TOKEN_LENGTH);
  }
  this.sessions.set(token, {
      username: username,
      expires: expires
  });
  this.clearExpiredSessions();
  return token;
};

/**
 * Returns the user associated with the given session key.
 * @param {string} token The session token to look up.
 */
SessionManager.prototype.lookupSession = function(token) {
  if (!this.sessions.get(token)) {
    return null;
  } else if ((new Date()).getTime() >
             this.sessions.get(token).expires.getTime()) {
    this.sessions.remove(token);
    return null;
  }
  this.clearExpiredSessions();
  return this.sessions.get(token).username;
};

/**
 * Refreshes the token timeout for the given token.
 * @param {string} token The session token to refresh.
 */
SessionManager.prototype.refreshSessionTimeout = function(token) {
  var user = this.sessions.get(token);
  if (user) {
    this.sessions.set(token, {
      username: user.username,
      expires: new Date(Date.now() + SessionManager.TIMEOUT)
    });
  }
};

/**
 * Removes the given session token from the cached tokens.
 * @param {string} token The session token to remove.
 */
SessionManager.prototype.removeSessionToken = function(token) {
  this.sessions.remove(token);
};

/**
 * This method runs through the active sessions and removes any that have
 * expired.
 */
SessionManager.prototype.clearExpiredSessions = function() {
  var tokens = this.sessions.keys()
  var currentTime = (new Date()).getTime();
  for (var i = 0; i < tokens.length; ++i) {
    if (currentTime > this.sessions.get(tokens[i]).expires.getTime()) {
      this.sessions.remove(tokens[i]);
    }
  }
};

module.exports = SessionManager;
