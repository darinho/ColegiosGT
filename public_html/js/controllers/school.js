/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


colegios.controller('ctrlSchool', ['$scope', '$mdDialog', '$mdMedia', '$schools', 'CountryService', '$filter', function ($scope, $mdDialog, $mdMedia, $schools, CountryService, $filter) {
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

        function getSchools(query) {
            $scope.promise = $schools.getAll(query).then(function (data) {
                $scope.selected = [];
                $scope.schools = data;
            });
        }

        $scope.onPaginate = function (page, limit) {
            getSchools(angular.extend({}, $scope.query, {page: page, limit: limit}));
        };

        $scope.onReorder = function (order) {
            getSchools(angular.extend({}, $scope.query, {order: order}));
        };


        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        $scope.addNew = function (ev, dta) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            $mdDialog.show({
                controller: 'ctrlAddSchool',
                templateUrl: 'pvpages/admin/school/newSchool.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: {
                    pScope: $scope,
                    dataUp: dta
                },
                clickOutsideToClose: false,
                fullscreen: useFullScreen
            }).then(function (answer) {
                getSchools($scope.query);
            }, function () {

            });
            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        };

        CountryService.getAll().success(function (data) {
            $scope.loadCountry = true;
            $scope.countries = data;
        }).error(function (data) {

        });

        $scope.edit = function (event) {
            $scope.addNew(event, $scope.selected[0]);
        };

        $scope.delete = function (event) {
            $mdDialog.show({
                clickOutsideToClose: true,
                controller: 'deleteController',
                controllerAs: 'ctrl',
                focusOnOpen: false,
                targetEvent: event,
                locals: {schools: $scope.selected},
                templateUrl: 'templates/delete-dialog.html'
            }).then(getSchools);
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
        getSchools($scope.query);

    }]);

colegios.controller('deleteController', ['$mdDialog', '$scope', function ($mdDialog, $scope) {
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

colegios.controller('ctrlAddSchool', ['$scope', '$mdDialog', '$schools', 'pScope', 'dataUp', '$filter', function ($scope, $mdDialog, $schools, pScope, dataUp, $filter) {
        $scope.country = {states: []};
        $scope.state = {cities: []};
        $scope.school = {address: {}};
        $scope.countries = pScope.countries;
        if (dataUp) {
            $scope.title = "school.edit";
            $scope.editing = "md-editing-cl";
            $scope.school = angular.copy(dataUp);
            var contr = angular.copy($scope.countries);
            $scope.country = $filter('filter')(contr, {idCountry: dataUp.address.city.state.country.idCountry}, true)[0];
            $scope.state = $filter('filter')($scope.country.states, {idState: dataUp.address.city.state.idState}, true)[0];
            $scope.school.address.city = $filter('filter')($scope.state.cities, {idCity: dataUp.address.city.idCity}, true)[0];
            $scope.countri = JSON.stringify($scope.country);
            $scope.stat = JSON.stringify($scope.state);
            $scope.citi = JSON.stringify($scope.school.address.city);
        } else {
            $scope.title = "school.new";
        }

        $scope.$watch('countri', function (val) {
            if (val) {
                $scope.country = JSON.parse(val);
            }
        });
        $scope.$watch('stat', function (val) {
            if (val) {
                $scope.state = JSON.parse(val);
            }
        });
        $scope.$watch('citi', function (val) {
            if (val) {
                $scope.school.address.city = JSON.parse(val);
            }
        });

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        $scope.saved = function () {
            $scope.loadingBar = true;
            if ($scope.editing) {
                $schools.update($scope.school).success(function (data) {
                    $scope.loadingBar = false;
                    $mdDialog.hide(data);
                }).error(function (data) {
                    $scope.loadingBar = false;
                });
            } else {
                $schools.create($scope.school).success(function (data) {
                    $scope.loadingBar = false;
                    $mdDialog.hide(data);
                }).error(function (data) {
                    $scope.loadingBar = false;
                });
            }
        };
    }]);
