  .state('app.<%= moduleName %>', {
    url: '/<%= moduleName %>',
    views: {
      'pageContent': {
        templateUrl: '<%= template %>',
        controller: '<%= controllerName %>'
      }
    }
  })