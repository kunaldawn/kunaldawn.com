var app = angular.module('profileApp', ['angular-loading-bar', 'ngAnimate']);

app.controller('ProfileCtrl', ['$scope', '$http', function($scope, $http){
    $scope.data = [];
    $scope.content = [];
    $scope.copyright = [];
    $scope.name = "";
    $scope.selectedPage = 0;

    $scope.loadPage = function(page, index) {
      $('#collapse-1').removeClass('in');
      $scope.selectedPage = index;
      $scope.content = page;
    };

    $http.get('contents.json').then(function(res) {
        $scope.data = res.data;
        $scope.name = $scope.data.name;
        angular.forEach($scope.data.pages, function(page) {
            if (page.default) {
                $scope.loadPage(page, 0)
            }
        });
        $scope.copyright = $scope.data.copyright;
    });

}]);

app.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeBar = true;
    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.latencyThreshold = 0;
  }
])

app.config(function($sceProvider) {
  $sceProvider.enabled(false);
});