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

defconApp.controller('SystemCtrl', function SystemCtrl($scope, $http) {

    $scope.systems = [
        { name: 'CFE App',  theme: 'Star Wars', severity: 1, info: 'http://blah.com', url: 'deleteme' },
        { name: 'CFE Build',  theme: 'Star Wars', severity: 2, info: 'http://blah.com', url: 'deleteme'  },
        { name: 'FFF App',  theme: 'Scooby Doo', severity: 3, info: 'http://blah.com', url: 'deleteme'  },
        { name: 'MolAds App',  theme: 'Wargames', severity: 4, info: 'http://blah.com', url: 'deleteme'  },
        { name: 'MolAds Build',  theme: 'Wargames', severity: 5, info: 'http://blah.com', url: 'deleteme'  },
        { name: 'CFE App',  theme: 'Star Wars', severity: 1, info: 'http://blah.com', url: 'deleteme' },
        { name: 'CFE Build',  theme: 'Star Wars', severity: 2, info: 'http://blah.com', url: 'deleteme'  },
        { name: 'FFF App',  theme: 'Scooby Doo', severity: 3, info: 'http://blah.com', url: 'deleteme'  },
        { name: 'MolAds App',  theme: 'Wargames', severity: 4, info: 'http://blah.com', url: 'deleteme'  },
        { name: 'MolAds Build',  theme: 'Wargames', severity: 5, info: 'http://blah.com', url: 'deleteme'  },
        { name: 'CFE App',  theme: 'Star Wars', severity: 1, info: 'http://blah.com', url: 'deleteme' },
        { name: 'CFE Build',  theme: 'Star Wars', severity: 2, info: 'http://blah.com', url: 'deleteme'  },
        { name: 'FFF App',  theme: 'Scooby Doo', severity: 3, info: 'http://blah.com', url: 'deleteme'  },
        { name: 'MolAds App',  theme: 'Wargames', severity: 4, info: 'http://blah.com', url: 'deleteme'  },
        { name: 'MolAds Build',  theme: 'Wargames', severity: 5, info: 'http://blah.com', url: 'deleteme'  },
        { name: 'CFE App',  theme: 'Star Wars', severity: 1, info: 'http://blah.com', url: 'deleteme' },
        { name: 'CFE Build',  theme: 'Star Wars', severity: 2, info: 'http://blah.com', url: 'deleteme'  },
        { name: 'FFF App',  theme: 'Scooby Doo', severity: 3, info: 'http://blah.com', url: 'deleteme'  },
        { name: 'MolAds App',  theme: 'Wargames', severity: 4, info: 'http://blah.com', url: 'deleteme'  },
        { name: 'MolAds Build',  theme: 'Wargames', severity: 5, info: 'http://blah.com', url: 'deleteme'  },
        { name: 'CFE App',  theme: 'Star Wars', severity: 1, info: 'http://blah.com', url: 'deleteme' },
        { name: 'CFE Build',  theme: 'Star Wars', severity: 2, info: 'http://blah.com', url: 'deleteme'  },
        { name: 'FFF App',  theme: 'Scooby Doo', severity: 3, info: 'http://blah.com', url: 'deleteme'  },
        { name: 'MolAds App',  theme: 'Wargames', severity: 4, info: 'http://blah.com', url: 'deleteme'  },
        { name: 'MolAds Build',  theme: 'Wargames', severity: 5, info: 'http://blah.com', url: 'deleteme'  },
        { name: 'CFE App',  theme: 'Star Wars', severity: 1, info: 'http://blah.com', url: 'deleteme' },
        { name: 'CFE Build',  theme: 'Star Wars', severity: 2, info: 'http://blah.com', url: 'deleteme'  },
        { name: 'FFF App',  theme: 'Scooby Doo', severity: 3, info: 'http://blah.com', url: 'deleteme'  },
        { name: 'MolAds App',  theme: 'Wargames', severity: 4, info: 'http://blah.com', url: 'deleteme'  },
        { name: 'MolAds Build',  theme: 'Wargames', severity: 5, info: 'http://blah.com', url: 'deleteme'  },
        { name: 'CFE App',  theme: 'Star Wars', severity: 1, info: 'http://blah.com', url: 'deleteme' },
        { name: 'CFE Build',  theme: 'Star Wars', severity: 2, info: 'http://blah.com', url: 'deleteme'  },
        { name: 'FFF App',  theme: 'Scooby Doo', severity: 3, info: 'http://blah.com', url: 'deleteme'  },
        { name: 'MolAds App',  theme: 'Wargames', severity: 4, info: 'http://blah.com', url: 'deleteme'  },
        { name: 'MolAds Build',  theme: 'Wargames', severity: 5, info: 'http://blah.com', url: 'deleteme'  },
        { name: 'CFE App',  theme: 'Star Wars', severity: 1, info: 'http://blah.com', url: 'deleteme' },
        { name: 'CFE Build',  theme: 'Star Wars', severity: 2, info: 'http://blah.com', url: 'deleteme'  },
        { name: 'FFF App',  theme: 'Scooby Doo', severity: 3, info: 'http://blah.com', url: 'deleteme'  },
        { name: 'MolAds App',  theme: 'Wargames', severity: 4, info: 'http://blah.com', url: 'deleteme'  },
        { name: 'MolAds Build',  theme: 'Wargames', severity: 5, info: 'http://blah.com', url: 'deleteme'  },
        { name: 'CFE App',  theme: 'Star Wars', severity: 1, info: 'http://blah.com', url: 'deleteme' },
        { name: 'CFE Build',  theme: 'Star Wars', severity: 2, info: 'http://blah.com', url: 'deleteme'  },
        { name: 'FFF App',  theme: 'Scooby Doo', severity: 3, info: 'http://blah.com', url: 'deleteme'  },
        { name: 'MolAds App',  theme: 'Wargames', severity: 4, info: 'http://blah.com', url: 'deleteme'  },
        { name: 'MolAds Build',  theme: 'Wargames', severity: 5, info: 'http://blah.com', url: 'deleteme'  }
    ]

    $scope.remove = function(index) {
        var system = $scope.systems[index];
        $http.delete(systems.url).success(function(data) {
            $scope.systems.splice(index, 1);
        })
    }

    $scope.play = function(sample) {
    }

    $scope.orderProp = 'name';
});

