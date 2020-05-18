//room settings
const room_name = 'testing room'
const room_description = 'This is a demo description'
const room_website = ''//leave empty if you dont want to send your rooms website
const room_message_maxLength = 20
const port = "8080"

//logger settings
const Do_not_log = false                 // default false
const new_message_color = "cyan"         // available colors: red,blue,green,yellow,black,white,bold,none,cyan,magenta,gray,pink
const new_connection_color = "green"     // available colors: red,blue,green,yellow,black,white,bold,none,cyan,magenta,gray,pink
const disconnect_color = "pink"          // available colors: red,blue,green,yellow,black,white,bold,none,cyan,magenta,gray,pink
const show_time = true                   //default true


//DO NOT CHANGE
module.exports = {
    room_name,
    room_description,
    room_website,
    room_message_maxLength,
    port,
    Do_not_log,
    new_message_color,
    new_connection_color,
    disconnect_color,
    show_time
}
