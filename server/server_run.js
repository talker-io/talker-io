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
    //sends connection data
    socket.emit('connection_info',{
        name: config.room_name,
        description: config.room_description,
        website: config.room_website,
        maxLength: config.room_message_maxLength
    })
    if(config.Do_not_log == false & config.show_time == false){
        logger.message_nl(`New user connected as ${socket.ip}`, config.new_connection_color);
    }
    else if(config.Do_not_log == false & config.show_time == true){
        logger.message_nl(`${logger.date("yearmonthdatetime")} New user connected Total users ${userupdate()}`, config.new_connection_color);

    }



    socket.on('message', (evt) => {
        if (config.Do_not_log == true){
            let {cmd, username} = evt;
            var message = cmd.substring(0,config.room_message_maxLength);
            var bigmessage = {message, username}
            socket.broadcast.emit('message', bigmessage);
        }
        else{
            let {cmd, username} = evt;
            var message = cmd.substring(0,config.room_message_maxLength);
            var bigmessage = {message, username}
            logger.message_nl(`${logger.date("ymdhms")} New message by ${username} message: ${cmd} trimied message: ${message}`, config.new_message_color);
            socket.broadcast.emit('message', bigmessage);

        }
        });



    socket.on('disconnect', () => {
        if (config.Do_not_log == false & config.show_time == false) {
            logger.message_nl('A user disconnected', config.disconnect_color)
        } else if (config.Do_not_log == false & config.show_time == true) {
            logger.message_nl(`${logger.date("ymdhms")} A user disconnected`, config.disconnect_color)
        }
    })

    function userupdate() {
        return Object.keys(io.sockets.connected).length
    }

})


setTimeout(()=>{
    http.listen(config.room_port, () => {
        spinner.stop();
        logger.message_nl(`Server listening on ${ip}:${config.room_port}`, 'green')
    })
},1000)


