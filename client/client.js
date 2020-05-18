const config = require('./config')
const ora = require('ora');
var spinner = ora("Loading client").start();
spinner.color = "cyan";

setTimeout(()=>{
    spinner.text = "connecting to server"
    const socket = require('socket.io-client')(config.roomip);
    main(socket)
},1000)



const repl = require('repl');
const logger = require('./modules/talker_logger');
let username = null
let info_enabled = null


function main(socket) {

    spinner.stop()
    socket.on('disconnect', function () {
        socket.emit('disconnect')
    });


    //connect
    socket.on('connect', () => {
        username = process.argv[2]
        info_enabled = process.argv[3]
    });


    //connection information
    socket.on('connection_info',(data) =>{
        let room_name = data.name;
        let room_description = data.description;
        let room_maxLength = data.maxLength;
        let room_website = data.website;

        logger.message_nl(`\n=== Welcome to ${room_name} ===\n  ${room_description}\nType your message and press Enter to send\n`, 'yellow');
        if (room_website == ""){}
        else {logger.message_nl(`Website: ${room_website}\n`, 'yellow')}

        if (info_enabled == "true"){
            logger.message_nl(`${room_name} info\n room name: ${room_name}\n room description: ${room_description}\n room max message size: ${room_maxLength}\n room website: ${room_website}\n`, 'bold')
        }
    });




    //message
    socket.on('message', (data) => {
        const {message, username} = data
        logger.message(username + ': ' + message.split('\n')[0] + "\n", 'green');
    });

    //message send
    repl.start({

        prompt: '',
        eval: (cmd) => {
            socket.send({cmd, username})
        }
    });

    socket.on('connect_failed', function(){
        message.log('The server shutdown unexpectedly', 'magenta');
        process.exit();
    });
}