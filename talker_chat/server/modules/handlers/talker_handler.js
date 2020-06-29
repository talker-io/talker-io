const other_config = require("../../other_settings");
const server_config = require("../../server_settings");
const logger = require("../talker_logger");
const maxLength = server_config.server_message_maxLength;
const Analytics = require("../analytics/analytics");
let currentUsers = 0;

function messageHandler(data, socket, io){
    let {cmd, username} = data;

    let message;
    let fullMessage;

    // runs when do not log is enabled
    if (other_config.Do_not_log === true){
        message = cmd.substring(0,maxLength);
        fullMessage = {message, username};
        socket.broadcast.emit("message", fullMessage);
    }

    // runs when do not log is disabled
    else{

        // trim the message according to config
        message = cmd.substring(0,maxLength);

        // combines the timed message and the username
        fullMessage = {message, username};

        // logs the message in the server
        logger.message_nl(`${logger.date("ymdhms")} New message by ${username} message: ${cmd} trimmed message: ${message}`, other_config.new_message_color);

        // broadcasts the message
        socket.broadcast.emit("message", fullMessage);

    }
}

function disconnectHandler(data, socket, io){
    currentUsers = Analytics.userUpdate(io);
    if (other_config.Do_not_log === false && other_config.show_time === false) {
        logger.message_nl(`A user disconnected. Total users ${Analytics.userUpdate(io)}`, other_config.disconnect_color);

    }else if (other_config.Do_not_log === false && other_config.show_time === true) {
        logger.message_nl(`${logger.date("ymdhms")} A user disconnected. Total users ${Analytics.userUpdate(io)}`, other_config.disconnect_color);
    }
    socket.broadcast.emit("userDisconnected", {currentUsers: currentUsers});

}

module.exports={
    messageHandler,
    disconnectHandler
};