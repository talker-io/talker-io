## **talker-io (server)**
Software for talker-io server powered by socket io.


## How to use
You can run the server by going into the server folder and running server_run.js
with the command `node server_run.js`.

## configuring
There are two configuration files named other_settings and server_settings.
The server_settings.js file contains the information about your server.
The other_settings.js file contains other settings
These files can be edited with any text editor to change the settings

SERVER SETTINGS(server_settings.js)

[1. room_name](#1-room_name)

[2. room_description](#2-room_description)

[3. room_website](#3-room_website)

[4. room_message_maxlength](#4-room_message_maxlength)

[5. room_port](#5-room_port)



LOGGER SETTINGS(other_settings.js)

[1. Do_not_log](#6-do_not_log)

[2. new_message_color](#7-new_messgae_color)

[3. disconnect_color](#8-disconnect_color)

[4. show_time](#9-show_time)



#### (1. room_name)
Name of your room that will be displayed to everyone who joins.
This cannot be empty.



#### (2. room_description)
Description of your room that will be displayed to everyone who joins.
This can be empty.



#### (3. room_website)
The website that you want to display to users.
This can be empty.



#### (4. room_port)
The port the server will run.
This cannot be empty.
Recommend - 8080  



#### (5. Do_not_log)
When enabled some messages will not be logged
This can be either true or false
Default - false
 
 
 
#### (6. new_message_color)
The color that will be used when logging messages.
This can be red,blue,green,yellow,black.white.bold,none,cyan,magenta,gray,pink
Default - cyan



#### (7. new_connection_color)
The color that will be used when logging connections.
This can be red,blue,green,yellow,black.white.bold,none,cyan,magenta,gray,pink
Default - green



#### (8. disconnect_color)
The color that will be used when logging connections.
This can be red,blue,green,yellow,black.white.bold,none,cyan,magenta,gray,pink
Default - red



#### (9. show_time)
When enabled the events time will be showed.
This can be true or false
Default - true


