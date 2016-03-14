/**
 * @fileoverview This is a class that handles the creation, access,
 * and modification of user accounts.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

// Dependencies
var assert = require('assert');
var crypto = require('crypto');
var mongodb = require('mongodb');

var Util = require('../shared/Util');

/**
 * Constructor for an AccountManager.
 * @param {Object} mongoClient An instance of a MongoClient.
 * @param {string} databaseUrl The URL of the database to access.
 * @constructor
 */
function AccountManager(mongoClient, databaseUrl) {
  this.mongoClient = mongoClient;
  this.databaseUrl = databaseUrl;
}

/**
 * This is the URL of database to access.
 * @type {string}
 */
AccountManager.DATABASE_URL = process.env.DATABASE_URL ||
    'mongodb://localhost:27017/browsercraft';

/**
 * This is the name of the table storing the users.
 * @type {string}
 */
AccountManager.USERS = 'users';

/**
 * This is a factory method for the AccountManager class.
 * @return {AccountManager}
 */
AccountManager.create = function() {
  return new AccountManager(mongodb.MongoClient,
                            AccountManager.DATABASE_URL);
};

/**
 * This returns the SHA256 hash of the given string.
 * @param {string} string The string to hash.
 * @return {string}
 */
AccountManager.hash = function(string) {
  return crypto.createHash('sha256').update(string).digest('base64');
};

/**
 * This method checks the validity of a given username.
 * @param {string} username The username to check
 * @return {boolean}
 */
AccountManager.isValidUsername = function(username) {
  return username.length < 24 && !(/[^a-zA-Z0-9]/).test(username);
};

/**
 * This method checks the validity of a password.
 * @param {string} password The password to check.
 * @return {boolean}
 */
AccountManager.isValidPassword = function(password) {
  return password.length >= 4;
};

/**
 * This method initializes an AccountManager and tries to establish
 * a connection to the MongoDB database.
 */
AccountManager.prototype.init = function() {
  this.mongoClient.connect(this.databaseUrl, function(error, database) {
    assert.equal(null, error);
    console.log('CONNECTED CORRECTLY TO MONGODB SERVER');
    database.collection(AccountManager.USERS).createIndex({
      username: 1
    }, {
      unique: true
    });
    database.close();
  });
};

/**
 * This method registers a user and stores them into the MongoDB database.
 * @param {string} username The username of the user.
 * @param {string} password The password of the user, which will be hashed
 *   before being stored.
 * @param {string} email The email of the user.
 * @param {function()} callback The callback function which will be called
 *   with the error status for registering the user, if any.
 */
AccountManager.prototype.registerUser = function(username, password, email,
                                                 callback) {
  this.mongoClient.connect(this.databaseUrl, function(error, database) {
    assert.equal(null, error);
    database.collection(AccountManager.USERS).insert({
      username: username,
      password: AccountManager.hash(password)
    }, function(error, result) {
      if (error) {
        callback(false);
        return;
      }
      callback(true);
    });
  });
};

/**
 * This method checks a given user against the database and verifies if
 * the given password matches their password.
 * @param {string} username The username of the user to check.
 * @param {string} password The password of the user to check.
 * @param {function()} callback The callback function which will be called
 *   with the authentication status of the user or an error if there was one.
 */
AccountManager.prototype.isUserAuthenticated = function(username, password,
                                                        callback) {
  this.mongoClient.connect(this.databaseUrl, function(error, database) {
    assert.equal(null, error);
    database.collection(AccountManager.USERS).findOne({
      username: username
    }, function(error, document) {
      if (error || !document) {
        callback(false);
        return;
      }
      callback(document.password == AccountManager.hash(password));
    });
  });
};

/**
 * This method looks up a user in the MongoDB database and fetches all game
 * stats pertinent to them.
 * @param {string} username The username of the user to look up.
 * @param {function()} callback The callback function which will be called
 *   with the stats of the user or an error if there was one.
 */
AccountManager.prototype.getUserGameStats = function(username, callback) {
  this.mongoClient.connect(this.databaseUrl, function(error, database) {
    assert.equal(null, error);
    database.collection(AccountManager.USERS).findOne({
      username: username
    }, function(error, document) {
      if (error || !document) {
        callback(null);
        return;
      }
      callback(document.gameStats);
    });
  });
};

/**
 * This line is needed on the server side since this is loaded as a module
 * into the node server.
 */
module.exports = AccountManager;
