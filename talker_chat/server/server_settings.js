
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
const server_language = ""// if wanted you can enter the language of the server if left empty it will be en




//DO NOT CHANGE
module.exports = {
    server_name,
    server_description,
    server_website,
    server_message_maxLength,
    server_port,
    server_location,
    server_language
}
