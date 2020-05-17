const ora = require('ora');
const spinner = ora('Starting talker.io server').start();
spinner.color = "cyan"

const config = require('./server_settings.js');
const http = require('http').createServer();
const logger = require('./modules/talker_logger')
const io = require('socket.io')(http);
const myip = require('my-ip');
const ip = (myip(null, true));

io.on('connection', (socket) => {
    logger.message('Connected', 'green');

    socket.on('message', (evt) => {
        logger.message_nl(evt, 'cyan')
        socket.broadcast.emit('message', evt)
    })
})

io.on('disconnect', (evt) => {
    logger.message('Disconnected', 'pink')
})
setTimeout(()=>{
    http.listen(config.port, () => {
        spinner.stop();
        logger.message_nl(`Server listening on ${ip}:${config.port}`, 'green')
    })
},1000)
