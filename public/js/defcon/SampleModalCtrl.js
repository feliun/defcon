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

var SampleModalInstanceCtrl = function($scope, $modalInstance, $http, $upload, sample) {

    $scope.sample = sample || { environments: [], alerts: [], severities: [] };
    $scope.messages = [];
    $scope.modal = {
        environments: toAngularDynamicList($scope.sample.environments),
        alerts: toAngularDynamicList($scope.sample.alerts),
        severities: toToggleButtonMap($scope.sample.severities)
    }

    function toAngularDynamicList(input) {
        return _.map(input.concat(''), function(item) {
            return { name: item };
        });
    }

    function fromAngularDynamicList(input) {
        var names = _.pluck(input, 'name').join(',').split(',');
        return _.chain(names).map(function(name) {
            return name.trim();
        }).compact().uniq().value();
    }

    function toToggleButtonMap(input) {
        return _.reduce(input, function(memo, item) {
            memo[item] = true;
            return memo;
        }, {});
    }

    function fromToggleButtonMap(input) {
        return _.reduce(input, function(memo, value, key) {
            return value ? memo.concat(key) : memo;
        }, []);
    }

    $scope.blur = function($event) {
        $($event.target).blur();
    }

    $scope.onFileSelect = function($files) {
        $scope.file = $files[0];
        $scope.filename = $scope.file.name;
    }

    $scope.addEnvironment = function(sample) {
        $scope.modal.environments.push({ name: '' });
    }

    $scope.removeEnvironment = function($index) {
        $scope.modal.environments.splice($index, 1);
    };

    $scope.addAlert = function() {
        $scope.modal.alerts.push({ name: '' });
    }

    $scope.removeAlert = function($index) {
        $scope.modal.alerts.splice($index, 1);
    };

    $scope.ok = function(sample) {
        sample.environments = fromAngularDynamicList($scope.modal.environments);
        $scope.modal.environments = toAngularDynamicList(sample.environments);
        sample.alerts = fromAngularDynamicList($scope.modal.alerts);
        $scope.modal.alerts = toAngularDynamicList(sample.alerts);

        sample.severities = fromToggleButtonMap($scope.modal.severities);
        $scope.modal.severities = toToggleButtonMap(sample.severities);

        var save = sample && sample.url ? update : create;
        save(sample).success(function(data) {
            $modalInstance.close();
        }).error(function(text) {
            $scope.messages = [{ text: text, type:  'danger' }];
        })
    }

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    }

    function update(sample) {
        if (!$scope.file) return $http.put(sample.url, sample);
        return $upload.upload({
            url: sample.url,
            method: 'PUT',
            data: sample,
            formDataAppender: formDataAppender,                                
            file: $scope.file
        })
    }

    function create(sample) {
        return $upload.upload({
            url: 'sample',
            data: sample,   
            formDataAppender: formDataAppender,                    
            file: $scope.file
        })
    }

    function formDataAppender(data, key, value) {        
        if (angular.isArray(value)) {
            angular.forEach(value, function(v) {
                data.append(key, v);
            });
        } else {
            data.append(key, value);
        }                
    }

    $scope.closeMessage = function(index) {
        $scope.messages.splice(index, 1);
    }
};