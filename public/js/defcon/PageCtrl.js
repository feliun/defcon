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

defconApp.controller('PageCtrl', function PageCtrl($scope, $rootScope, $http) {

    $scope.tabs = {
        events: { template: 'eventTemplate.html' },
        systems: { template: 'systemTemplate.html' },
        samples: { template: 'sampleTemplate.html' }
    }
    $scope.currentTab = $scope.tabs.events;
    $scope.messages = [];

    $http.get('/api').success(function(api) {
        $rootScope.api = api;
    });

    $scope.activate = function(event, tab) {
        $scope.currentTab = $scope.tabs[tab];
        event.stopPropagation();
        event.preventDefault();
    }

    $scope.isActive = function(tab) {
        return $scope.currentTab === $scope.tabs[tab];
    }

    $scope.message = function(text, type) {
        $scope.messages = [{ text: text || 'An unexpected error occurred', type: type || 'error' }];
    }

    $scope.closeMessage = function(index) {
        $scope.messages.splice(index, 1);
    }
})