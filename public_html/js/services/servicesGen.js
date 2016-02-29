colegios.service('OauthService', function ($http, OaGoogle, OaCli, OaHideCli, URI_R) {
    var service = this,
            scope = 'https://www.googleapis.com/auth/urlshortener&approval_prompt=force&response_type=code&access_type=offline';

    function getUrl() {
        return OaGoogle;
    }

    service.auth = function () {
        return $http({
            url: getUrl() + 'getbyapphtml',
            method: 'POST',
            params: {'client_id': OaCli, 'redirect_uri': URI_R, 'scope': scope}
        });
    };
});

colegios.service('UserService', function ($http, WSServerCon) {
    
});