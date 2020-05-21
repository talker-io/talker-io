

 const proceed = {
    type: 'confirm',
    name: 'value',
    message: 'Proceed?',
    initial: true
}
const enter_server_ip ={
    type: 'text',
    name: 'value',
    message: 'Enter the server ip'
}
const enter_server_port ={
    type: 'number',
    name: 'value',
    message: 'Enter server port'
}

module.exports = {
    proceed,
    enter_server_ip,
    enter_server_port

}