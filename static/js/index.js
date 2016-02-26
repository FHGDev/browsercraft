/**
 * Client side script that initializes index.js.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

$(document).ready(function() {

  Input.applyEventHandlers();

  // When the login form is submitted, send an AJAX request to log the user.
  $('#login').submit(function(event) {
    $.post('/login', {
      username: $('login-username').val(),
      password: $('login-password').val()
    }, function(data) {
    });
    event.preventDefault();
  });

  $('#register').submit(function(event) {
    $.post('/register', {
      username: $('#register-username').val(),
      password: $('#register-password').val(),
      confirmPassword: $('register-confirm-password').val(),
      email: $('#register-email').val()
    }, function(data) {

    });
    event.preventDefault();
  });
});
