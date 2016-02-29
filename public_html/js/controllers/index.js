/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


colegios.controller('IndexController', ['$rootScope', '$scope', '$translate', '$state', 'UsService', '$cookies', '$mdDialog', function ($rootScope, $scope, $translate, $state, UsService, $cookies, $mdDialog) {

        var ses;
        if ($cookies.getObject('SesionCollege') && $cookies.getObject('SesionCollege') !== "") {
            ses = $cookies.getObject('SesionCollege');
            $rootScope.user = ses.user;
            $rootScope.profileLoad = ses.userProfile;
        } else {
            $state.go('access.signin');
        }
        if ($cookies.getObject('prof')) {
            $rootScope.profileLoad = $cookies.getObject('prof');
        } else {
            $state.go('access.signin');
        }
        if ($cookies.getObject('m')) {
            $rootScope.menu = $cookies.getObject('m');
        } else {
            $state.go('access.signin');
        }
        $scope.lg = {user: '', pwd: ''};

        $scope.logout = function () {
            if ($cookies.getObject('SesionCollege')) {
                UsService.usuarioLogout($cookies.getObject('SesionCollege'));
            }
            $cookies.remove('SesionCollege');
            $cookies.remove('prof');
            $cookies.remove('m');
            $rootScope.user = null;
            ses = null;
            $rootScope.menu = [];
            $rootScope.profilesU = [];
            $rootScope.islogin = false;
            $state.go('access.signin');
        };

        $scope.upImage = function (ev) {
            $mdDialog.show({
                controller: 'UploadImageUserController',
                templateUrl: 'pvpages/admin/user/imageUpload.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: {
                    pScope: $scope
                },
                clickOutsideToClose: false
            }).then(function (answer) {
            }, function () {

            });
        };

        $scope.getImgUri = function () {
            return $rootScope.user.txtImageURI ? $rootScope.user.txtImageURI + 'imgt.jpg' : 'img/thumb.png';
        };

        $rootScope.menu = ($rootScope.menu && $rootScope.menu.length > 0) ? $rootScope.menu : [{
                idMenu: 1,
                txtName: 'Generales',
                idParent: 0,
                txtLink: ""
            },
            {
                idMenu: 2,
                txtName: 'Colegios',
                idParent: 1,
                txtIcon: "mdi-social-school",
                txtLink: "app.school"
            },
            {
                idMenu: 3,
                txtName: 'Perfiles',
                idParent: 1,
                txtIcon: "mdi-social-people",
                txtLink: "app.profile"
            },
            {
                idMenu: 4,
                txtName: 'Tipos de Documentos',
                idParent: 1,
                txtIcon: "mdi-action-assignment-ind",
                txtLink: "app.documentType"
            },
            {
                idMenu: 5,
                txtName: 'Tipos de Licencias',
                idParent: 1,
                txtIcon: "mdi-communication-vpn-key",
                txtLink: "app.licenceType"
            },
            {
                idMenu: 6,
                txtName: 'Usuarios',
                idParent: 1,
                txtIcon: "mdi-social-person",
                txtLink: "app.user"
            },
            {
                idMenu: 7,
                txtName: 'Menu',
                idParent: 1,
                txtIcon: "mdi-action-view-module",
                txtLink: "app.menu"
            }
        ];
    }]);

colegios.controller('ctrlSelectProfile', ['$scope', 'pScope', 'profiles', '$mdDialog', function ($scope, pScope, profiles, $mdDialog) {
        $scope.profiles = profiles;

        $scope.select = function (prof) {
            $mdDialog.hide(prof);
        };
    }]);


colegios.controller('UploadImageUserController', ['$scope', '$rootScope', 'WSServerCon', 'Upload', '$mdDialog', function ($scope, $rootScope, WSServerCon, Upload, $mdDialog) {

        var path = "user/";

        function getUrl() {
            return WSServerCon + path;
        }

        $scope.$watch('files', function () {
            $scope.upload($scope.files);
        });
        $scope.log = '';

        $scope.upload = function (files) {
            if (files && files.length > 0) {
                var file = files[0];
                $scope.file = file;
                if (file && !file.$error) {
                    Upload.upload({
                        url: getUrl() + $rootScope.user.idUser + '/uploadimage',
                        file: file
                    }).progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                    }).success(function (data, status, headers, config) {
                        $rootScope.user.txtImageURI = data;
                        $mdDialog.hide();
                    });
                }
            }
        };
    }]);

colegios.controller('LoginController', ['$rootScope', '$scope', 'UsService', '$pantalla', '$state', '$translate', '$filter', '$localStorage', '$cookies', '$mdMedia', '$mdDialog', function ($rootScope, $scope, UsService, $pantalla, $state, $translate, $filter, $localStorage, $cookies, $mdMedia, $mdDialog) {

        var ses;
        $rootScope.menu = [];
        $rootScope.profilesU = [];

        $scope.$storage = $localStorage.$default({
            sTkMP: ""
        });

        $scope.credentials = {password: '', email: ''};
        var isLogin = false;
        if ($cookies.getObject('SesionCollege')) {
            ses = $cookies.getObject('SesionCollege');
            UsService.validSesion().success(function (resultU) {
                var data = resultU;
                $rootScope.user = data.user;
                var user = data.user;
                data.idUser = user.idUser;
                data.sUser = user.txtUser;
                ses = data;
                if (user.snChangePwd) {
                    $rootScope.profilesU = [];
                    $rootScope.menu = [];
                    $rootScope.islogin = true;
                    $state.go('/perfilUser');
                } else {
                    loadMenu(data);
                }
            }).error(function () {
                $scope.logout();
            });
        }

        var loadMenu = function (data) {
            $rootScope.profilesU = data.userProfiles;
            if (data.userProfile) {
                $rootScope.profileLoad = data.userProfile;
                $cookies.putObject('prof', data.userProfile);
                delete data.userProfile;
                $cookies.putObject('SesionCollege', data);
                getMenusRemote();
            } else if ($rootScope.profilesU.length > 1) {
                var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
                $mdDialog.show({
                    controller: 'ctrlSelectProfile',
                    templateUrl: 'pvpages/selectProfile.html',
                    parent: angular.element(document.body),
                    locals: {
                        pScope: $scope,
                        profiles: $rootScope.profilesU
                    },
                    clickOutsideToClose: false,
                    fullscreen: useFullScreen
                }).then(function (answer) {
                    $rootScope.profileLoad = answer;
                    $cookies.putObject('prof', answer);
                    delete data.userProfiles;
                    delete data.userProfile;
                    $cookies.putObject('SesionCollege', data);
                    getMenusRemote();
                }, function () {

                });
                $scope.$watch(function () {
                    return $mdMedia('xs') || $mdMedia('sm');
                }, function (wantsFullScreen) {
                    $scope.customFullscreen = (wantsFullScreen === true);
                });
            }
        };
        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
        $scope.forgetPass = function (model) {
            $scope.labelPassRequired = $filter('translate')('login.passRequired');
            $scope.labelUserRequired = $filter('translate')('login.userRequired');
            if ($scope.loginForm.usernam.$valid) {

                UsService.forgetMyPass(model.user, $scope.lan).success(function (result) {
                    $scope.notf1.show({message: $filter('translate')(result)}, "success");
                }).error(function (result, status) {
                    $scope.notf1.show({message: $filter('translate')(result)}, "error");
                });
            } else {
                $scope.loginForm.submitted = true;
            }
        };

        function getMenusRemote() {
            if ($rootScope.menu.length === 0) {
                $pantalla.pantallaByUserHtml($rootScope.profileLoad.profile.idProfile).then(function (result) {
                    $rootScope.menu = result.data;
                    $cookies.putObject('m', result.data);
                    $scope.validaInicio();
                });
            } else {
                $scope.validaInicio();
            }
        }

        $scope.checkEnter = function (event) {
            if (event.keyCode === 13) {
                $scope.login($scope.model);
                return false;
            }
        };
        $scope.validaInicio = function () {
            $state.go('app.dashboard-v3');
        };

        $scope.login = function () {
            if ($scope.loginForm.$valid) {
                UsService.login($scope.credentials).success(function (resultU) {
                    delete $scope.authError;
                    var data = resultU;
                    $rootScope.user = data.user;
                    var user = data.user;
                    data.idUser = user.idUser;
                    data.sUser = user.txtUser;
                    ses = data;
                    $scope.credentials.password = '';
                    $scope.credentials.email = '';
                    if (user.snChangePwd) {
                        $rootScope.profilesU = [];
                        $rootScope.menu = [];
                        $rootScope.islogin = true;
                        //document.getElementById('divMain').hidden = false;
                        $state.go('/perfilUser');
                    } else {
                        loadMenu(data);
                    }
                }).error(function (data, status) {
                    switch (status) {
                        case 400:
                            $scope.credentials.password = '';
                            $scope.authError = $filter('translate')('login.userIncorrecto');
                            $scope.showUser = true;
                            break;
                        case 401:
                            $scope.credentials.password = '';
                            $scope.authError = $filter('translate')('login.passIncorrecto');
                            break;
                        case 404:
                            $scope.credentials.password = '';
                            $scope.showPass = true;
                            $scope.authError = $filter('translate')('login.sinConexion');
                            break;
                        default:
                            $scope.credentials.password = '';
                            $scope.authError = $filter('translate')('login.internalError');
                            break;
                    }
                });
            } else {
                $scope.authError = $filter('translate')('general.datos_invalidos');
            }
        };
        $scope.logout = function () {
            if ($cookies.getObject('SesionCollege')) {
                UsService.usuarioLogout($cookies.getObject('SesionCollege'));
            }
            $cookies.remove('SesionCollege');
            $cookies.remove('prof');
            $cookies.remove('m');
            $rootScope.usuario = null;
            ses = null;
            $rootScope.menu = [];
            $rootScope.profilesU = [];
            $rootScope.islogin = false;
            $state.go('access.signin');
        };

        $scope.loadInit = function () {
            if ($cookies.get('SesionCollege') !== '') {
                ses = JSON.parse($cookies.get('SesionCollege'));
                UsService.usuarioById(ses.idUsuario).success(function (data) {
                    $rootScope.islogin = true;
                    $rootScope.usuario = data;
                    if (!data.snCambioPwd || !data.snCambioPwd2) {
                        $rootScope.menu = [];
                        $rootScope.profilesU = [];
                        $state.go('/perfilUser');
                    } else {
                        loadMenu(data);
                    }
                    $state.go('app.dashboard-v3');
                    //document.getElementById('divMain').hidden = false;
                }).error(function () {
                    $scope.logout();
                });
            }
        };
    }]);
