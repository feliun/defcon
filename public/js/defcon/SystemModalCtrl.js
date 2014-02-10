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

var SystemModalInstanceCtrl = function($scope, $modalInstance, $http, system) {

    $scope.system = system;
    $scope.messages = [];

    $scope.ok = function(system) {
        var save = system && system.url ? update : create;
        save(system).success(function(data) {
            $modalInstance.close(system);
        }).error(function(text) {
            $scope.message(text, 'danger');
        })
    }

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    }

    function update(system) {
        return $http.put(system.url, system);
    }

    function create(system) {
        return $http.post($scope.api.v1.system, system);
    }

    $scope.message = function(text, type) {
        $scope.messages = [{ text: text || 'An unexpected error occurred', type: type || 'error' }];
    }

    $scope.closeMessage = function(index) {
        $scope.messages.splice(index, 1);
    }   
};