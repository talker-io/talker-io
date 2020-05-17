
const ora = require('ora');
var spinner = ora("Loading client").start();
spinner.color = "cyan"

setTimeout(()=>{
    spinner.text = "connecting to server"
    var socket = require('socket.io-client')("http://localhost:8080");
    main(socket)
},1000)



const repl = require('repl');
const logger = require('./modules/talker_logger');
var username = null


function main(socket) {
    spinner.stop()
    socket.on('disconnect', function () {
        socket.emit('disconnect')
    });

    socket.on('connect', () => {

        logger.message_nl('\n=== start chatting ===\n', 'blue')
        username = process.argv[2]

    });

    socket.on('message', (data) => {
        const {cmd, username} = data
        logger.message_nl(username + ': ' + cmd.split('\n')[0] + '\n', 'green');
    });

    repl.start({
        prompt: '',
        eval: (cmd) => {
            socket.send({cmd, username})
        }
    });

}