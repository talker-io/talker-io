// requirements
const terminal = require('terminal-kit').terminal;

//logger (without new line)
function message(text, color) {

    if (text == undefined) {
        terminal.red("WARNING undefined")
    } else if (color == undefined) {
        terminal.red("WARNING undefined")
    } else if (color === "red") {
        terminal.red(text);
    } else if (color === "blue") {
        terminal.blue(text);
    } else if (color === "green") {
        terminal.green(text);
    } else if (color === "yellow") {
        terminal.yellow(text);
    } else if (color === "black") {
        terminal.black(text);
    } else if (color === "white") {
        terminal.white(text);
    } else if (color === "bold") {
        terminal.bold(text);
    } else if (color === "none") {
        terminal.defaultColor(text);
    } else if (color === "cyan") {
        terminal.cyan(text);
    } else if (color === "magenta") {
        terminal.magenta(text);
    } else if (color === "gray") {
        terminal.gray(text);
    } else if (color === "pink") {
        terminal.red.dim(text)
    } else {
        eventEmitter.emit('logger: unknown error');
    }
}

//logger (with new line)
function message_nl(text, color) {
    text = text + '\n'
    if (text == undefined) {
        terminal.red("WARNING undefined")
    } else if (color == undefined) {
        terminal.red("WARNING undefined")
    } else if (color === "red") {
        terminal.red(text);
    } else if (color === "blue") {
        terminal.blue(text);
    } else if (color === "green") {
        terminal.green(text);
    } else if (color === "yellow") {
        terminal.yellow(text);
    } else if (color === "black") {
        terminal.black(text);
    } else if (color === "white") {
        terminal.white(text);
    } else if (color === "bold") {
        terminal.bold(text);
    } else if (color === "none") {
        terminal.defaultColor(text);
    } else if (color === "cyan") {
        terminal.cyan(text);
    } else if (color === "magenta") {
        terminal.magenta(text);
    } else if (color === "gray") {
        terminal.gray(text);
    } else if (color === "pink") {
        terminal.red.dim(text)
    } else {
        eventEmitter.emit('logger: unknown error');
    }
}

module.exports = {message, message_nl}
