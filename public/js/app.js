var socket = io();

socket.on('connect', function() {
  console.log('connected to server');
});

socket.on('message', function(message) {
  console.log('message', message.text);

  jQuery('.messages').append('<p class="green">' + message.text + '</p>');
});

// Handles submitting of new message
var $form = jQuery('#message-form');

$form.on('submit', function(event) {
  event.preventDefault();
  var $message = $form.find('input[name="message"]');

  socket.emit('message', {
    text: $message.val()
  });
  // jQuery('.messages').append('<p class="red">' + $message.val() + '</p>');
  $message.val('');
  $message.focus();
});
