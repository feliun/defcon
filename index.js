/*
 * Copyright 2010 Acuminous Ltd
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var colors = require('colors');
var async = require('async');
var entity = require('./lib/entity')
var server = require('./lib/server');
var quote = require('./lib/quotes');

var argv = require('optimist')
    .usage('Usage: $0 -h [host] -p [port] -mh [mongodb host] -mp [mongodb port]')
    .alias('h', 'host').demand('h').default('h', '0.0.0.0')
    .alias('p', 'port').demand('p').default('p', 8080)
    .alias('mh', 'mongo').demand('mh').default('mh', 'localhost')
    .demand('mp').default('mp', 27017)
    .argv;

var tasks = [
    entity.connect.bind(entity, argv.mh, argv.mp),
    server.listen.bind(server, argv.p, argv.h)
];

async.series(tasks, function(err) {
    if (err) throw err;
    console.log("Joshua: %s is listening on %s:%s.", "DEFCON".cyan, argv.h.green, ("" + argv.p).green);
    console.log("Joshua:", quote.grey);
})
