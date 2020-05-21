const ora = require('ora');
const spinner = ora('Starting talker.io server').start();
spinner.color = "cyan"

const config = require('./server_settings.js');
const http = require('http').createServer();
const logger = require('./modules/talker_logger')
const io = require('socket.io')(http)
const myip = require('my-ip');
const ip = (myip(null, true));


io.on('connection', (socket) => {
    currentUsers =  userupdate()
    //sends connection data
    socket.emit('connection_info',{
        name: config.server_name,
        description: config.server_description,
        website: config.server_website,
        maxLength: config.server_message_maxLength,
        location: config.server_location,
        userCount: currentUsers
    })
    if(config.Do_not_log == false & config.show_time == false){
        logger.message_nl(`New user connected. Total users ${userupdate()}`, config.new_connection_color);
    }
    else if(config.Do_not_log == false & config.show_time == true){
        logger.message_nl(`${logger.date("yearmonthdatetime")} New user connected. Total users ${userupdate()}`, config.new_connection_color);

    }



    socket.on('message', (evt) => {
        if (config.Do_not_log == true){
            let {cmd, username} = evt;
            var message = cmd.substring(0,config.server_message_maxLength);
            var bigmessage = {message, username}
            socket.broadcast.emit('message', bigmessage);
        }
        else{
            let {cmd, username} = evt;
            var message = cmd.substring(0,config.server_message_maxLength);
            var bigmessage = {message, username}
            logger.message_nl(`${logger.date("ymdhms")} New message by ${username} message: ${cmd} trimied message: ${message}`, config.new_message_color);
            socket.broadcast.emit('message', bigmessage);

        }
        });



    socket.on('disconnect', (data) => {
        if (config.Do_not_log == false & config.show_time == false) {
            logger.message_nl(`A user disconnected. Total users ${userupdate()}`, config.disconnect_color)
            socket.broadcast.emit('userDisconnected', data.username)

        } else if (config.Do_not_log == false & config.show_time == true) {
            logger.message_nl(`${logger.date("ymdhms")} A user disconnected. Total users ${userupdate()}`, config.disconnect_color)
            socket.broadcast.emit('userDisconnected', data.username)
        }
    })

    function userupdate() {
        return Object.keys(io.sockets.connected).length
    }

})


setTimeout(()=>{
    http.listen(config.server_port, () => {
        spinner.stop();
        logger.message_nl(`Server listening on ${ip}:${config.server_port}`, 'green')
    })
},1000)


