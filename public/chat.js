window.onload = function () {
    var messages = [],
        socket = io.connect('http://localhost:3700'),
        field = document.getElementById('field'),
        sendBtn = document.getElementById('send'),
        content = document.getElementById('content'),
        name = document.getElementById('name');

    socket.on('message', function (data) {
        if (data.message) {
            messages.push(data);
            var html = '';
            for(var i=0; i<messages.length; i++) {
                html += '<b>' + (messages[i].username ? messages[i].username : 'Server') + ': </b>';
                html += messages[i].message + '<br />';
            }
            content.innerHTML = html;
            content.scrollTop = content.scrollHeight;
        } else {
            console.log("PROBLEM: ", data);
        }

    });

    function send() {
        if (name.value == "") {
            alert("Please type your name!");
        } else {
            var text = field.value;
            socket.emit('send', {message: text, username: name.value});
            field.value = "";
        }
    };
    sendBtn.onclick = send;
    document.onkeyup = function (e) {
        if (!e) {
            e = window.event;
        }
        if ((e.keyCode || e.which) === 13) {
            send();
        }
    }
}