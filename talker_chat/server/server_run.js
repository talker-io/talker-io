// loading spinner
const ora = require('ora');
const spinner = ora('Starting talker.io server').start();
spinner.color = "cyan"

// logger module
const logger = require('./modules/talker_logger')

// ip
const myip = require('my-ip');
const ip = (myip(null, true));

// config files
const server_config = require('./server_settings.js');
const other_config = require('./othersettings')

// config
const name = server_config.server_name
const description = server_config.server_description
const website = server_config.server_website
const maxLength = server_config.server_message_maxLength
const location = server_config.server_location
let language = server_config.server_language
let lastConnection = 0

// http server
const http = require('http').createServer(handler);
const io = require('socket.io')(http)


const JSONconfig = JSON.stringify(server_config)

function userupdate() {
    return Object.keys(io.sockets.connected).length
}


function handler (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(`
<head>
<title>${server_config.server_name} Analytics</title>
<meta http-equiv="refresh" content="8">
</head>
<table style="undefined;table-layout: fixed; width: 548px">
<colgroup>
<col style="width: 238px">
<col style="width: 310px">
</colgroup>
<col style="width: 238px">
<col style="width: 50px">
</colgroup>
<thead>

</thead>
<tbody>
<tr>
<td>Server name</td>
<td>${name}</td>
</th></tr>
<tr>
<td>Description</td><td>${description}</td>
</tr><tr>
<td>Website</td><td>${website}</td>
</tr><tr>
<td>max message length</td><td>${maxLength}</td>
</tr><tr>
<td>location</td><td>${location}</td>
</tr><tr>
<td>Language</td><td>${language}</td
</tr><tr>
<td>Last new connection</td><td>${lastConnection}</td>
</tr><tr>
<td>online users</td><td>${userupdate()}</td>
</tr><tr>
<td>Raw data</td><td>${JSONconfig}</td>
</tr>
</tbody></table>`)}










let currentUsers =  userupdate()

function newUserAnalytic(){
        lastConnection = logger.date("YMDHMS")
}




io.on('connection', (socket) => {

    newUserAnalytic()
    //broadcasts that a new user has joined
    socket.broadcast.emit('newUser', {currentUsers: currentUsers});

    //sends connection data
    socket.emit('connection_info',{
        name: name,
        description: description,
        website: website,
        maxLength: maxLength,
        location: location,
        language: language,
        userCount: currentUsers

    })


    if(other_config.Do_not_log === false && other_config.show_time === false){
        logger.message_nl(`New user connected. Total users ${userupdate()}`, other_config.new_connection_color, true);
    }
    else if(other_config.Do_not_log === false && other_config.show_time === true){
        logger.message_nl(`${logger.date("YMDHMS")} New user connected. Total users ${userupdate()}`, other_config.new_connection_color, true);
    }



    socket.on('message', (evt) => {

        let {cmd, username} = evt;

        let message
        let fullMessage;

        // runs when do not log is enabled
        if (other_config.Do_not_log === true){
            message = cmd.substring(0,server_config.server_message_maxLength);
            fullMessage = {message, username}
            socket.broadcast.emit('message', fullMessage);
        }

        // runs when do not log is disabled
        else{

            // trim the message according to config
            message = cmd.substring(0,server_config.server_message_maxLength);

            // combines the timed message and the username
            fullMessage = {message, username}

            // logs the message in the server
            logger.message_nl(`${logger.date("ymdhms")} New message by ${username} message: ${cmd} trimmed message: ${message}`, other_config.new_message_color);

            // broadcasts the message
            socket.broadcast.emit('message', fullMessage);

        }
    });



    socket.on('disconnect', (data) => {
        currentUsers = userupdate()
        if (other_config.Do_not_log === false && other_config.show_time === false) {
            logger.message_nl(`A user disconnected. Total users ${userupdate()}`, other_config.disconnect_color)
            socket.broadcast.emit('userDisconnected', {currentUsers: currentUsers})

        } else if (other_config.Do_not_log === false && other_config.show_time === true) {
            logger.message_nl(`${logger.date("ymdhms")} A user disconnected. Total users ${userupdate()}`, other_config.disconnect_color)
            socket.broadcast.emit('userDisconnected', {currentUsers: currentUsers})
        }
    })


})





setTimeout(()=>{
    // runs if the language in config is empty
    if(typeof(language) === undefined || language === ""){
        language = 'en'
    }

    // start the http server
    http.listen(server_config.server_port, () => {
        spinner.stop();
        logger.message_nl(`Server listening on ${ip}:${server_config.server_port}\nGo to http://${ip}:${server_config.server_port} for live analytics`, 'green')
    })

},1000)
