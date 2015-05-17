var app = angular.module('profileApp', ['ngMaterial', 'ngSanitize', 'youtube-embed']);

app.controller('ProfileCtrl', ['$scope', '$mdSidenav', '$http', '$timeout', '$mdMedia', function($scope, $mdSidenav, $http, $timeout, $mdMedia){
    $scope.data = [];
    $scope.content = [];
    $scope.loading = true;
    $scope.copyright = [];
    $scope.name = "";
    $scope.showMenu = false;
    $scope.smallScreen = false;

    $scope.$watch(function() { return $mdMedia('sm'); }, function(small) {
      $scope.smallScreen = small;
    });

    $http.get('contents.json').then(function(res){
        $scope.data = res.data;
        $scope.name = $scope.data.name;
        angular.forEach($scope.data.pages, function(page) {
            if (page.default) {
                $scope.content = page;
            }
        });
        $scope.copyright = $scope.data.copyright;
        $timeout(function() {
            $scope.loading = false;
        }, 3000);
    });

    $scope.toggleSidenav = function(menuId) {
      if (!($scope.showMenu || $scope.loading) || $scope.smallScreen) {
        $mdSidenav(menuId).toggle();
      }
    };

    $scope.loadPage = function(page) {
        $scope.toggleSidenav('left');
        $scope.content = page;
    };

}]);

app.provider('markdownConverter', function () {
    var opts = {};
    return {
      config: function (newOpts) {
        opts = newOpts;
      },
      $get: function () {
        return new Showdown.converter(opts);
      }
    };
});

app.directive('markdown', ['$sanitize', 'markdownConverter', function ($sanitize, markdownConverter) {
    return {
      restrict: 'AE',
      link: function (scope, element, attrs) {
        if (attrs.btfMarkdown) {
          scope.$watch(attrs.btfMarkdown, function (newVal) {
            var html = newVal ? $sanitize(markdownConverter.makeHtml(newVal)) : '';
            element.html(html);
          });
        } else {
          var html = $sanitize(markdownConverter.makeHtml(element.text()));
          element.html(html);
        }
      }
    };
}]);

app.config(['markdownConverterProvider', function (markdownConverterProvider) {
  markdownConverterProvider.config({
    extensions: ['github']
  });
}]);
