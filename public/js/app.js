var socket = io();

socket.on('connect', function() {
  console.log('connected to server');
});

socket.on('message', function(message) {
  console.log('message', message.text);
});

// Handles submitting of new message
var $form = jQuery('#message-form');

$form.on('submit', function(event) {
  event.preventDefault();
  var $message = $form.find('input[name="message"]');

  socket.emit('message', {
    text: $message.val()
  });
  $message.val('');
  $message.focus();
});
