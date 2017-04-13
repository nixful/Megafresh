var niXfulApp = angular.module('niXfulApp', ['ngRoute', 'ngAnimate', 'ngSanitize']);
niXfulApp.config(function($routeProvider, $locationProvider) { //"templates/dashboard.php"
    $routeProvider
        .when("/", {
            templateUrl: "templates/inv.html"
        })
        .when("/inv", {
            templateUrl: "templates/inv.html"
        })
        .otherwise({
            redirectTo: '/'
        })
    //$locationProvider.html5Mode(true);
});
niXfulApp.directive('numbersOnly', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9-]/g, '');
                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});
niXfulApp.controller('mainCtrl', function($scope, $http, $q, $timeout, $interval, $filter, $route, $routeParams, $location, $window, $anchorScroll) {
    $scope.invList = [];
    $scope.inv_Agent = "0";
    $scope.inv_CPOA;
    $scope.inv_Date;
    $scope.inv_Remarks;

    $scope.inv_ItemName = '';
    $scope.inv_ItemPTU = null;
    $scope.inv_ItemND = null;
    $scope.inv_ItemD = null;
    $scope.inv_ItemDmg = null;
    $scope.inv_ItemR = '';

    $scope.inv_ItemNameEdit = '';
    $scope.inv_ItemPTUEdit = null;
    $scope.inv_ItemNDEdit = null;
    $scope.inv_ItemDEdit = null;
    $scope.inv_ItemDmgEdit = null;
    $scope.inv_ItemREdit = '';


    $scope.inv_ItemNameERR = false;
    $scope.inv_ItemPTUERR = false;
    $scope.inv_ItemNDERR = false;
    $scope.inv_ItemDERR = false;
    $scope.inv_ItemDmgERR = false;
    $scope.inv_ItemRERR = false;

    $scope.inv_ItemNameEditERR = false;
    $scope.inv_ItemPTUEditERR = false;
    $scope.inv_ItemNDEditERR = false;
    $scope.inv_ItemDEditERR = false;
    $scope.inv_ItemDmgEditERR = false;
    $scope.inv_ItemREditERR = false;

    $scope.invSearch = "";

    $scope.inv_editMode = false

    $scope.agents = [];
    $scope.agents[0] = {
        name: 'Agent 1',
        invList: [{
                name: "BAP 1560",
                putToUnit: 3,
                nonDerivative: 0,
                derivative: 9,
                damaged: 2,
                remarks: "Remark 1"
            },
            {
                name: "Power 5",
                putToUnit: 7,
                nonDerivative: 0,
                derivative: 2,
                damaged: 0,
                remarks: "Remark 2"
            },
            {
                name: "Test Item",
                putToUnit: 1,
                nonDerivative: 1,
                derivative: 1,
                damaged: 0,
                remarks: "Remark test"
            }
        ]
    }
    $scope.agents[1] = {
        name: 'Agent 2',
        invList: [{
                name: "RO21 Tank Steel",
                putToUnit: 26,
                nonDerivative: 0,
                derivative: 9,
                damaged: 6,
                remarks: "Good"
            },
            {
                name: "Power 5",
                putToUnit: 80,
                nonDerivative: 0,
                derivative: 7,
                damaged: 0,
                remarks: "Remark 2"
            },
            {
                name: "TC10L Bracket ",
                putToUnit: 13,
                nonDerivative: 1,
                derivative: 20,
                damaged: 0,
                remarks: "Nice"
            }
        ]
    }
    $scope.agents[2] = {
        name: 'Agent 3',
        invList: [{
                name: "RO21 Tank Steel",
                putToUnit: 26,
                nonDerivative: 0,
                derivative: 9,
                damaged: 6,
                remarks: "Good"
            },
            {
                name: "BAP 1560",
                putToUnit: 3,
                nonDerivative: 0,
                derivative: 9,
                damaged: 2,
                remarks: "Remark 1"
            }
        ]
    }
    $scope.changeAgent = function() {
        $scope.invSearch = ""
        $scope.invList = $scope.agents[$scope.inv_Agent].invList;
    }
    $scope.addItem = function() {
        console.info("AddItem")
        //$timeout(function(){
        $scope.agents[$scope.inv_Agent].invList.push({
            name: $scope.inv_ItemName,
            putToUnit: $scope.inv_ItemPTU,
            nonDerivative: $scope.inv_ItemND,
            derivative: $scope.inv_ItemD,
            damaged: $scope.inv_ItemDmg,
            remarks: $scope.inv_ItemR
        })
        $scope.inv_ItemName = '';
        $scope.inv_ItemPTU = null;
        $scope.inv_ItemND = null;
        $scope.inv_ItemD = null;
        $scope.inv_ItemDmg = null;
        $scope.inv_ItemR = '';
        //})

    }
    $scope.deleteItem = function(i) {
        if (confirm("Delete this item?") == true) {
            $scope.invList.splice(i, 1);
        }
    }
    $scope.inv_hasError;
    $scope.validItem = function() {
        $timeout(function() {
            $scope.inv_ItemNameERR = $scope.inv_ItemPTUERR = $scope.inv_ItemNDERR = $scope.inv_ItemDERR = $scope.inv_ItemDmgERR = false;
            if ($scope.inv_ItemName == '') {
                $scope.inv_ItemNameERR = true;
                $('.invName').tooltip('show')
            } else {
                $('.invName').tooltip('hide')
            }
            if ($scope.inv_ItemPTU == null || $scope.inv_ItemPTU < 0) {
                $scope.inv_ItemPTUERR = true;
                $('.invPTU').tooltip('show')
            } else {
                $('.invPTU').tooltip('hide')
            }
            if ($scope.inv_ItemND == null || $scope.inv_ItemND < 0) {
                $scope.inv_ItemNDERR = true;
                $('.invND').tooltip('show')
            } else {
                $('.invND').tooltip('hide')
            }
            if ($scope.inv_ItemD == null || $scope.inv_ItemD < 0) {
                $scope.inv_ItemDERR = true;
                $('.invD').tooltip('show')
            } else {
                $('.invD').tooltip('hide')
            }
            if ($scope.inv_ItemDmg == null || $scope.inv_ItemDmg < 0) {
                $scope.inv_ItemDmgERR = true;
                $('.invDmg').tooltip('show')
            } else {
                $('.invDmg').tooltip('hide')
            }
            /*
	        if ($scope.inv_ItemR == null ||angular.isString($scope.inv_ItemR) && !angular.isNumber($scope.inv_ItemR)) {
	            $scope.inv_ItemRERR = true;
		  $('.invR').tooltip('show')
	        }
	        */
            //return !( $scope.inv_ItemNameERR  && $scope.inv_ItemPTUERR && $scope.inv_ItemNDERR && $scope.inv_ItemDERR && $scope.inv_ItemDmgERR && $scope.inv_ItemRERR);
            if (!$scope.inv_ItemNameERR && !$scope.inv_ItemPTUERR && !$scope.inv_ItemNDERR && !$scope.inv_ItemDERR && !$scope.inv_ItemDmgERR) {
                $scope.addItem();
            }
        })
        $timeout.cancel($scope.inv_hasError);
        $scope.inv_hasError = $timeout(function() {
            $('.invName').tooltip('hide')
            $('.invPTU').tooltip('hide')
            $('.invND').tooltip('hide')
            $('.invD').tooltip('hide')
            $('.invDmg').tooltip('hide')
        }, 3000)
    }
    $scope.inv_editItem = 0;
    $scope.editItem = function(i) {
        //console.info($scope.agents[$scope.inv_Agent]);
        $scope.inv_ItemNameEdit = $scope.agents[$scope.inv_Agent].invList[i].name;
        $scope.inv_ItemPTUEdit = $scope.agents[$scope.inv_Agent].invList[i].putToUnit;
        $scope.inv_ItemNDEdit = $scope.agents[$scope.inv_Agent].invList[i].nonDerivative;
        $scope.inv_ItemDEdit = $scope.agents[$scope.inv_Agent].invList[i].derivative;
        $scope.inv_ItemDmgEdit = $scope.agents[$scope.inv_Agent].invList[i].damaged;
        $scope.inv_ItemREdit = $scope.agents[$scope.inv_Agent].invList[i].remarks;
        //$('.invName').tooltip('show')
        $scope.inv_editItem = i
    }
    $scope.inv_hasEditError;
    $scope.validItemEdit = function() {
        $timeout(function() {
            $scope.inv_ItemNameEditERR = $scope.inv_ItemPTUEditERR = $scope.inv_ItemNDEditERR = $scope.inv_ItemDEditERR = $scope.inv_ItemDmgEditERR = false;
            if ($scope.inv_ItemNameEdit == '') {
                $scope.inv_ItemNameEditERR = true;
                $('.invNameEdit').tooltip('show')
            } else {
                $('.invNameEdit').tooltip('hide')
            }
            if ($scope.inv_ItemPTUEdit == null || $scope.inv_ItemPTUEdit < 0) {
                $scope.inv_ItemPTUEditERR = true;
                $('.invPTUEdit').tooltip('show')
            } else {
                $('.invPTUEdit').tooltip('hide')
            }
            if ($scope.inv_ItemNDEdit == null || $scope.inv_ItemNDEdit < 0) {
                $scope.inv_ItemNDEditERR = true;
                $('.invNDEdit').tooltip('show')
            } else {
                $('.invNDEdit').tooltip('hide')
            }
            if ($scope.inv_ItemDEdit == null || $scope.inv_ItemDEdit < 0) {
                $scope.inv_ItemDEditERR = true;
                $('.invDEdit').tooltip('show')
            } else {
                $('.invDEdit').tooltip('hide')
            }
            if ($scope.inv_ItemDmgEdit == null || $scope.inv_ItemDmgEdit < 0) {
                $scope.inv_ItemDmgEditERR = true;
                $('.invDmgEdit').tooltip('show')
            } else {
                $('.invDmgEdit').tooltip('hide')
            }
            //return !( $scope.inv_ItemNameERR  && $scope.inv_ItemPTUERR && $scope.inv_ItemNDERR && $scope.inv_ItemDERR && $scope.inv_ItemDmgERR && $scope.inv_ItemRERR);
            if (!$scope.inv_ItemNameEditERR && !$scope.inv_ItemPTUEditERR && !$scope.inv_ItemNDEditERR && !$scope.inv_ItemDEditERR && !$scope.inv_ItemDmgEditERR) {
                $scope.addItemEdit();
            }
        })
        $timeout.cancel($scope.inv_hasEditError);
        $scope.inv_hasEditError = $timeout(function() {
            $('.invNameEdit').tooltip('hide')
            $('.invPTUEdit').tooltip('hide')
            $('.invNDEdit').tooltip('hide')
            $('.invDEdit').tooltip('hide')
            $('.invDmgEdit').tooltip('hide')
        }, 3000)
    }
    $scope.addItemEdit = function() {
        console.info("AddItemEdit")
        //$timeout(function(){
        $scope.agents[$scope.inv_Agent].invList[$scope.inv_editItem] = {
            name: $scope.inv_ItemNameEdit,
            putToUnit: $scope.inv_ItemPTUEdit,
            nonDerivative: $scope.inv_ItemNDEdit,
            derivative: $scope.inv_ItemDEdit,
            damaged: $scope.inv_ItemDmgEdit,
            remarks: $scope.inv_ItemREdit
        }
        $scope.inv_ItemNameEdit = '';
        $scope.inv_ItemPTUEdit = null;
        $scope.inv_ItemNDEdit = null;
        $scope.inv_ItemDEdit = null;
        $scope.inv_ItemDmgEdit = null;
        $scope.inv_ItemREdit = '';
        //})
        $('.invNameEdit').tooltip('hide')
        $('.invPTUEdit').tooltip('hide')
        $('.invNDEdit').tooltip('hide')
        $('.invDEdit').tooltip('hide')
        $('.invDmgEdit').tooltip('hide')
        $('#editItemModal').modal('hide')
    }

    $scope.invList = $scope.agents[0].invList;

})
