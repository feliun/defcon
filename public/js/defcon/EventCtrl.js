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

defconApp.controller('EventCtrl', function EventCtrl($scope, $modal, $http, $timeout) {

    var nextRefresh;

    (function update() {
        nextRefresh = $timeout(update, 5000);
        refresh();
    }());

    $scope.open = function() {
        var modalInstance = $modal.open({
            templateUrl: '/templates/eventModalTemplate.html',
            controller: EventModalInstanceCtrl,         
        });

        modalInstance.result.then(function(selectedItem) {
            refresh();
        });        
    }

    $scope.handleClick = function($event, event) {
        if ($event.target.classList.contains('remove-btn') || $event.target.parentNode.classList.contains('remove-btn')) {
            $http.delete(event.url).success(function() {
                refresh();
            }).error(function(text) {
                $scope.message(text, 'danger');
            })
        };
    }

    $scope.$on('$destroy', function() {
        $timeout.cancel(nextRefresh); 
    });

    function refresh() {
        $http.get($scope.api.v1.event).success(function(events) {
            $scope.events = _.map(events, function(event) {
                return _.extend(event, { timeago: moment(event.date).fromNow(), formattedDate: moment(event.date).format('MMM D YYYY, h:mm:ss a') });
            });
        });
    }

    refresh();
});

