const otherOptions = require("../../settings/other_settings");
const serverOptions = require("../../settings/server_settings");
const advanceOptions = require("../../settings/advance_settings");
const logger = require("../talker_logger");
const maxLength = serverOptions.server_message_maxLength;
const Analytics = require("../analytics/analytics");
const fs = require("fs");


let currentUsers = 0;



let renameRegexp = /^@rename\s([0-9A-Za-z_]*)/;
let myNameRegexp = /^@myname/;
let privateRegexp = /^@private\s([0-9A-Za-z_]*)\s([0-9A-Za-z_\s]*)/;
let myIdRegexp = /^@myid/;
let enterPrivateRegexp = /^@enterprivate\s([0-9A-Za-z_]*)/
let exitPrivateRegexp = /^@exitprivate\s([0-9A-Za-z_]*)/

function messageHandler(data, connectionName, socket, io, functions, misc){
    const {stayPrivate} = misc
    const {cmd} = data;
    const changeConnectionName = functions.changeConnectionName
    const toggleStayPrivate = functions.toggleStayPrivate
    const connectedUserNames = functions.connectedUserNames;

    let enteredRename = renameRegexp.test(cmd);
    let enteredMyName = myNameRegexp.test(cmd);
    let enteredPrivate = privateRegexp.test(cmd);
    let enteredMyId = myIdRegexp.test(cmd);
    let enteredEnterPrivate = enterPrivateRegexp.test(cmd);
    let enteredExitPrivate = exitPrivateRegexp.test(cmd);

    let message
    let fullMessage;

    try {

            if(enteredRename) {

                let name = cmd.match(renameRegexp)[1];
                if (name !== ""){
                    changeConnectionName(name);
                }

            }
            else if(enteredMyName){
                io.to(socket.id).emit("message", {message: {message: connectionName, user: {name: "SERVER", id : "SERVER"}}, private: true});

            }
            else if(enteredPrivate){
                let receiver = cmd.match(privateRegexp)[1];
                let message = cmd.match(privateRegexp)[2].substring(0, maxLength).trim()

                if (message !== ""){

                    fullMessage = {message: message, user: {name: connectionName, id: socket.id}}
                    io.to(receiver).emit("message", {message: fullMessage, private: true});
                    io.to(socket.id).emit("message", {message: {message: `private message sent to ${receiver}`, user: {name:"SERVER", id:"SERVER"}}, private: true});
                }
            }
            else if(enteredMyId){
                io.to(socket.id).emit("message", {message: {message: `your id is ${socket.id}`, user: {name:"SERVER", id:"SERVER"}}, private: true});

            }
            else if(enteredEnterPrivate){
                let receiver = cmd.match(enterPrivateRegexp)[1];
                toggleStayPrivate(receiver);
                io.to(socket.id).emit("message", {message: {message: `every message you type will be sent to ${receiver} type @exitprivate to exit the private chat`, user: {name:"SERVER", id:"SERVER"}}, private: true});

            }
            else if(enteredExitPrivate){
                toggleStayPrivate(null)
                io.to(socket.id).emit("message", {message: {message: `Exited private chat`, user: {name:"SERVER", id:"SERVER"}}, private: true});
            }
            else {


                // trim the message according to config
                message = cmd.substring(0, maxLength).trim();

                // combines the timed message and the username
                fullMessage = {message, user: {name: connectionName, id: socket.id}};
                if (message !== "") {


                    setTimeout(() => {
                        if(stayPrivate === null){
                            // broadcasts the message
                            socket.broadcast.emit("message", {message: fullMessage, private: false});
                        }
                        else{
                            // send the message
                            io.to(stayPrivate).emit("message", {message:fullMessage, private: true})
                        }


                    }, advanceOptions.messageLatency);

                    // runs when do not log is disabled
                    if (otherOptions.Do_not_log === false) {
                        // logs the message in the server
                        logger.message_nl(`${logger.date("ymdhms")} New message by ${connectionName} message: ${cmd} trimmed message: ${message}`, otherOptions.new_message_color);
                    }

                }
            }




    }
    catch (e) {
        logger.message_nl(e, "red")

    }


}

/// This function will be started when a user disconnects
function disconnectHandler(data, socket, io){

    currentUsers = Analytics.userUpdate(io);
    let username = data.username

    if (otherOptions.Do_not_log === false) {
        logger.message_nl(`${logger.date("ymdhms")} ${username} left. Total users ${Analytics.userUpdate(io)}`, otherOptions.disconnect_color);
    }
    socket.broadcast.emit("userDisconnected", {currentUsers: currentUsers, username: username});

}

// This function will be started on a new connection
function onConnection(data, socket, io){

}

// This function will be started on a successful connection
function onSuccessfulConnection(data, socket, io) {

}

function clientInfoHandler(data, socket, io){
    logger.message_nl(data.username, "blue")
}

module.exports={
    messageHandler,
    disconnectHandler,
    onConnection,
    onSuccessfulConnection,
    clientInfoHandler
};
