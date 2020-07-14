
if (require.main === module) {
    console.log(`Please go to ${__filename} to change other settings\nrunning this file wont do anything`)
}

/*
 * WARNING: Do not change any settings if you dont know how these work
*/


// talker-io socket settings
const pingTimeout = 5000;
const pingInterval =  25000;
const messageLatency = 0;

// DO NOT CHANGE
module.exports = {
    pingTimeout,
    pingInterval,
    messageLatency
}