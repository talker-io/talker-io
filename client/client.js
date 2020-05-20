const config = require('./config')
const ora = require('ora');
const spinner = ora("Loading client").start();
const validator = require('./modules/connectionValidator');

const repl = require('repl');
const logger = require('./modules/talker_logger');
const notification = require('node-notifier');
let username = null
let info_enabled = null
const prompt = require("prompts")
const promptTemplates = require("./modules/promptTemplates")

username = process.argv[2]
info_enabled = process.argv[3]


spinner.color = "cyan";


// main function
function main(socket, data) {

    spinner.stop()
    socket.on('disconnect', function () {
        socket.emit('disconnect')
    });

/*
    //connection information
    socket.on('connection_info',(data) => {
        global.data = data
        let room_name = data.name;
        let room_description = data.description;
        let room_maxLength = data.maxLength;
        let room_website = data.website;


        logger.message_nl(`\n=== Welcome to ${room_name} ===\n  ${room_description}\nType your message and press Enter to send\n`, 'yellow');
        if (room_website == "") {}
            else
         {
            logger.message_nl(`Website: ${room_website}\n`, 'yellow')
        }
        if (info_enabled == "true") {
            logger.message_nl(`${room_name} info\n room name: ${room_name}\n room description: ${room_description}\n room max message size: ${room_maxLength}\n room website: ${room_website}\n`, 'bold')
        }
    })*/



    //connect
    socket.on('connect', () => {});

    //message
    socket.on('message', (data) => {
        const {message, username} = data
        logger.message(username + ': ' + message.split('\n')[0] + "\n", 'green');
        var notification_message = (`${username}: ${message}`)
        notification_message = notification_message.substring(0, notification_message.length /*-1*/)
        notification.notify({
            title: 'New message',
            message: notification_message,
            sound: true,
        })
    });

    //message send
    repl.start({

        prompt: '',
        eval: (cmd) => {
            socket.send({cmd, username})
        }
    });

    socket.on('connect_failed', function(){
        logger.message('The server shutdown unexpectedly', 'red');
        process.exit();
    });


}

// connection check
async function connectionCheck(socket) {
     socket.on('connection_info', (data) => {

         //runs if data form server is invalid
         if (validator.validate(data) == false){
             //runs when data is invalid
             spinner.stop()
             logger.message_nl('The server you are trying to connect to is sending information that is invalid\nor is bypassing a limit rule\nPlease proceed with caution\n', 'magenta');
             (async () => {
                 const response = await prompt(promptTemplates.proceed);
                 if (response.value === true) {
                     let room_name = data.name;
                     let room_description = data.description;
                     let room_maxLength = data.maxLength;
                     let room_website = data.website;
                     const datajson = JSON.stringify(data)
                     logger.message_nl(`\n=== Welcome to ${room_name} ===\n  ${room_description}\nType your message and press Enter to send\n`, 'yellow');
                     if (room_website === "") {}
                     else {
                         logger.message_nl(`Website: ${room_website}\n`, 'yellow')
                     }
                     if (info_enabled === "true") {
                         logger.message_nl(`${room_name} info\n room name: ${room_name}\n room description: ${room_description}\n room max message size: ${room_maxLength}\n room website: ${room_website} other data: ${datajson}` , 'bold')

                         main(socket, data)
                     }
                     else {
                         main(socket, data)
                     }

                 }
                 else if (response.value === false) {
                     process.exit(22);
                 } else {
                     process.exit(44)
                 }
             })()
         }

         // runs when data from server is valid
         else{
                 let room_name = data.name;
                 let room_description = data.description;
                 let room_maxLength = data.maxLength;
                 let room_website = data.website;
                 const datajson = JSON.stringify(data)
                 logger.message_nl(`\n=== Welcome to ${room_name} ===\n  ${room_description}\nType your message and press Enter to send\n`, 'yellow');
                 if (room_website === "") {}
                 else {
                     logger.message_nl(`Website: ${room_website}\n`, 'yellow')
                 }
                 if (info_enabled === "true") {
                     logger.message_nl(`${room_name} info\n room name: ${room_name}\n room description: ${room_description}\n room max message size: ${room_maxLength}\n room website: ${room_website} other data: ${datajson}`, 'bold')
                     main(socket, data)
                 }
                 else {
                     main(socket, data)
                 }
             }
    })
}


setTimeout(()=>{
    spinner.text = "connecting to server"
    const socket = require('socket.io-client')(config.roomip);
    connectionCheck(socket)
},1000)
