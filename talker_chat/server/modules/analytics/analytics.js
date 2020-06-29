// Returns the number of talker-io clients connected
function userUpdate(io) {
        return JSON.stringify(Object.keys(io.sockets.connected).length);
}

// analytics server
function server(name, description, website, maxLength, location, lastConnection, JSONconfig, io, res){

            let currentUsers =  userUpdate(io);
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

}

module.exports = {server, userUpdate}

