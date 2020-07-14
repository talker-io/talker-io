#!/usr/bin/env node

let lastConnection = 0;

// logger module
const logger = require("./modules/talker_logger");

// ip
const ip = (require("my-ip")(null, true));

// option files
const serverOptions = require("./settings/server_settings.js");
const otherOptions = require("./settings/other_settings.js");
const advanceOptions = require("./settings/advance_settings");


// options
const name = serverOptions.server_name;
const description = serverOptions.server_description;
const website = serverOptions.server_website;
const maxLength = serverOptions.server_message_maxLength;
const location = serverOptions.server_location;
const JSONconfig = JSON.stringify(serverOptions);
const port = serverOptions.server_port
let language = serverOptions.server_language;

// http server
const http = require("http");
const app = require("express")();

// analytics server
publicPage = require("./modules/analytics/analytics");

// api
api = require("./modules/REST_API/api");


const server = http.createServer(app);

const io = require("socket.io")(server,{
    pingTimeout: advanceOptions.pingTimeout,
    pingInterval: advanceOptions.pingInterval
});

const handler = require("./modules/handlers/talker_handler");

let firstUserDisconnected = false;



function UpdateLastConnection(){
    lastConnection = logger.date("YMDHMS");
}

function onConnection(socket){
    let id = socket.id
    let connectionName;
    let stayPrivate = null;

    if(firstUserDisconnected === false){
        socket.disconnect();
        firstUserDisconnected = true
    }

    function toggleStayPrivate(id) {
        stayPrivate = id;
    }
    function changeConnectionName(name){

        if(name === "server" || name === "SERVER"){
            name = "AnonymousUser"
        }
        if (typeof (name) === "undefined"){
            name = "AnonymousUser"
        }
        connectionName = name
    }

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

    socket.on("clientInfo", (data) =>{
        connectionName = data.username;


        if(connectionName === "server" || connectionName === "SERVER"){
            connectionName = "AnonymousUser"
        }
        if (typeof (connectionName) === "undefined"){
            connectionName = "AnonymousUser"
        }
        handler.clientInfoHandler({data}, socket, io);



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

        let currentUsers =  publicPage.userUpdate(io);


        //broadcasts that a new user has joined
        socket.broadcast.emit("newUser", {currentUsers: currentUsers, username: connectionName});

        //sends connection data
        socket.emit("server_info",{
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
            handler.messageHandler(data, connectionName,socket, io, {
                changeConnectionName,
                toggleStayPrivate

            },{
                stayPrivate
            })

        })


        // runs when a user disconnected
        socket.on("disconnect", () => {

            handler.disconnectHandler({username: connectionName}, socket, io)
        });

        socket.emit("myinfo", {
            id: id,
            connectionName: connectionName
        });

        if(otherOptions.Do_not_log === false){
            logger.message_nl(`${logger.date("YMDHMS")} New user connected. Total users ${currentUsers}. ID:${id} USERNAME:${connectionName}`, otherOptions.new_connection_color, true);
        }


    });
    UpdateLastConnection();

}

// runs on a new connection to the server
io.on("connection", (socket) => {
    onConnection(socket)
});

io.on("error", (err) =>{
    logger.message_nl(`An error occurred ERROR CODE: ${err.code} ERROR MESSAGE: ${err.message}`, "red");
});

setTimeout(() =>{

    // talker-io server
    server.listen(port, () => {
            logger.message_nl(`Server listening on ${ip}:${port}\nGo to http://${ip}:${port} for live analytics`, "green");
        });

    app.get("/", function (req, res) {
        // starts the publicPage
        publicPage.server(name, description, website, maxLength, location, lastConnection, JSONconfig, io, res)
    })

    // api
    app.get("/api/:data", function (req, res) {
        let data = req.params.data;
        api.main(req, res, data, io);

        if (otherOptions.Do_not_log === false) {
            logger.message_nl(`${logger.date("YMDHMS")} New api request (request = ${data})`, otherOptions.api_request_color);
        }
    });

},1000)


/*
* talker-io is created by tarith jayasooriya
*/