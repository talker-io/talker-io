// Steps of loading preload,test,load,main

function importing() {

    const ora = require('ora');
    const spinner = ora('Please wait').start;

    setTimeout(() => {

        spinner.color = 'gray'
        spinner.text = 'Please wait: importing packages'

        const socket = require('socket');
        const http = require('http').createServer();


        setTimeout(()=>{
            spinner.text = 'Please wait: imported packages'
            spinner.color = 'green'
        },500)
    },1000)



}

function preload() {}

function test() {}
function load() {}
function main() {}



importing()