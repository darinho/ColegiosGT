/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


colegios.controller('ctrlProfile', ['$scope', '$mdDialog', '$mdMedia', '$profiles', '$menus', function ($scope, $mdDialog, $mdMedia, $profiles, $menus) {

        var bookmark;

        $scope.selected = [];

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

        $menus.getAll(null).success(function (data) {
            $scope.menus = data;
        }).error(function (data) {

        });

        function getProfiles(query) {
            $scope.promise = $profiles.getAll(query).then(function (data) {
                $scope.selected = [];
                $scope.profiles = data;
            });
        }

        $scope.onPaginate = function (page, limit) {
            getProfiles(angular.extend({}, $scope.query, {page: page, limit: limit}));
        };

        $scope.onReorder = function (order) {
            getProfiles(angular.extend({}, $scope.query, {order: order}));
        };

        $scope.configMenus = function (ev, dta) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            $mdDialog.show({
                controller: 'ctrlConfigMenus',
                templateUrl: 'pvpages/admin/profile/menuManage.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: {
                    dataUp: dta,
                    allMenus: $scope.menus
                },
                clickOutsideToClose: false,
                fullscreen: useFullScreen
            }).then(function (answer) {
                getProfiles($scope.query);
            }, function () {

            });
            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        };

        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        $scope.addNew = function (ev, dta) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            $mdDialog.show({
                controller: 'ctrlAddProfile',
                templateUrl: 'pvpages/admin/profile/newProfile.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: {
                    dataUp: dta
                },
                clickOutsideToClose: false,
                fullscreen: useFullScreen
            }).then(function (answer) {
                getProfiles($scope.query);
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
                controller: 'ctrlDelProfile',
                controllerAs: 'ctrl',
                focusOnOpen: false,
                targetEvent: event,
                locals: {profiles: $scope.selected},
                templateUrl: 'templates/delete-dialog.html'
            }).then(getProfiles);
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
        getProfiles($scope.query);

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

colegios.controller('ctrlConfigMenus', ['$scope', '$mdDialog', '$profiles', 'dataUp', 'allMenus', '$filter', 'ivhTreeviewMgr', '$menus', function ($scope, $mdDialog, $profiles, dataUp, allMenus, $filter, ivhTreeviewMgr, $menus) {
        $scope.arbolMenu = [];
        $scope.progresBar = true;
        $menus.getByProfile(dataUp.idProfile).success(function (data) {
            var nivelUno = new jinqJs()
                    .from(allMenus)
                    .where(function (row) {
                        return (row.idParent === 0);
                    })
                    .select();

            nivelUno.forEach(function (n1) {
                var itemsNivel1 = {};

                var nID = n1.idMenu;

                //obtengo los hijos del nivel 1
                var nivelDos = new jinqJs()
                        .from(allMenus)
                        .where(function (row) {
                            return (row.idParent === nID);
                        })
                        .select(function (r) {
                            return({id: r.idMenu, label: $filter('translate')(r.txtName)});
                        });

                if (nivelDos.length > 0) {
                    itemsNivel1 = {
                        id: nID,
                        label: $filter('translate')(n1.txtName),
                        children: nivelDos
                    };
                } else {
                    itemsNivel1 = {
                        id: nID,
                        label: $filter('translate')(n1.txtName)
                    };
                }
                $scope.arbolMenu.push(itemsNivel1);
            });
            var arrSel = new jinqJs()
                    .from(data)
                    .select(function (r) {
                        return({id: r.idMenu});
                    });
            ivhTreeviewMgr.selectEach($scope.arbolMenu, arrSel);
            $scope.progresBar = false;
        }).error(function (data, state) {
            $scope.progresBar = false;
        });

        $scope.getSeleccionados = function (obj, array) {
            for (var i = 0; i < obj.length; i++) {
                if (obj[i].isSelected === true) {
                    if (obj[i].children !== undefined) {
                        if (obj[i].children.length > 0) {
                            array.push(obj[i].id);
                            $scope.getSeleccionados(obj[i].children, array);
                        }
                    } else {
                        array.push(obj[i].id);
                    }
                } else {
                    if (obj[i].children !== undefined) {
                        if (obj[i].children.length > 0) {
                            var count = array.length;
                            $scope.getSeleccionados(obj[i].children, array);
                            if (array.length > count) {
                                array.push(obj[i].id);
                            }
                        }
                    }
                }
            }
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        $scope.saved = function () {
            $scope.loadingBar = true;
            var pantal = [];
            $scope.getSeleccionados($scope.arbolMenu, pantal);
            $profiles.setMenus(dataUp.idProfile, pantal).success(function (data) {
                $scope.loadingBar = false;
                $mdDialog.hide(data);
            }).error(function (data) {
                $scope.loadingBar = false;
            });
        };

        $scope.todasMenu = function () {
            if ($scope.allMenu) {
                ivhTreeviewMgr.selectAll($scope.arbolMenu);
            } else {
                ivhTreeviewMgr.deselectAll($scope.arbolMenu);
            }
        };
    }]);

colegios.controller('ctrlAddProfile', ['$scope', '$mdDialog', '$profiles', 'dataUp', '$filter', function ($scope, $mdDialog, $profiles, dataUp, $filter) {
        if (dataUp) {
            $scope.title = "profile.edit";
            $scope.editing = "md-editing-cl";
            $scope.profile = angular.copy(dataUp);
        } else {
            $scope.title = "profile.new";
        }

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        $scope.saved = function () {
            $scope.loadingBar = true;
            if ($scope.editing) {
                $profiles.update($scope.profile).success(function (data) {
                    $scope.loadingBar = false;
                    $mdDialog.hide(data);
                }).error(function (data) {
                    $scope.loadingBar = false;
                });
            } else {
                $profiles.create($scope.profile).success(function (data) {
                    $scope.loadingBar = false;
                    $mdDialog.hide(data);
                }).error(function (data) {
                    $scope.loadingBar = false;
                });
            }
        };
    }]);
