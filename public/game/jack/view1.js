'use strict';

angular.module('myApp.view1', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl' 
        });
    }])
    .controller('View1Ctrl', ['$scope', '$window', function($scope, /*ngrEnvironment, */ $compile /* $window*/ ) {
        $scope.windowWidth = 640;
        $scope.gameHeight = 360;
        $scope.score = 0;
        $scope.lifesCount = 5;

        /*ngrEnvironment.init($('canvas')[0]);
        // optional
        ngrEnvironment.debug($('#debugCanvas')[0]);*/

    }]);
