/**
 * @fileoverview This is the client side script for game.html.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

$(document).ready(function() {
  Input.applyEventHandlers();
  Input.addMouseTracker(document.getElementById('game-canvas'), 'canvas');
});
