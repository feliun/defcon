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

var EventModalInstanceCtrl = function($scope, $modalInstance, $http) {

    $scope.event = {};
    $scope.messages = []; 
    $scope.modal = {
        severities: {}
    }     

    $scope.ok = function(event) {
        create(event).success(function(data) {
            $modalInstance.close(event);
        }).error(function(text) {
            $scope.message(text, 'danger');
        })
    }

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    }

    $scope.setSeverity = function(severity) {
        $scope.event.severity = severity;
    }    

    function create(event) {
        return $http.post($scope.api.v1.event, event);
    }

    $scope.message = function(text, type) {
        $scope.messages = [{ text: text || 'An unexpected error occurred', type: type || 'error' }];
    }

    $scope.closeMessage = function(index) {
        $scope.messages.splice(index, 1);
    }   
};