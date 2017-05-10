var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope) {

    $scope.priceFuel = 0;
    $scope.avgFuel = 0;



    var idInit = 1;
    $scope.Persons = [
        {
            id:0
        }
    ];

    $scope.addPerson = function () {
      $scope.Persons.push({
          id: idInit++
      })
    };
    $scope.deletePerson = function (person) {
        for(var p in $scope.Persons){
            if($scope.Persons[p].id === person.id ){
                $scope.Persons[p].deleted = true;
                $scope.calc();
                return;
            }
        }
    };


    $scope.calc = function (person) {

        person = person||null;
        if(person != null){
            var result = parseInt(person.stopKm||0) - parseInt(person.startKm||0);
            if(result < 0){
                result = 0;
            }
            person.resultKm = result;
        }

        var pricePerKm = $scope.priceFuel*$scope.avgFuel/100;
        var checkpoints = getCheckpoints();
        var personsNow = initPersons();
        var kmBetween = 0;
        var startCPerson = 0;
        var startCPersonTemp = 0;

        for(var c in checkpoints){
            for(var person in $scope.Persons){
                if($scope.Persons[person].deleted || $scope.Persons[person].startKm == null || $scope.Persons[person].stopKm == null || $scope.Persons[person].resultKm < 0)
                    continue;

                if(personsNow[$scope.Persons[person].id].active && startCPerson != 0){
                    kmBetween = parseInt(c)-personsNow[$scope.Persons[person].id].startC;
                    personsNow[$scope.Persons[person].id].price += kmBetween*pricePerKm/startCPerson;
                    personsNow[$scope.Persons[person].id].startC = parseInt(c);
                }

                if($scope.Persons[person].startKm === parseInt(c)){
                    personsNow[$scope.Persons[person].id].active = true;
                    personsNow[$scope.Persons[person].id].startC = parseInt(c);
                    startCPersonTemp++;
                }

                if($scope.Persons[person].stopKm === parseInt(c)){
                    personsNow[$scope.Persons[person].id].active = false;
                    startCPersonTemp--;
                }
            }
            startCPerson += startCPersonTemp;
            startCPersonTemp = 0;
        }

        for(var person in $scope.Persons){
            if($scope.Persons[person].deleted || $scope.Persons[person].startKm == null || $scope.Persons[person].stopKm == null || $scope.Persons[person].resultKm < 0)
                continue;

            $scope.Persons[person].resultPrice = personsNow[$scope.Persons[person].id].price.toFixed(2);
        }
    };

    function getCheckpoints() {
        var checkpoints = {};
        for(var person in $scope.Persons){
            checkpoints[$scope.Persons[person].startKm] = 1;
            checkpoints[$scope.Persons[person].stopKm] = 1;
        }

        return checkpoints;
    }

    function initPersons() {
        var personsNow = {};
        for(var person in $scope.Persons){
            if(!$scope.Persons[person].deleted){
                personsNow[$scope.Persons[person].id] = {
                    active: false,
                    startC: 0,
                    price: 0
                };
            }
        }
        return personsNow
    }

});