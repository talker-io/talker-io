
if (require.main === module){
    console.log(`Please go to ${__filename} to change other settings\nrunning this file wont do anything`)
}

// server settings
const server_name = 'testing server';
const server_description = 'This is a demo description';
const server_website = 'https://tarithj.github.io/talker-io';//enter server's website(OPTIONAL)
const server_message_maxLength = 100;
const server_port = "8000";
const server_location = ""; // enter the location of the server(OPTIONAL)
const server_language = ""; // enter the language of the server(Default:en)




// DO NOT CHANGE
module.exports = {
    server_name,
    server_description,
    server_website,
    server_message_maxLength,
    server_port,
    server_location,
    server_language
}
