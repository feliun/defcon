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

defconApp.controller('SystemCtrl', function SystemCtrl($scope, $http, $timeout, $modal) {

    $scope.open = function(system) {
        var modalInstance = $modal.open({
            templateUrl: '/templates/systemModalTemplate.html',
            controller: SystemModalInstanceCtrl,
            resolve: {
                system: function() {
                    return _.clone(system);
                }
            }
        });

        modalInstance.result.then(function(selectedItem) {
            refresh();
        });        
    }

    $scope.remove = function(event, system) {
        event.stopPropagation();
        event.preventDefault();
        $http.delete(system.url).success(function(data) {
            refresh();
        }).error(function(text) {
            $scope.message(text, 'danger');
        })
    }

    function refresh() {
        $http.get($scope.api.v1.system).success(function(data) {
            $scope.systems = data;
        });
    }

    refresh();
});

