
function validate(connectionInfo) {
    if(connectionInfo.server_name === undefined || connectionInfo.server_description === undefined || connectionInfo.server_message_maxLength === undefined || connectionInfo.server_website === undefined){
        return false;
    }
    else if(typeof (connectionInfo.server_name) !== "string" || typeof(connectionInfo.server_description) !== "string" || isNaN(connectionInfo.server_message_maxLength) || typeof(connectionInfo.server_website) !== "string"){
        return false;
    }
    else if(((connectionInfo.server_name).length >20) || ((connectionInfo.server_description).length) > 60){
        return false;
    }
    else{
        return true;
    }
}
module.exports = {
    validate
}
