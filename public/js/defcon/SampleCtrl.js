defconApp.controller('SampleCtrl', function SampleCtrl($scope, $http) {

    $scope.remove = function(index) {
        var sample = $scope.samples[index];
        $http.delete(sample.url).success(function(data) {
            $scope.samples.splice(index, 1);            
        })
    }

    $scope.play = function(sample) {
        $('audio').attr('src', sample.dataUrl)[0].play();
    }

    $http.get('sample').success(function(data) {
        $scope.samples = data;
    });

    $scope.orderProp = 'theme';  
});

