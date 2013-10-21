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

defconApp.controller('SampleModalCtrl', function SampleModalCtrl($scope, $modal, $http) {

    $scope.lastTheme;

    $scope.open = function () {

        var modalInstance = $modal.open({
            templateUrl: '/templates/sampleModalTemplate.html',
            controller: SampleModalInstanceCtrl,
            resolve: {
                samples: function() {
                    return $scope.samples;
                },
                lastTheme: function() {
                    return $scope.lastTheme;
                }
            }
        })

        function byName(name, theme) {
            if (arguments.length == 1) return byName.bind(name);
            return theme.name == name;
        }
    }
})

var SampleModalInstanceCtrl = function ($scope, $modalInstance, $http, samples) {

    $scope.messages = [];
    $scope.filename;

    $scope.onFileSelect = function($files) {
        $scope.file = $files[0];
        $scope.filename = $scope.file.name;
    }

    $scope.ok = function(sample) {
        var save = sample && sample.url ? update : create;
        save(sample).success(function(data) {
            samples.push(_.extend(sample, data));
            $scope.$apply();
            $modalInstance.close();
        }).error(function(text) {
            $scope.messages = [{ text: text, type:  'danger' }];
            $scope.$apply();
        })
    }

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    }

    function update(sample) {
        return $http.uploadFile({
            url: 'sample',
            method: 'PUT',
            data: sample,
            file: $scope.file
        })
    }

    function create(sample) {
        return $http.uploadFile({
            url: 'sample',
            data: sample,
            file: $scope.file
        })
    }

    $scope.closeMessage = function(index) {
        $scope.messages.splice(index, 1);
    }
};