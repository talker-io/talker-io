const customErrorMessageList = require("./error_message")
const logger = require("../../talker_logger")

function requestECONNREFUSED(err) {
    const errorCode = err.code;
    const errorMessage = err.message;
    const customErrorMessage = customErrorMessageList.ECONNREFUSED;
    logger.message_nl(customErrorMessage, "red");
    logger.message_nl(`ERROR CODE: ${errorCode} \nERROR MESSAGE: ${errorMessage}`, "red");
}


module.exports = {
    requestECONNREFUSED
}
