const ora = require('ora');
const spinner = ora("Loading client").start();
const repl = require('repl');
const notification = require('node-notifier');

// custom modules
const config = require('./config')
const validator = require('./modules/connectionValidator');
const logger = require('./modules/talker_logger');
const prompt = require("prompts")
const promptTemplates = require("./modules/promptTemplates")

// request
const request = require('request')

// command line arguments
let username = null
let options = null
username = process.argv[2]
options = process.argv[3]

// starts spinner
spinner.color = "cyan";


// main function
function main(socket, serverdata) {


    //Sends disconnect message
    socket.on('disconnect', function () {
        socket.emit('disconnect', username)
    });

    //connect
    socket.on('connect', () => {});

    //message
    socket.on('message', (data) => {
        const {message, username} = data
        logger.message(username + ': ' + message.split('\n')[0] + "\n", 'green');

        // notifications
        var notification_message = (`${username}: ${message}`)
        notification_message = notification_message.substring(0, notification_message.length -1)
        notification.notify({
            title: `talker.io ${serverdata.name}`,
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

    socket.on('newUser', function (data) {
        currentUsers = data.currentUsers
        logger.message_nl(`New user connected Total users ${currentUsers}`, 'green')
    })

    //listens for userDisconnected
    socket.on('userDisconnected', function (data) {
        currentUsers = data.currentUsers
        logger.message_nl(`someone disconnected. Total users ${currentUsers}`, 'red')
    })

    socket.on('connect_failed', function(){
        logger.message('The server shutdown unexpectedly', 'red');
        process.exit();
    });


}

// connection check
async function connectionCheck(socket) {

    request(`${config.server_ip}/api/info`, { json: true }, (err, res, data) => {
        if (err) { return logger.message_nl(err, 'red'); }

        let server_name = data.server_name;
        let server_description = data.server_description;
        let server_maxLength = data.server_message_maxLength;
        let server_website = data.server_website;
        const datajson = JSON.stringify(data)

        //runs if data from server is invalid
        if (validator.validate(data) === false){

            //runs when data is invalid
            logger.message_nl('The server you are trying to connect\nis sending information that is invalid\nor sending data that\'s too big\nPlease proceed with caution\n', 'magenta');


            (async () => {
                const response = await prompt(promptTemplates.proceed);
                if (response.value === true) {

                    logger.message_nl(`\n==== Welcome to ${server_name} ====\n  ${server_description}\nType your message and press Enter to send\n`, 'yellow');

                    // if server has a website display
                    if (server_website === "") {}
                    else {
                        logger.message_nl(`Website: ${server_website}\n`, 'yellow')
                    }

                    // if servers max length is under 10 display max length to user
                    if (server_maxLength < 10){
                        logger.message_nl(`This servers max message size is ${server_maxLength}`)
                    }
                    else{}

                    option(socket, data)
                }
                else if (response.value === false) {
                    process.exit(22);
                }
                else {
                    process.exit(44)
                }
            })()
        }

        // runs when data from server is valid
        else{

            logger.message_nl(`\n==== Welcome to ${server_name} ====\n${server_description}\nType your message and press Enter to send\n`, 'yellow');

            // if server has a website display the website
            if (server_website === ""){}
            else {
                logger.message_nl(`Website: ${server_website}\n`, 'yellow')
            }

            // if servers max length is under 10 display max length to user
            if (server_maxLength < 10){
                logger.message_nl(`This servers max message size is ${server_maxLength}\nyour messages will be limited to this size`, 'magenta');
            }
            else{}

            option(socket, data)




        }

    })

/*    socket.on('connection_info', (data) => {
*/
}

// options
function option(socket, data){
    let server_name = data.name;
    let server_description = data.description;
    let server_maxLength = data.maxLength;
    let server_website = data.website;
    let server_location = data.location;
    let server_language = data.language;
    let server_total_users = data.userCount;
    const data_json = JSON.stringify(data);



    // info option
    if (options === "info") {
        logger.message_nl(`${server_name}'s info\n server name: ${server_name}\n server description: ${server_description}\n server max message size: ${server_maxLength}\n server website: ${server_website}\nuse other option for other data` , 'bold')

        main(socket, data)
    }

    // name option
    else if(options === "name"){
        (async () => {
            logger.message_nl(`\nserver name: ${server_name}` , 'bold')
            await socket.emit('disconnect', username)
            setTimeout(() => {
                process.exit(0)
            }, 10);
        })()
    }

    // description option
    else if(options === "description"){
        (async () => {
            logger.message_nl(`\n${server_name}'s description: ${server_description}` , 'bold')
            await socket.emit('disconnect', username)
            setTimeout(() => {
                process.exit(0)
            }, 10);
        })()
    }

    // message size option
    else if(options === "messagesize"){
        (async () => {
            logger.message_nl(`\n${server_name}'s max message length: ${server_maxLength}` , 'bold')

            await socket.emit('disconnect', username)
            setTimeout(() => {
                process.exit(0)
            }, 10);
        })()
    }

    // other option
    else if(options === "other"){
        (async () => {
            logger.message_nl(`\n${server_name}'s other information:\n${data_json}` , 'bold')
            logger.message_nl("If some of these information is not showing when using \"info\" option that means that you are using a old version or the server is sending unwanted data" , 'bold')

            await socket.emit('disconnect', username)
            setTimeout(() => {
                process.exit(0)
            }, 10);
        })()
    }

    // country option
    else if(options === "location"){

        // runs when server didnt send the location
        if (typeof(server_location) === undefined || typeof(server_location) !== "string" || server_location === ""){
            (async () => {
                logger.message_nl(`\nThis server didnt provide its location` , 'bold')
                await socket.emit('disconnect', username)
                setTimeout(() => {
                    process.exit(0)
                }, 10);
            })()
        }

        // runs when server sent the location
        else{
            (async () => {
                logger.message_nl(`server's location: ${server_location}` , 'bold')
                await socket.emit('disconnect', username)
                setTimeout(() => {
                    process.exit(0)
                }, 10);
            })()
        }
    }

    // current user count option
    else if(options === "total") {

        // runs when server didnt send total number of users
        if (typeof (server_total_users) === undefined || typeof (server_total_users) !== "number") {
            (async () => {
                logger.message_nl(`\nThis server didnt provide its current user count`, 'bold')
                await socket.emit('disconnect', username)
                setTimeout(() => {
                    process.exit(0)
                }, 10);
            })()
        }

        // runs when server sent the total number of users
        else {
            (async () => {
                logger.message_nl(`server's current number of users: ${server_total_users - 1} (without current connection)`, 'bold')
                await socket.emit('disconnect', username)
                setTimeout(() => {
                    process.exit(0)
                }, 10);
            })()
        }

    }

    // language option
    else if(options === "language"){
        (async () => {
            logger.message_nl(`\n${server_name}'s language: ${server_language}` , 'bold')

            await socket.emit('disconnect', username)
            setTimeout(() => {
                process.exit(0)
            }, 10);
        })()
    }

    //no option
    else {
        main(socket, data)
    }

}

spinner.stop()
setTimeout(()=>{
    spinner.text = "connecting to server"
    const socket = require('socket.io-client')(config.server_ip);
    connectionCheck(socket)
},1000)
