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

defconApp.controller('AlertCtrl', function AlertCtrl($scope, $http, $timeout) {

    (function update() {
        $timeout(update, 1000);
        refresh();
    }());

    $scope.remove = function(index) {
        var alert = $scope.alerts[index];
        $http.delete(alert.url).success(function(data) {
            $scope.alerts.splice(index, 1);
        })
    }

    function refresh() {
        $http.get('alert').success(function(data) {
            $scope.alerts = data;
        });
    }

    refresh();
});

