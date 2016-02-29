colegios.service('UsService', function ($http, WSServerCon) {
    var service = this,
            path = "user/";

    function getUrl() {
        return WSServerCon + path;
    }

    service.getAll = function () {
        return $http.get(getUrl() + 'get');
    };

    service.update = function (data) {
        return $http({
            url: getUrl() + 'update',
            method: 'PUT',
            data: data
        });
    };

    service.uploadImage = function (data, idUser) {
        return $http({
            url: getUrl() + idUser + '/uploadimage',
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: data
        });
    };

    service.create = function (data) {
        return $http({
            url: getUrl() + 'set',
            method: 'POST',
            data: data
        });
    };

    service.delete = function (data) {
        return $http({
            url: getUrl() + 'delete',
            method: 'PUT',
            data: data
        });
    };

    service.login = function (data) {
        return $http({
            url: getUrl() + 'login',
            method: 'POST',
            params: {'sUsuario': data.email, 'pwd': data.password}
        });
    };

    service.validSesion = function () {
        return $http({
            url: getUrl() + 'session',
            method: 'POST'
        });
    };

    service.getUrl = function () {
        return getUrl();
    };
});

colegios.service('$userprofile', function ($http, WSServerCon) {
    var service = this,
            path = 'userprofile/';

    function getUrl() {
        return WSServerCon + path;
    }

    service.getAll = function () {
        return $http({
            url: getUrl() + 'get',
            method: 'GET'
        });
    };
});

colegios.service('$forum', function ($http, WSServerCon) {
    var service = this,
            path = 'forum/';

    function getUrl() {
        return WSServerCon + path;
    }

    service.getByUser = function (idProfile, page) {
        return $http({
            url: getUrl() + 'get/' + idProfile,
            method: 'GET',
            params: {'page': page}
        });
    };
});

colegios.service('$pantalla', function ($http, WSServerCon) {
    var service = this,
            path = 'menu/';

    function getUrl() {
        return WSServerCon + path;
    }

    service.pantallaByUserHtml = function (idProfile) {
        return $http({
            url: getUrl() + idProfile + '/get',
            method: 'GET'
        });
    };
});


colegios.service('CountryService', function ($http, WSServerCon) {
    var service = this,
            path = "country/";

    function getUrl() {
        return WSServerCon + path;
    }

    service.getAll = function () {
        return $http.get(getUrl() + 'get');
    };
});

colegios.service('StateService', function ($http, WSServerCon) {
    var service = this,
            path = "state/";

    function getUrl() {
        return WSServerCon + path;
    }

    service.getAll = function () {
        return $http.get(getUrl() + 'get');
    };
});

colegios.service('CityService', function ($http, WSServerCon) {
    var service = this,
            path = "city/";

    function getUrl() {
        return WSServerCon + path;
    }

    service.getAll = function () {
        return $http.get(getUrl() + 'get');
    };
});

colegios.service('$profiles', function ($http, WSServerCon) {
    var service = this,
            path = "profile/";

    function getUrl() {
        return WSServerCon + path;
    }

    service.getAll = function () {
        return $http.get(getUrl() + 'get');
    };

    service.create = function (data) {
        return $http({
            url: getUrl() + 'set',
            method: 'POST',
            data: data
        });
    };

    service.update = function (data) {
        return $http({
            url: getUrl() + 'set',
            method: 'PUT',
            data: data
        });
    };

    service.setMenus = function (idProfile, data) {
        return $http({
            url: getUrl() + 'setmenus/' + idProfile,
            method: 'POST',
            data: data
        });
    };
});

colegios.service('$menus', function ($http, WSServerCon) {
    var service = this,
            path = "menu/";

    function getUrl() {
        return WSServerCon + path;
    }

    service.getAll = function () {
        return $http.get(getUrl() + 'get');
    };

    service.getByProfile = function (idProfile) {
        return $http.get(getUrl() + idProfile + '/get');
    };

    service.create = function (data) {
        return $http({
            url: getUrl() + 'set',
            method: 'POST',
            data: data
        });
    };

    service.update = function (data) {
        return $http({
            url: getUrl() + 'set',
            method: 'PUT',
            data: data
        });
    };

});

colegios.service('$documentsType', function ($http, WSServerCon) {
    var service = this,
            path = "documenttype/";

    function getUrl() {
        return WSServerCon + path;
    }

    service.getAll = function () {
        return $http.get(getUrl() + 'get');
    };

    service.create = function (data) {
        return $http({
            url: getUrl() + 'set',
            method: 'POST',
            data: data
        });
    };

    service.update = function (data) {
        return $http({
            url: getUrl() + 'set',
            method: 'PUT',
            data: data
        });
    };
});

colegios.service('$licenceType', function ($http, WSServerCon) {
    var service = this,
            path = "licencetype/";

    function getUrl() {
        return WSServerCon + path;
    }

    service.getAll = function () {
        return $http.get(getUrl() + 'get');
    };

    service.create = function (data) {
        return $http({
            url: getUrl(),
            method: 'POST',
            data: data
        });
    };

    service.update = function (data) {
        return $http({
            url: getUrl(),
            method: 'PUT',
            data: data
        });
    };
});

colegios.service('$schools', function ($http, WSServerCon) {
    var service = {},
            path = "school/";

    function getUrl() {
        return WSServerCon + path;
    }

    service.getAll = function (data) {
        return $http.get(getUrl() + 'get');
    };

    service.create = function (data) {
        return $http({
            url: getUrl() + 'set',
            method: 'POST',
            data: data
        });
    };

    service.update = function (data) {
        return $http({
            url: getUrl() + 'set',
            method: 'PUT',
            data: data
        });
    };

    return service;
});