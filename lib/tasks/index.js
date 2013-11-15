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

var fs = require('fs');
var path = require('path');

function byTask(fileName) {
    if (fileName === 'index.js') return false;
    if (fileName.match(/\.js$/)) return true;
}

fs.readdirSync(__dirname).filter(byTask).forEach(function(fileName) {
    var moduleName = fileName.replace(/\.js$/, '');
    exports[moduleName] = require(path.join(__dirname, fileName));
});