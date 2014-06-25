angular.module 'ngfast', <[  ngRoute ngfast-main templates  ]>
.config <[$routeProvider]> ++ ($routeProvider) ->
  $routeProvider
    .otherwise do
      redirectTo: '/'