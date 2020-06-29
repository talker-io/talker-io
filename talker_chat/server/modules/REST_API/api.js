Analytics = require("../analytics/analytics")
const server_config = require("../../server_settings")
const name = server_config.server_name;
const description = server_config.server_description;
const website = server_config.server_website;
const maxLength = server_config.server_message_maxLength;
const location = server_config.server_location;
let language = server_config.server_language;
const JSONconfig = JSON.stringify(server_config);

function main(req, res, data, io){

    let currentUsers = Analytics.userUpdate(io);

    // change the language to "en" if it is undefined
    if(language === undefined || language === ""){
        language = "en";
    }

    switch (data) {
        case "server_name":
            res.send(name);
            res.end();
            break;
        case "server_description":
            res.send(description);
            res.end();
            break;
        case "server_website":
            res.send(website);
            res.end();
            break;
        case  "server_message_maxLength":
            res.send(String(maxLength));
            res.end();
            break;
        case "server_location":
            res.send(location);
            res.end();
            break;
        case "server_language":
            res.send(language);
            res.end();
            break;
        case "info":
            res.send(JSONconfig);
            res.end();
            break;
        case "currentUsers":
            res.send(currentUsers);
            res.end();
            break;
        default:
            res.send(JSONconfig);
            res.end();
    }
}

module.exports={
    main
}