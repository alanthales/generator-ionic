  .state('<%= moduleName %>', {
    url: '/<%= moduleName %>',
    views: {
      'pageContent': {
        templateUrl: '<%= template %>',
        controller: '<%= controllerName %>'
      }
    }
  })