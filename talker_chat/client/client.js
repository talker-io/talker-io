#!/usr/bin/env node

const repl = require("repl");
const notification = require("node-notifier");

// custom modules
const config = require("./config");
const validator = require("./modules/connectionValidator");
const logger = require("./modules/talker_logger");
const prompt = require("prompts");
const promptTemplates = require("./modules/promptTemplates");

// request
const request = require("request");

// command line arguments
let username = null;
let options = null;
username = process.argv[2];
options = process.argv[3];

// error handler
const error = require("./modules/handlers/error/error")


// main function (step 3)
function main(socket, serverData) {

    // Sends disconnect message
    socket.on("disconnect", function () {
        socket.emit("disconnect", username);
    });

    // connect
    socket.on("connect", () => {
        socket.emit("clientInfo", {username});
    });

    // force close
    socket.on("forceClose", ()=>{
        socket.off()
        console.error("Server closed the connection. Please reconnect")
    })

    // message
    socket.on("message", (data) => {
        const {message, username} = data;
        logger.message(username + ": " + message.split("\n")[0] + "\n", "green");

        // notifications
        var notification_message = (`${username}: ${message}`);
        notification_message = notification_message.substring(0, notification_message.length -1);
        notification.notify({
            title: `talker.io ${serverData.server_name}`,
            message: notification_message,
            sound: true,
        });
    });

    // message send
    repl.start({
        prompt: ``,
        eval: (cmd) => {
            socket.send({cmd, username})
        }
    });

    socket.on("newUser", function (data) {
        let currentUsers = data.currentUsers;
        let username =data.username;
        logger.message_nl(`${username} joined. Total users ${currentUsers}`, "green");
    })

    //listens for userDisconnected
    socket.on("userDisconnected", function (data) {
        let currentUsers = data.currentUsers;
        let username = data.username;
        logger.message_nl(`${username} left. Total users ${currentUsers}`, "red");
    })

    socket.on("connect_failed", function(){
        logger.message("The server shutdown unexpectedly", "red");
        process.exit();
    });


}

// options (step 2)
function option(socket, data){
    let ServerName = data.server_name;
    let ServerDescription = data.server_description;
    let ServerMaxLength = data.server_message_maxLength;
    let ServerWebsite = data.server_website;
    let ServerLocation = data.server_location;
    let ServerLanguage = data.server_language;
    let ServerTotalUsers = data.server_userCount;
    const DataJson = JSON.stringify(data);


    // info option
    if (options === "info") {
        logger.message_nl(`${ServerName}"s info\n server name: ${ServerName}\n server description: ${ServerDescription}\n server max message size: ${ServerMaxLength}\n server website: ${ServerWebsite}\nuse other option for other data` , "bold");

        main(socket, data);
    }

    // name option
    else if(options === "name"){
        (async () => {
            logger.message_nl(`\nserver name: ${ServerName}` , "bold");
            await socket.emit("disconnect", username);
            setTimeout(() => {
                process.exit(0);
            }, 10);
        })()
    }

    // description option
    else if(options === "description"){
        (async () => {
            logger.message_nl(`\n${ServerName}"s description: ${ServerDescription}` , "bold");
            await socket.emit("disconnect", username);
            setTimeout(() => {
                process.exit(0);
            }, 10);
        })()
    }

    // message size option
    else if(options === "messagesize"){
        (async () => {
            logger.message_nl(`\n${ServerName}"s max message length: ${ServerMaxLength}` , "bold");

            await socket.emit("disconnect", username);
            setTimeout(() => {
                process.exit(0);
            }, 10);
        })()
    }

    // other option
    else if(options === "other"){
        (async () => {
            logger.message_nl(`\n${ServerName}"s other information:\n${DataJson}` , "bold");
            logger.message_nl("If some of these information is not showing when using \"info\" option that means that you are using a old version or the server is sending unwanted data" , "bold");

            await socket.emit("disconnect", username);
            setTimeout(() => {
                process.exit(0);
            }, 10);
        })()
    }

    // location option
    else if(options === "location"){

        // runs when server didnt send the location
        if (typeof(ServerLocation) === undefined || typeof(ServerLocation) !== "string" || ServerLocation === ""){
            (async () => {
                logger.message_nl(`\nThis server didnt provide its location` , "bold");
                await socket.emit("disconnect", username);
                setTimeout(() => {
                    process.exit(0);
                }, 10);
            })()
        }

        // runs when server sent the location
        else{
            (async () => {
                logger.message_nl(`server"s location: ${ServerLocation}` , "bold");
                await socket.emit("disconnect", username);
                setTimeout(() => {
                    process.exit(0);
                }, 10);
            })()
        }
    }

    // current user count option
    else if(options === "total") {

        // runs when server didnt send total number of users
        if (typeof (ServerTotalUsers) === undefined || typeof (ServerTotalUsers) !== "number") {
            (async () => {
                logger.message_nl(`\nThis server didnt provide its current user count`, "bold");
                await socket.emit("disconnect", username);
                setTimeout(() => {
                    process.exit(0);
                }, 10);
            })()
        }

        // runs when server sent the total number of users
        else {
            (async () => {
                logger.message_nl(`server"s current number of users: ${ServerTotalUsers - 1} (without current connection)`, "bold");
                await socket.emit("disconnect", username);
                setTimeout(() => {
                    process.exit(0);
                }, 10);
            })()
        }

    }

    // language option
    else if(options === "language"){
        (async () => {
            logger.message_nl(`\n${ServerName}"s language: ${ServerLanguage}` , "bold");

            await socket.emit("disconnect", username);
            setTimeout(() => {
                process.exit(0);
            }, 10);
        })()
    }

    //no option
    else {
        main(socket, data);
    }

}

// connection check (step 1)
async function connectionCheck(socket) {
    request(`${config.server_ip}/api/info`, { json: true }, (err, res, data) => {

            if (err) {
                console.log(err.code)
                switch (err.code) {
                    case "ECONNREFUSED":
                        error.requestECONNREFUSED(err)
                        process.exit(200)
                        break;
                }

            }

            try {
                let ServerName = data.server_name;
                let ServerDescription = data.server_description;
                let ServerMaxLength = data.server_message_maxLength;
                let ServerWebsite = data.server_website;
                const DataJson = JSON.stringify(data);

            }
            catch (e) {
                logger.message_nl("The ip in the config file is not a talker-io server ip or the server is offline", "red")
                process.exit(200)
            }
            finally {
                let ServerName = data.server_name;
                let ServerDescription = data.server_description;
                let ServerMaxLength = data.server_message_maxLength;
                let ServerWebsite = data.server_website;
                const DataJson = JSON.stringify(data);

                //runs if data from server is invalid
                if (validator.validate(data) === false){

                    //runs when data is invalid
                    logger.message_nl("The server you are trying to connect\nis sending information that is invalid\nor sending data that\"s too big\nPlease proceed with caution\n", "magenta");


                    (async () => {
                        const response = await prompt(promptTemplates.proceed);
                        if (response.value === true) {

                            logger.message_nl(`\n==== Welcome to ${ServerName} ====\n  ${ServerDescription}\nType your message and press Enter to send\n`, "yellow");

                            // if server has a website display
                            if (ServerWebsite === "") {}
                            else {
                                logger.message_nl(`Website: ${ServerWebsite}\n`, "yellow");
                            }

                            // if servers max length is under 10 display max length to user
                            if (ServerMaxLength < 10){
                                logger.message_nl(`This servers max message size is ${ServerMaxLength}`);
                            }
                            else{}

                            option(socket, data);
                        }
                        else if (response.value === false) {
                            process.exit(22);
                        }
                        else {
                            process.exit(44);
                        }
                    })()
                }

                // runs when data from server is valid
                else{

                    logger.message_nl(`\n==== Welcome to ${ServerName} ====\n${ServerDescription}\nType your message and press Enter to send\n`, "yellow");

                    // if server has a website display the website
                    if (ServerWebsite === ""){}
                    else {
                        logger.message_nl(`Website: ${ServerWebsite}\n`, "yellow");
                    }

                    // if servers max length is under 10 display max length to user
                    if (ServerMaxLength < 10){
                        logger.message_nl(`This servers max message size is ${ServerMaxLength}\nyour messages will be limited to this size`, "magenta");
                    }
                    else{}

                    option(socket, data);




                }
            }



        })

}


setTimeout(()=>{
    const socket = require("socket.io-client")(config.server_ip);
    connectionCheck(socket);
},1000);

/*
* talker-io is created by tarith jayasooriya
*/