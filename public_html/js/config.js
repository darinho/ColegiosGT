// config

var app =
        angular.module('app')
        .constant('WSServerCon', 'http://www.colegios.e.gt:8080/WSColegios/')
        .config(
                ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
                    function ($controllerProvider, $compileProvider, $filterProvider, $provide) {

                        // lazy controller, directive and service
                        app.controller = $controllerProvider.register;
                        app.directive = $compileProvider.directive;
                        app.filter = $filterProvider.register;
                        app.factory = $provide.factory;
                        app.service = $provide.service;
                        app.constant = $provide.constant;
                        app.value = $provide.value;
                    }
                ])
        .config(['$translateProvider', function ($translateProvider) {
                // Register a loader for the static files
                // So, the module will search missing translation tables under the specified urls.
                // Those urls are [prefix][langKey][suffix].
                $translateProvider.useStaticFilesLoader({
                    prefix: 'l10n/',
                    suffix: '.json'
                });
                // Tell the module what language to use by default
                $translateProvider.preferredLanguage('es');
                // Tell the module to store the language in the local storage
                $translateProvider.useLocalStorage();
            }])
        .config(['ivhTreeviewOptionsProvider', function (ivhTreeviewOptionsProvider) {
                ivhTreeviewOptionsProvider.set({
                    idAttribute: 'id',
                    labelAttribute: 'label',
                    childrenAttribute: 'children',
                    selectedAttribute: 'isSelected',
                    useCheckboxes: true,
                    expandToDepth: 0,
                    indeterminateAttribute: '__ivhTreeviewIndeterminate',
                    twistieExpandedTpl: '<i style="margin-right: 7px;color: rgba(66, 66, 66, 0.85);font-size: 18px;" class="glyphicon glyphicon-folder-open"></i>',
                    twistieCollapsedTpl: '<i style="margin-right: 7px;color: rgba(66, 66, 66, 0.85);font-size: 18px;" class="glyphicon glyphicon-folder-close"></i>',
                    twistieLeafTpl: '<i style="margin-right: 7px;color: rgba(66, 66, 66, 0.85);font-size: 18px;" class="glyphicon glyphicon-th-large"></i>',
                    defaultSelectedState: false,
                    validate: true
                });
            }]);