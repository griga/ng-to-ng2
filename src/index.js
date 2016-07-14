"use strict";

const converter = require('./converter')

const path = require('path')
const fs = require('fs')

let argv = {}

process.argv.slice(2).forEach(it => {
    let argMeta = it.split('=')
    argv[argMeta[0].replace(/^--?/, '')] = argMeta[1]
});

let filepath = argv.path || argv.p;
if (!filepath) {
    throw new Error('--path argument required')
}

console.log('open', filepath);
let raw = fs.readFileSync(filepath, 'utf8');

console.log('process', filepath);
let converted = converter.process(raw);

console.log('process', filepath);


if (argv.replace || argv.r) {
    console.log('save to same file', filepath);
    fs.writeFileSync(filepath, converted)
} else {
    let parse = path.parse(filepath);

    let sfx = argv.sfx || argv.s || 'out';
    filepath = parse.dir + '/' + parse.name + '.' + sfx + parse.ext;
    console.log('save to new file', filepath);

    fs.writeFileSync(filepath, converted)
}

// console.log(converted)

