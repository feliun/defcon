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

defconApp.controller('GroupCtrl', function GroupCtrl($scope, $http, $timeout, $modal) {

    $scope.open = function(group) {
        var modalInstance = $modal.open({
            templateUrl: '/templates/groupModalTemplate.html',
            controller: GroupModalInstanceCtrl,
            resolve: {
                group: function() {
                    return group;
                },
                groups: function() {
                    return $scope.groups
                }
            }
        });
    }

    $scope.remove = function(event, group) {
        event.stopPropagation();
        event.preventDefault();
        $http.delete(group.url).success(function(data) {
            $scope.groups = _.without($scope.groups, group);
        }).error(function(text) {
            $scope.message(text, 'danger');
        })
    }

    function refresh() {
        $http.get('group').success(function(data) {
            $scope.groups = data;
        });
    }

    refresh();
});

