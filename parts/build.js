/*jslint node: true, regexp: true, nomen: true */
/*global fs: true */
'use strict';

function read(path) {
    return fs.readFileSync(path, 'utf8');
}

function jsEscape(content) {
    return content.replace(/(['"\\])/g, '\\$1')
        .replace(/[\f]/g, "\\f")
        .replace(/[\b]/g, "\\b")
        .replace(/[\n]/g, "\\n")
        .replace(/[\t]/g, "\\t")
        .replace(/[\r]/g, "\\r")
        .replace(/[\u2028]/g, "\\u2028")
        .replace(/[\u2029]/g, "\\u2029");
}

function jsRead(path) {
    return jsEscape(read(path));
}

//Builds the xrayquire.js file by injecting templates into it.
var fs = require('fs'),
    dir = __dirname + '/',
    contents = read(dir + '../xrayquire.js'),

    tree = jsRead(dir + 'templates/tree.html'),
    treeDepItem = jsRead(dir + 'templates/treeDepItem.html'),
    treeDepItemNoLink = jsRead(dir + 'templates/treeDepItemNoLink.html'),
    treeItem = jsRead(dir + 'templates/treeItem.html'),

    cycle = jsRead(dir + 'templates/cycle.html'),
    cycleEntry = jsRead(dir + 'templates/cycleEntry.html'),
    cycleChainEntry = jsRead(dir + 'templates/cycleChainEntry.html');

contents = contents
           .replace(/treeHtml: '.*?',[\r\n]/, "treeHtml: '" + tree + "',\n")
           .replace(/treeDepItemHtml: '.*?',[\r\n]/, "treeDepItemHtml: '" + treeDepItem + "',\n")
           .replace(/treeDepItemNoLinkHtml: '.*?',[\r\n]/, "treeDepItemNoLinkHtml: '" + treeDepItemNoLink + "',\n")
           .replace(/treeItemHtml: '.*?',[\r\n]/, "treeItemHtml: '" + treeItem + "',\n")

           .replace(/cycleHtml: '.*?',[\r\n]/, "cycleHtml: '" + cycle + "',\n")
           .replace(/cycleEntryHtml: '.*?',[\r\n]/, "cycleEntryHtml: '" + cycleEntry + "',\n")
           .replace(/cycleChainEntryHtml: '.*?',[\r\n]/, "cycleChainEntryHtml: '" + cycleChainEntry + "',\n");


fs.writeFileSync(dir + '../xrayquire.js', contents, 'utf8');
