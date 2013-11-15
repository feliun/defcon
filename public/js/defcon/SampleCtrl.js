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

defconApp.filter('list', function() {
    return function(input) {
        return input.join(',').split(',').join(', ');
    }
})

defconApp.controller('SampleCtrl', function SampleCtrl($scope, $modal, $http) {

    $scope.samples = [];

    $scope.$watch('samples', function() {
        $scope.themes = _.chain($scope.samples).pluck('theme').uniq().map(function(name) {
            return { name: name };
        }).value();
    }, true);

    $scope.byTheme = function(theme) {
        return function(sample) {
            return sample.theme == theme.name;
        }
    };

    $scope.open = function(sample) {

        var modalInstance = $modal.open({
            templateUrl: '/templates/sampleModalTemplate.html',
            controller: SampleModalInstanceCtrl,
            resolve: {
                sample: function() {
                    return sample;
                },
                samples: function() {
                    return $scope.samples;
                }
            }
        })

        function byName(name, theme) {
            if (arguments.length == 1) return byName.bind(name);
            return theme.name == name;
        }
    }

    $scope.remove = function(event, sample) {
        event.stopPropagation();
        event.preventDefault();
        $http.delete(sample.url).success(function() {
            $scope.samples = _.without($scope.samples, sample);
        }).error(function(text) {
            $scope.messages = [{ text: text || 'An unexpected error occurred', type: type || 'error' }];
        })
    }

    $scope.play = function(event, sample) {
        event.stopPropagation();
        event.preventDefault();
        $('audio').attr('src', sample.dataUrl)[0].play();
    }

    function refresh() {
        $http.get('sample').success(function(samples) {
            $scope.samples = samples;
        });
    }

    refresh();
});

