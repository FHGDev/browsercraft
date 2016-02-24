/**
 * Client side script that initializes index.js.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

$(document).ready(function() {

  // When the login form is submitted, send an AJAX request to log the user.
  $("#login").submit(function(event) {
    $.post("/login", {
      username: $("login-username").val(),
      password: $("login-password").val()
    }, function(data) {
    });
  });

  $("#register").submit(function(event) {
    $.post("/register", {
      username: $("#register-username").val(),
      password: $("#register-password").val(),
      confirmPassword: $("register-confirm-password").val(),
      email: $("#register-email").val()
    }, function(data) {

    });
    event.preventDefault();
  });
});
