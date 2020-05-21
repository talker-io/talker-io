
if (require.main === module){
    console.log("Please edit server_settings.js to change server settings\nrunning this file wont do anything")
}

//server settings
const server_name = 'testing server'
const server_description = 'This is a demo description'
const server_website = 'https://test.com'//leave empty if you dont want to send your server's website
const server_message_maxLength = 160
const server_port = "8080"
const server_location = ""// if wanted you can enter the location of the server


//logger settings
const Do_not_log = false                 // default false
const new_message_color = "cyan"         // available colors: red,blue,green,yellow,black,white,bold,none,cyan,magenta,gray,pink
const new_connection_color = "green"     // available colors: red,blue,green,yellow,black,white,bold,none,cyan,magenta,gray,pink
const disconnect_color = "pink"          // available colors: red,blue,green,yellow,black,white,bold,none,cyan,magenta,gray,pink
const show_time = true                   //default true



//DO NOT CHANGE
module.exports = {
    server_name,
    server_description,
    server_website,
    server_message_maxLength,
    server_port,
    server_location,
    Do_not_log,
    new_message_color,
    new_connection_color,
    disconnect_color,
    show_time
}
