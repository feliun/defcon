defconApp.controller('AlertCtrl', function AlertCtrl($scope, $http, $timeout) {

    (function update() {
        $timeout(update, 1000);
        refresh();
    }());

    $scope.remove = function(index) {
        var alert = $scope.alerts[index];
        $http.delete(alert.url).success(function(data) {
            $scope.alerts.splice(index, 1);
        })
    }

    function refresh() {
        $http.get('alert').success(function(data) {
            $scope.alerts = data;
        });
    }

    refresh();
});

