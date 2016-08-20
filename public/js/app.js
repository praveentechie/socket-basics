var socket = io();
var name = getQueryVariables('name') || 'Anonymous';
var room = getQueryVariables('room');

jQuery('.room-title').text(room);
socket.on('connect', function() {
  console.log('connected to server');
  socket.emit('joinRoom', {
    name: name,
    room: room
  })
});

socket.on('message', function(message) {
  console.log('message', message.text);
  var timestampMoment = moment.utc(message.timestamp);
  var $messages = jQuery('.messages');
  $messages.append(
    '<p><strong>' + message.name + ' ' + timestampMoment.local().format('h:mm a') + '</strong></p>'
  );
  $messages.append(
    '<p class="green"><span>'+ message.text + '</span></p>'
  );
});

// Handles submitting of new message
var $form = jQuery('#message-form');

$form.on('submit', function(event) {
  event.preventDefault();
  var $message = $form.find('input[name="message"]');

  socket.emit('message', {
    name: name,
    text: $message.val()
  });
  // jQuery('.messages').append('<p class="red">' + $message.val() + '</p>');
  $message.val('');
  $message.focus();
});
