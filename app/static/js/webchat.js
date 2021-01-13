$(document).ready(function () {
    const clipboard = new Clipboard('.copy-text');

    clipboard.on('success', function(e) {
        const trigger = e.trigger;

        trigger.innerText = 'Copied!';

        setTimeout(function() {
            trigger.innerText = 'Copy';
        }, 1000);
    
        e.clearSelection();
    });

    function sendMessage() {
        var name = $('#myName').val();
        var message = $('#myMessage').val();

        socket.send({ name, message });

        $('#myMessage').val('');
        $('#myMessage').focus();
    }

    var socket = io.connect();
    socket.on('connect', function () {
        socket.emit('connected');
        $('#myMessage').val('');
    });

    socket.on('message', function (msg) {
        var name = msg.json_data.name;
        var message = msg.json_data.content;
        var date = msg.json_data.date;
        var id = msg.json_data.id;

        if (name == '') {
            name = 'Anonymous';
        }
        if (message == '') {
            message = 'I forgot to add a message.';
        }

        $("#messagesContainer").prepend(
            "<div class=\"card mb-2\">\n" +
            "<div class=\"card-header\">\n" +
            "<h5 class=\"card-title\">" + name + "</h5><h6 class=\"card-subtitle mb-2 text-muted\">" + date + "</h6>" + "<a class=\"copy-text mb-2 text-muted\" data-clipboard-target=\"#content_"+id+"\">Copy</a>" + "\n" +
            "</div>\n" +
            "<div class=\"card-body\" id=\"content_"+id+"\">\n" +
            "" + message + "\n" +
            "</div>\n" +
            "</div>"
        );

        console.log('Received message');
    });

    $('#sendButton').on('click', function () {
        sendMessage();
    });

    $('#myMessage').keydown(function (e) {
        if ((e.keyCode == 10 || e.keyCode == 13) && (e.ctrlKey || e.metaKey)) {
            sendMessage();
        }
    });

    socket.on('page_view_increase', function (count) {
        console.log('ping');
        var total_count = count.page_views;
        console.log(total_count + ' views');
        $("#pageViews").text(total_count);
    })
});