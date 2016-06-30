angular.module('<%= appName %>.<%= moduleName %>', [])
.controller('<%= controllerName %>', function($scope, $timeout, $state) {
    $scope.loginData = {};
    
    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
            $state.go('app.home');
        }, 1000);
    };
});