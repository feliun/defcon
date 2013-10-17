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

var async = require('async');
var spawn = require('child_process').spawn;

var queue = async.queue(function(task, next) {
    spawn('afplay', [ task.file ], { stdio: 'inherit' }).on('close', next);
})

module.exports = (function() {

    function play(file, next) {
        queue.push({ file: file }, function(err) {
            if (err) console.log(err.message);
        })
        next();
    };

    return {
        play: play
    }

})();