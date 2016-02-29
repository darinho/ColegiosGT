/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


colegios.controller('ctrlDocumentType', ['$scope', '$mdDialog', '$mdMedia', '$documentsType', function ($scope, $mdDialog, $mdMedia, $documentsType) {

        var bookmark;
        $scope.title = "documentType.title";
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

        function getDocumentsType(query) {
            $scope.promise = $documentsType.getAll(query).then(function (data) {
                $scope.selected = [];
                $scope.documentsType = data;
            });
        }

        $scope.onPaginate = function (page, limit) {
            getDocumentsType(angular.extend({}, $scope.query, {page: page, limit: limit}));
        };

        $scope.onReorder = function (order) {
            getDocumentsType(angular.extend({}, $scope.query, {order: order}));
        };


        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        $scope.addNew = function (ev, dta) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            $mdDialog.show({
                controller: 'ctrlAddDocumentType',
                templateUrl: 'pvpages/admin/documentType/newDocumentType.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: {
                    dataUp: dta
                },
                clickOutsideToClose: false,
                fullscreen: useFullScreen
            }).then(function (answer) {
                getDocumentsType($scope.query);
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
                controller: 'ctrlDelDocumentType',
                controllerAs: 'ctrl',
                focusOnOpen: false,
                targetEvent: event,
                locals: {documentsType: $scope.selected},
                templateUrl: 'templates/delete-dialog.html'
            }).then(getDocumentsType);
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
        getDocumentsType($scope.query);

    }]);

colegios.controller('ctrlDelDocumentType', ['$mdDialog', '$scope', function ($mdDialog, $scope) {
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

colegios.controller('ctrlAddDocumentType', ['$scope', '$mdDialog', '$documentsType', 'dataUp', '$filter', function ($scope, $mdDialog, $documentsType, dataUp, $filter) {
        if (dataUp) {
            $scope.title = "documentType.edit";
            $scope.editing = "md-editing-cl";
            $scope.documentType = angular.copy(dataUp);
        } else {
            $scope.title = "documentType.new";
        }

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        $scope.saved = function () {
            $scope.loadingBar = true;
            if ($scope.editing) {
                $documentsType.update($scope.documentType).success(function (data) {
                    $scope.loadingBar = false;
                    $mdDialog.hide(data);
                }).error(function (data) {
                    $scope.loadingBar = false;
                });
            } else {
                $documentsType.create($scope.documentType).success(function (data) {
                    $scope.loadingBar = false;
                    $mdDialog.hide(data);
                }).error(function (data) {
                    $scope.loadingBar = false;
                });
            }
        };
    }]);
