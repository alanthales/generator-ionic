  .state('<%= route %>', {
    url: '/<%= url %>',
    views: {
      'pageContent': {
        templateUrl: '<%= template %>',
        controller: '<%= controllerName %>'
      }
    }
  })