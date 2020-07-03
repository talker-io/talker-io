#!/usr/bin/env node

// logger module
const logger = require("./modules/talker_logger");

// ip
const ip = (require("my-ip")(null, true));

// config files
const server_config = require("./server_settings.js");
const other_config = require("./other_settings.js");

// config
const name = server_config.server_name;
const description = server_config.server_description;
const website = server_config.server_website;
const maxLength = server_config.server_message_maxLength;
const location = server_config.server_location;
const JSONconfig = JSON.stringify(server_config);
const port = server_config.server_port
let language = server_config.server_language;
let lastConnection = 0;


// http server
const http = require("http");
const app = require("express")();

// analytics server
Analytics = require("./modules/analytics/analytics")

// api
api = require("./modules/REST_API/api")

const server = http.createServer(app);
const io = require("socket.io")(server);

const handler = require("./modules/handlers/talker_handler")



function UpdateLastConnection(){
    lastConnection = logger.date("YMDHMS");
}

function onConnection(socket){
    let connectionName;
    handler.onConnection({
        name,
        description,
        website,
        maxLength,
        location,
        JSONconfig,
        language,
        port
    }, socket, io);

    let clientInfoReceived = false;
    UpdateLastConnection();

    socket.on("clientInfo", (data) =>{
        clientInfoReceived = true;
        connectionName = data.username;
        handler.clientInfoHandler({data}, socket, io);
    });

    setTimeout(()=> {
        if (clientInfoReceived === false){
            socket.emit("forceClose", "clientinfonotrecived");
            socket.disconnect();
        }
        else {
            handler.onSuccessfulConnection( {
                name,
                description,
                website,
                maxLength,
                location,
                JSONconfig,
                language,
                port
            }, socket, io);

            let currentUsers =  Analytics.userUpdate(io);


            //broadcasts that a new user has joined
            socket.broadcast.emit("newUser", {currentUsers: currentUsers, username: connectionName});

            //sends connection data
            socket.emit("connection_info",{
                name: name,
                description: description,
                website: website,
                maxLength: maxLength,
                location: location,
                language: language,
                userCount: currentUsers
            });

            // runs when a message is received
            socket.on("message", (data) => {
                handler.messageHandler(data, socket, io)
            });

            // runs when a user disconnected
            socket.on("disconnect", () => {

                handler.disconnectHandler({username: connectionName}, socket, io)
            });

            if(other_config.Do_not_log === false && other_config.show_time === false){
                logger.message_nl(`New user connected. Total users ${currentUsers}`, other_config.new_connection_color, true);
            }
            else if(other_config.Do_not_log === false && other_config.show_time === true){
                logger.message_nl(`${logger.date("YMDHMS")} New user connected. Total users ${currentUsers}`, other_config.new_connection_color, true);
            }

        }
    },200);

}


// runs on a new connection to the server
io.on("connection", (socket) => {
    onConnection(socket)
})



setTimeout(() =>{

    // talker-io server
    server.listen(port, () => {
        logger.message_nl(`Server listening on ${ip}:${server_config.server_port}\nGo to http://${ip}:${server_config.server_port} for live analytics`, "green");
    });


    app.get("/", function (req, res) {

        // starts the analytics server
        Analytics.server(name, description, website, maxLength, location, lastConnection, JSONconfig, io, res)

    })

    // api
    app.get("/api/:data", function (req, res) {
        let data = req.params.data;
        api.main(req, res, data, io)
        if (other_config.Do_not_log === false && other_config.show_time === false) {
            logger.message_nl(`New api request (request = ${data})`, other_config.api_request_color);

        }else if (other_config.Do_not_log === false && other_config.show_time === true) {
            logger.message_nl(`${logger.date("YMDHMS")} New api request (request = ${data})`, other_config.api_request_color);

        }
    });

},1000)

/*
* talker-io is created by tarith jayasooriya
*/