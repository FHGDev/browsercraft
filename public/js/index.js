/**
 * @fileoverview This is the client side script for index.html.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

$(document).ready(function() {

  $('#login').submit(function(event) {
    $.post('/login', {
      username: $('#login-username').val(),
      password: $('#login-password').val()
    }, function(data) {
      console.log(data);
      location.reload();
    });
    event.preventDefault();
  });

  $('#register').submit(function(event) {
    $.post('/register', {
      username: $('#register-username').val(),
      password: $('#register-password').val(),
      confirmPassword: $('#register-confirm-password').val(),
      email: $('#register-email').val()
    }, function(data) {
      console.log(data);
      location.reload();
    });
    event.preventDefault();
  });
});
