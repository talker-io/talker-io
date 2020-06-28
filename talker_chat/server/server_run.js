#!/usr/bin/env node

// loading spinner
const ora = require("ora");
const spinner = ora("Starting talker.io server").start();
spinner.color = "cyan"

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
let language = server_config.server_language;
let lastConnection = 0;


// http server
const http = require("http");
const express = require("express");
const app = express();

const server = http.createServer(app);
const io = require("socket.io")(server);


const JSONconfig = JSON.stringify(server_config);

function userupdate() {
    return Object.keys(io.sockets.connected).length;
}


function newUserAnalytic(){
        lastConnection = logger.date("YMDHMS");
}



// runs on a new connection to the server
io.on("connection", (socket) => {
    let currentUsers =  userupdate();

    newUserAnalytic();

    //broadcasts that a new user has joined
    socket.broadcast.emit("newUser", {currentUsers: currentUsers});

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


    if(other_config.Do_not_log === false && other_config.show_time === false){
        logger.message_nl(`New user connected. Total users ${userupdate()}`, other_config.new_connection_color, true);
    }
    else if(other_config.Do_not_log === false && other_config.show_time === true){
        logger.message_nl(`${logger.date("YMDHMS")} New user connected. Total users ${userupdate()}`, other_config.new_connection_color, true);
    }

    // runs when a message is received
    socket.on("message", (evt) => {

        let {cmd, username} = evt;

        let message;
        let fullMessage;

        // runs when do not log is enabled
        if (other_config.Do_not_log === true){
            message = cmd.substring(0,server_config.server_message_maxLength);
            fullMessage = {message, username};
            socket.broadcast.emit("message", fullMessage);
        }

        // runs when do not log is disabled
        else{

            // trim the message according to config
            message = cmd.substring(0,server_config.server_message_maxLength);

            // combines the timed message and the username
            fullMessage = {message, username};

            // logs the message in the server
            logger.message_nl(`${logger.date("ymdhms")} New message by ${username} message: ${cmd} trimmed message: ${message}`, other_config.new_message_color);

            // broadcasts the message
            socket.broadcast.emit("message", fullMessage);

        }
    });


    // runs when a user disconnected
    socket.on("disconnect", (data) => {
        currentUsers = userupdate()
        if (other_config.Do_not_log === false && other_config.show_time === false) {
            logger.message_nl(`A user disconnected. Total users ${userupdate()}`, other_config.disconnect_color);
            socket.broadcast.emit("userDisconnected", {currentUsers: currentUsers});

        } else if (other_config.Do_not_log === false && other_config.show_time === true) {
            logger.message_nl(`${logger.date("ymdhms")} A user disconnected. Total users ${userupdate()}`, other_config.disconnect_color);
            socket.broadcast.emit("userDisconnected", {currentUsers: currentUsers});
        }
    })


})





setTimeout(()=>{

    // change the language to "en" if it is undefined
    if(typeof(language) === undefined || language === ""){
        language = "en";
    }

    // talker-io server
    server.listen(server_config.server_port, () => {
        spinner.stop();
        logger.message_nl(`Server listening on ${ip}:${server_config.server_port}\nGo to http://${ip}:${server_config.server_port} for live analytics`, "green");
    })

    // analytics server
    app.get("/", function (req, res) {
        let currentUsers =  userupdate();

        res.render(__dirname + "/res/index.ejs", {
            name: name,
            description: description,
            website: website,
            maxLength: maxLength,
            location: location,
            currentUsers: currentUsers,
            lastConnection: lastConnection,
            JSONconfig: JSONconfig
        });

        res.end();
    });

    // api
    app.get("/api/:data", function (req, res) {
        let currentUsers =  userupdate();
        let data = req.params.data;

        if (other_config.Do_not_log === false && other_config.show_time === false) {
            logger.message_nl(`New api request (request = ${data})`, other_config.api_request_color);

        } else if (other_config.Do_not_log === false && other_config.show_time === true) {
            logger.message_nl(`${logger.date("YMDHMS")} New api request (request = ${data})`, other_config.api_request_color);

        }


        if (data === "server_name"){
            res.send(name);
            res.end();
        } else if(data === "server_description"){
            res.send(description);
            res.end();
        } else if(data === "server_website"){
            res.send(website);
            res.end();
        } else if(data === "server_message_maxLength"){
            res.send(String(maxLength));
            res.end();
        } else if(data ===  "server_location"){
            res.send(location);
            res.end();
        } else if(data === "server_language"){
            res.send(language);
            res.end();
        }else if(data === "info"){
            res.send(JSONconfig);
            res.end();
        }else{
            res.send(JSONconfig);
            res.end();
        }
    })

    // node modules
    app.use("/static", express.static("node_modules"));

},1000)
