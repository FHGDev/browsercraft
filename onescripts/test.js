var acm = require('../server/AccountManager');
var a = acm.create()

a.registerUser('noob', 'password', function(status) {
  console.log(status);
});

a.isUserAuthenticated('omgimanerd', 'password', function(status) {
  console.log(status);
});
