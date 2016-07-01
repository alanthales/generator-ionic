angular.module('<%= appName %>.<%= moduleName %>', [])
.directive('<%= directiveName %>', function() {
    return {
        restrict: 'AE',
        template: '<strong><%= directiveName %></strong>'
    }
});