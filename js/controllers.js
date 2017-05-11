var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope) {

    $scope.priceFuel = 29;
    $scope.avgFuel = 5;

    $scope.Persons = [];
    $scope.actualPersons = 0;
    $scope.actualPosition = {
        latitude: 0,
        longitude: 0
    };
    $scope.actualKm = 0;
    $scope.lasStopKm = 0;


    var idInit = 0;



    $scope.addPerson = function () {
        $scope.Persons.push({
            id: idInit++,
            name: $scope.newPersonName,
            startTime: new Date($.now()).toDateString(),
            startKm: $scope.newPersonStartKm,
            deleted: false,
            goingOut: false,
            priceSum: 0,
            kmSum: 0
        });
        $scope.actualPersons++;
        $scope.newPersonName = '';

        $scope.calc(true);
    };

    $scope.calc = function (status) {
        status = status||false;
        if(status)
            $scope.actualKm = $scope.newPersonStartKm;

        var pricePerKm = $scope.priceFuel*$scope.avgFuel/100;
        var kmBetween = $scope.actualKm - $scope.lasStopKm;
        var actualPrice = kmBetween*pricePerKm/$scope.actualPersons;

        for(var person in $scope.Persons){
            if($scope.Persons[person].deleted || $scope.Persons[person].startKm === $scope.actualKm)
                continue;

            $scope.Persons[person].priceSum += actualPrice;

            console.log($scope.Persons[person].priceSum);

            if($scope.Persons[person].goingOut){
                $scope.Persons[person].deleted = true;
                $scope.Persons[person].kmSum = $scope.actualKm - $scope.Persons[person].startKm;
                $scope.actualPersons--;
            }
        }

        $scope.lasStopKm = $scope.newPersonStartKm = $scope.actualKm;
    };

    $scope.getPersonsGoingOut = function () {


    };

    $scope.getActualDrivedKm = function () {
        /*getActualLocation();

        var origin1 = new google.maps.LatLng(55.930385, -3.118425);
        var origin2 = 'Greenwich, England';
        var destinationA = 'Stockholm, Sweden';
        var destinationB = new google.maps.LatLng(50.087692, 14.421150);

        var service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
            {
                origins: [origin1, origin2],
                destinations: [destinationA, destinationB],
                travelMode: 'DRIVING'
            }, callback);

        function callback(response, status) {
            // See Parsing the Results for
            // the basics of a callback function.
        }*/
    };

    function getActualLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
        function showPosition(position) {
            console.log(position);
            $scope.actualPosition.latitude = position.coords.latitude;
            $scope.actualPosition.longitude = position.coords.longitude;
        }
    }

});