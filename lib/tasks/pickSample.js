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

var DEFAULT_SAMPLE = { path: 'samples/buzzer.mp3' };

module.exports = function(context, next) {

    function judgeByRelevance() {
        return context.samples.reduce(function(scoreboard, sample) {
            var score = 0;

            if (sample.severities.indexOf(context.alert.severity) >= 0) score++;
            if (sample.alerts.indexOf(context.alert.type) >= 0) score++;

            return scoreboard.add(sample, score);
        }, new Scoreboard());
    }

    function Scoreboard() {

        var entries = [];
        var highScore;

        this.add = function(item, score) {
            entries.push({ item: item, score: score });
            if (!highScore || score > highScore) highScore = score;
            return this;
        }

        this.getWinners = function() {
            var results = entries.reduce(function(winners, entry) {
                return (entry.score == highScore) ? winners.add(entry.item) : winners;
            }, new Winners());
            return results;
        }
    }

    function Winners() {
        var list = [];
        this.pickOneAtRandom = function() {
            return list[Math.floor(Math.random() * list.length)];
        };
        this.add = function(item) {
            list.push(item);
            return this;
        }
    }

    context.sample = context.samples.length > 0 ? judgeByRelevance().getWinners().pickOneAtRandom() : DEFAULT_SAMPLE;

    next();
}