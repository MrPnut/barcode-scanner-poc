var barcodeApp = angular.module('barcodeApp', [
        'ngRoute',
        'ui.bootstrap'
    ]
);

barcodeApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/code128', {
        templateUrl: 'view/code128.html',
        controller: 'Code128Ctrl as code128Ctrl'
    }).when('/qrcode', {
        templateUrl: 'view/qrcode.html',
        controller: 'QrCodeCtrl as qrCodeCtrl'
    }).otherwise({
        redirectTo: '/code128'
    });
}]);

barcodeApp.factory('quagga', [
    function() {
        console.log('Requested quagga service');

        var executions = [];

        var config = {
            numOfWorkers: 1,
            decoder: {
                readers: ['code_128_reader']
            },
            locate: true
        };

        var safeResult = function(result) {
            if (result == null || typeof(result) === 'undefined') {
                result = {};
            }

            if (result.codeResult == null) {
                result.codeResult = {};
            }

            return result;
        };

        Quagga.onProcessed(function(result) {
            result = safeResult(result);
            for (var i=0; i<executions.length; i++) {
                var execution = executions.pop();
                if (result.codeResult.code == null) {
                    if (typeof(execution.onFail) !== 'undefined') {
                        execution.onFail(result);
                    }
                }
                else {
                    if (typeof(execution.onSuccess) !== 'undefined') {
                        execution.onSuccess(result);
                    }
                }
                if (typeof(execution.onComplete) !== 'undefined') {
                    execution.onComplete();
                }
            }
        });

        return {
            decode: function (opts) {
                executions.push(opts);
                var file = URL.createObjectURL(opts.src);
                var request = $.extend({}, config, {src: file});
                Quagga.decodeSingle(request, function () {});
            }
        }
    }
]);

barcodeApp.controller('QrCodeCtrl', ['$scope', '$http',
    function($scope, $http) {

        $scope.imageSrc = 'http://www.google.com';
        $scope.imageForm = {};
        $scope.imageFormScan = {};

        $scope.updateImage = function() {
            $http({
                method: 'POST',
                url: '/qrcode/create',
                data: $scope.imageForm,
                headers: { 'Content-Type': 'application/json'}
            }).success(function(data) {
                $scope.imageSrc = data.location + '?_=' + new Date().getTime();
            });
        };

        $scope.decode = function(src) {
            qrcode.callback = function(data) {
                if (data[0] !== '{' && data[data.length] !== '}') {
                    alert(data);
                }
                else {
                    $scope.imageFormScan = $.parseJSON(data);
                    console.log($scope.imageFormScan);
                    $scope.$apply();
                }
            };
            var file = URL.createObjectURL(src.files[0]);
            qrcode.decode(file)
        }
    }
]);

barcodeApp.controller('HeaderController', ['$scope', '$location',
    function($scope, $location) {
        $scope.isCollapsed = true;

        $scope.isActive = function(viewLocation) {
            return viewLocation === $location.path();
        };
    }
]);

barcodeApp.controller('Code128Ctrl', ['$scope', '$routeParams', '$modal', 'quagga',
    function($scope, $routeParams, $modal, quagga) {
        $scope.code = '';

        $scope.decode = function(src) {
            if (src.files && src.files.length) {
                modalInstance = $modal.open({
                    templateUrl: 'pleaseWaitDialog.html',
                    keyyboard: false,
                    backdrop: 'static'
                });
                quagga.decode({
                    src: src.files[0],
                    onSuccess: function(result) {
                        $scope.code = result.codeResult.code;
                    },
                    onFail: function() {
                        alert('Barcode could not be found. Please try again.');
                    },
                    onComplete: function() {
                        modalInstance.close();
                    }
                });
            }
        };
    }
]);
