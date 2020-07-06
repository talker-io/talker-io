const otherOptions = require("../../settings/other_settings");
const serverOptions = require("../../settings/server_settings");
const advanceOptions = require("../../settings/advance_settings");
const logger = require("../talker_logger");
const maxLength = serverOptions.server_message_maxLength;
const Analytics = require("../analytics/analytics");
let currentUsers = 0;

function messageHandler(data, connectionName, socket, io){
    try {
        const {cmd} = data
        let message
        let fullMessage;

        // trim the message according to config
        message = cmd.substring(0,maxLength).trim();

        // combines the timed message and the username
        fullMessage = {message, username: connectionName};
        if(message !== ""){
            setTimeout(() => {

                // broadcasts the message
                socket.broadcast.emit("message", fullMessage);

            }, advanceOptions.messageLatency);

            // runs when do not log is disabled
            if (otherOptions.Do_not_log === false){
                // logs the message in the server
                logger.message_nl(`${logger.date("ymdhms")} New message by ${connectionName} message: ${cmd} trimmed message: ${message}`, otherOptions.new_message_color);
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
