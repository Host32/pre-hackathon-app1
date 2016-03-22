angular.module('tradutor-amigo').controller('MapController', ['$scope', '$geolocation', '$auth', 'NgMap', function ($scope, $geolocation, $auth, NgMap) {
    $auth.waitForUser().then(function () {

        $scope.$geolocation = $geolocation;

        // basic usage
        $geolocation.getCurrentPosition().then(function (location) {
            $scope.location = location;
            $scope.mapLocation = $scope.location.coords.latitude + ', ' + $scope.location.coords.longitude;

            var localizacaoUsuario = Localizacoes.find({
                usuarioId: $scope.currentUser._id
            }).fetch();

            if (localizacaoUsuario.length > 0) {
                Localizacoes.update(localizacaoUsuario[0]._id, {
                    usuarioId: $scope.currentUser._id,
                    latitude: $scope.location.coords.latitude,
                    longitude: $scope.location.coords.longitude
                });
            } else {
                Localizacoes.insert({
                    usuarioId: $scope.currentUser._id,
                    latitude: $scope.location.coords.latitude,
                    longitude: $scope.location.coords.longitude
                });
            }
        });


        // regular updates
        $geolocation.watchPosition({
            timeout: 60000,
            maximumAge: 2,
            enableHighAccuracy: true
        });

        $scope.helpers({
            tradutoresAmigos: function () {
                return Localizacoes.find({});
            }
        });

    });

}]);
