colegios.controller('DashboardController', ['$scope', '$rootScope', '$forum', function ($scope, $rootScope, $forum) {

        $forum.getByUser($rootScope.profileLoad.idUserProfile, 1).success(function (data) {
            $scope.forums = data;
        }).error(function (d) {

        });
        
        $scope.createForum = function(forum){
            
        };
    }]);   