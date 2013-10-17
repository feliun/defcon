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

