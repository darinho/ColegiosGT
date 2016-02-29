/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


colegios.controller('ctrlLicenceType', ['$scope', '$mdDialog', '$mdMedia', '$licenceType', function ($scope, $mdDialog, $mdMedia, $licenceType) {

        var bookmark;

        $scope.selected = [];
        $scope.title = "licenceType.title";
        $scope.filter = {
            options: {
                debounce: 500
            }
        };

        $scope.query = {
            order: 'txtDescription',
            limit: 10,
            page: 1
        };

        function getLicencesType(query) {
            $scope.promise = $licenceType.getAll(query).then(function (data) {
                $scope.selected = [];
                $scope.licencesType = data;
            });
        }

        $scope.onPaginate = function (page, limit) {
            getLicencesType(angular.extend({}, $scope.query, {page: page, limit: limit}));
        };

        $scope.onReorder = function (order) {
            getLicencesType(angular.extend({}, $scope.query, {order: order}));
        };


        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        $scope.addNew = function (ev, dta) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            $mdDialog.show({
                controller: 'ctrlAddLicenceType',
                templateUrl: 'pvpages/admin/licenceType/newLicenceType.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: {
                    dataUp: dta
                },
                clickOutsideToClose: false,
                fullscreen: useFullScreen
            }).then(function (answer) {
                getLicencesType($scope.query);
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
                controller: 'ctrlDelLicenceType',
                controllerAs: 'ctrl',
                focusOnOpen: false,
                targetEvent: event,
                locals: {licencesType: $scope.selected},
                templateUrl: 'templates/delete-dialog.html'
            }).then(getLicencesType);
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
        getLicencesType($scope.query);

    }]);

colegios.controller('ctrlDelProfile', ['$mdDialog', '$scope', function ($mdDialog, $scope) {
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

colegios.controller('ctrlAddLicenceType', ['$scope', '$mdDialog', '$licenceType', 'dataUp', '$filter', function ($scope, $mdDialog, $licenceType, dataUp, $filter) {
        if (dataUp) {
            $scope.title = "licenceType.edit";
            $scope.editing = "md-editing-cl";
            $scope.licenceType = angular.copy(dataUp);
        } else {
            $scope.title = "licenceType.new";
        }

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        $scope.saved = function () {
            $scope.loadingBar = true;
            if ($scope.editing) {
                $licenceType.update($scope.licenceType).success(function (data) {
                    $scope.loadingBar = false;
                    $mdDialog.hide(data);
                }).error(function (data) {
                    $scope.loadingBar = false;
                });
            } else {
                $licenceType.create($scope.licenceType).success(function (data) {
                    $scope.loadingBar = false;
                    $mdDialog.hide(data);
                }).error(function (data) {
                    $scope.loadingBar = false;
                });
            }
        };
    }]);
