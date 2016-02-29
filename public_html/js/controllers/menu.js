/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


colegios.controller('ctrlMenus', ['$scope', '$mdDialog', '$mdMedia', '$menus', function ($scope, $mdDialog, $mdMedia, $menus) {

        var bookmark;

        $scope.selected = [];

        $scope.filter = {
            options: {
                debounce: 500
            }
        };

        $scope.query = {
            order: 'txtName',
            limit: 10,
            page: 1
        };

        function getMenus(query) {
            $scope.promise = $menus.getAll(query).then(function (data) {
                $scope.selected = [];
                $scope.menus = data;
            });
        }

        $scope.onPaginate = function (page, limit) {
            getMenus(angular.extend({}, $scope.query, {page: page, limit: limit}));
        };

        $scope.onReorder = function (order) {
            getMenus(angular.extend({}, $scope.query, {order: order}));
        };


        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        $scope.addNew = function (ev, dta) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            $mdDialog.show({
                controller: 'ctrlAddMenu',
                templateUrl: 'pvpages/admin/menu/newMenu.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: {
                    dataUp: dta
                },
                clickOutsideToClose: false,
                fullscreen: useFullScreen
            }).then(function (answer) {
                getMenus($scope.query);
            }, function () {

            });
            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        };

        $scope.edit = function (event) {
            $scope.addNew(event, $scope.selected[0]);
        };

        $scope.delete = function (event) {
            $mdDialog.show({
                clickOutsideToClose: true,
                controller: 'ctrlDelMenu',
                controllerAs: 'ctrl',
                focusOnOpen: false,
                targetEvent: event,
                locals: {menus: $scope.selected},
                templateUrl: 'templates/delete-dialog.html'
            }).then(getMenus);
        };

        $scope.removeFilter = function () {
            $scope.filter.show = false;
            $scope.query.filter = '';

            if ($scope.filter.form.$dirty) {
                $scope.filter.form.$setPristine();
            }
        };

        $scope.$watch('query.filter', function (newValue, oldValue) {
            if (!oldValue) {
                bookmark = $scope.query.page;
            }

            if (newValue !== oldValue) {
                $scope.query.page = 1;
            }

            if (!newValue) {
                $scope.query.page = bookmark;
            }
        });
        getMenus($scope.query);

    }]);

colegios.controller('ctrlDelMenu', ['$mdDialog', '$scope', function ($mdDialog, $scope) {
        'use strict';

        this.cancel = $mdDialog.cancel;

        function deleteDessert(dessert, index) {
        }

        function onComplete() {
            $mdDialog.hide();
        }

        this.authorizeUser = function () {
        };

    }]);

colegios.controller('ctrlAddMenu', ['$scope', '$mdDialog', '$menus', 'dataUp', '$filter', function ($scope, $mdDialog, $menus, dataUp, $filter) {
        if (dataUp) {
            $scope.title = "menu.edit";
            $scope.editing = "md-editing-cl";
            $scope.menu = angular.copy(dataUp);
        } else {
            $scope.title = "menu.new";
        }

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        $scope.saved = function () {
            $scope.loadingBar = true;
            if ($scope.editing) {
                $menus.update($scope.menu).success(function (data) {
                    $scope.loadingBar = false;
                    $mdDialog.hide(data);
                }).error(function (data) {
                    $scope.loadingBar = false;
                });
            } else {
                $menus.create($scope.menu).success(function (data) {
                    $scope.loadingBar = false;
                    $mdDialog.hide(data);
                }).error(function (data) {
                    $scope.loadingBar = false;
                });
            }
        };
    }]);
