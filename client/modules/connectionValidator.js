
function validate(connectionInfo) {
    if(connectionInfo.name == undefined || connectionInfo.description == undefined || connectionInfo.maxLength == undefined || connectionInfo.website == undefined){
        return false
    }
    else if(typeof (connectionInfo.name) !== "string" || typeof(connectionInfo.description) !== "string" || isNaN(connectionInfo.maxLength) || typeof(connectionInfo.website) !== "string"){
        return false
    }
    else if(((connectionInfo.name).length >20) || ((connectionInfo.description).length) > 60){
        return false
    }
    else{
        return true
    }
}
module.exports = {
    validate
}