if (require.main === module){
    console.log("Please edit othersettings.js to change other settings\nrunning this file wont do anything")
}

//logger settings

const Do_not_log = false                 // default false
const new_message_color = "cyan"         // available colors: red,blue,green,yellow,black,white,bold,none,cyan,magenta,gray,pink
const new_connection_color = "green"     // available colors: red,blue,green,yellow,black,white,bold,none,cyan,magenta,gray,pink
const disconnect_color = "pink"          // available colors: red,blue,green,yellow,black,white,bold,none,cyan,magenta,gray,pink
const api_request_color = "blue"         // available colors: red,blue,green,yellow,black,white,bold,none,cyan,magenta,gray,pink
const show_time = true                   //default true

module.exports = {
    Do_not_log,
    new_message_color,
    new_connection_color,
    disconnect_color,
    api_request_color,
    show_time
}
