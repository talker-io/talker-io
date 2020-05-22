const ora = require('ora');
const spinner = ora('Starting talker.io server').start();
spinner.color = "cyan"

const server_config = require('./server_settings.js');
const other_config = require('./othersettings')

const http = require('http').createServer(handler);

const logger = require('./modules/talker_logger')
const io = require('socket.io')(http)
const myip = require('my-ip');
const ip = (myip(null, true));

const name = server_config.server_name
const description = server_config.server_description
const website = server_config.server_website
const maxLength = server_config.server_message_maxLength
const location = server_config.server_location
let language = server_config.server_language

if(typeof(language) === undefined || language === ""){
    language = 'en'
}

const JSONconfig = JSON.stringify(server_config)

function userupdate() {
    return Object.keys(io.sockets.connected).length
}


function handler (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(`<table style="undefined;table-layout: fixed; width: 548px"><colgroup><col style="width: 238px"><col style="width: 310px"></colgroup><col style="width: 238px"><col style="width: 50px"></colgroup><thead></thead><tbody><tr><td>Server name</td><td>${name}</td></th></tr>
    <tr><td>Description</td><td>${description}</td></tr><tr><td>Website</td><td>${website}</td></tr><tr><td>max message length</td><td>${maxLength}</td></tr><tr><td>location</td><td>${location}</td></tr><tr><td>online users</td><td>${userupdate()}</td></tr><tr><td>Language</td><td>${language}</td></tr><tr><td>Raw data</td><td>${JSONconfig}</td></tr></tbody></table>`

    )
}

io.on('connection', (socket) => {
    currentUsers =  userupdate()

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
        logger.message_nl(`New user connected. Total users ${userupdate()}`, other_config.new_connection_color);
    }
    else if(other_config.Do_not_log === false && other_config.show_time === true){
        logger.message_nl(`${logger.date("yearmonthdatetime")} New user connected. Total users ${userupdate()}`, other_config.new_connection_color);
    }



    socket.on('message', (evt) => {
        if (other_config.Do_not_log === true){
            let {cmd, username} = evt;
            var message = cmd.substring(0,server_config.server_message_maxLength);
            var bigmessage = {message, username}
            socket.broadcast.emit('message', bigmessage);
        }
        else{
            let {cmd, username} = evt;
            var message = cmd.substring(0,server_config.server_message_maxLength);
            var bigmessage = {message, username}
            logger.message_nl(`${logger.date("ymdhms")} New message by ${username} message: ${cmd} trimied message: ${message}`, other_config.new_message_color);
            socket.broadcast.emit('message', bigmessage);

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
    http.listen(server_config.server_port, () => {
        spinner.stop();
        logger.message_nl(`Server listening on ${ip}:${server_config.server_port}`, 'green')
    })

},1000)


