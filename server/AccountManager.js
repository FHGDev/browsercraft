/**
 * This is a class that handles the creation, access, and modification of user
 * accounts.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

var assert = require('assert');
var crypto = require('crypto');
var mongodb = require('mongodb');

var Util = require('../shared/Util');

function AccountManager(mongoClient, databaseUrl) {
  this.mongoClient = mongoClient;
  this.databaseUrl = databaseUrl;
}

AccountManager.DATABASE_URL = process.env.DATABASE_URL ||
  'mongodb://localhost:27017/browsercraft';

AccountManager.USERS = 'users';

AccountManager.create = function() {
  return new AccountManager(mongodb.MongoClient,
                            AccountManager.DATABASE_URL);
};

AccountManager.hash = function(string) {
  return crypto.createHash('sha256').update(string).digest('base64');
};

AccountManager.isValidUsername = function(username) {
  return username.length < 24 && !(/[^a-zA-Z0-9]/).test(username);
};

AccountManager.isValidPassword = function(password) {
  return password.length >= 4;
};

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

AccountManager.prototype.registerUser = function(username, password,
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

AccountManager.prototype.isUserAuthenticated = function(username, password,
                                                        callback) {
  this.mongoClient.connect(this.databaseUrl, function(error, database) {
    assert.equal(null, error);
    database.collection(AccountManager.USERS).findOne({
      username: username
    }, function(error, document) {
      assert.equal(null, error);
      // This ensures that if there is no user with the given username, we will
      // return false.
      callback(!!document &&
               document.password == AccountManager.hash(password));
    });
  });
};

AccountManager.prototype.getUserGameStats = function(username, callback) {
  this.mongoClient.connect(this.databaseUrl, function(error, database) {
    assert.equal(null, error);
    database.collection(AccountManager.USERS).findOne({
      username: username
    }, function(error, document) {
      assert.equal(null, error);
      if (document) {
        callback(document.gameStats);
      } else {
        callback(null);
      }
    });
  });
};

module.exports = AccountManager;
