angular.module('tradutor-amigo').controller('AppController', ['$scope', '$geolocation', '$auth', function ($scope, $geolocation, $auth) {

    $scope.idiomasSugeridos = [
        {
            nome: "Português"
        },
        {
            nome: "Inglês"
        },
        {
            nome: "Espanhol"
        }
    ];

    $scope.idiomaDigitado = '';


    function removeIdiomaSugerido(idioma) {
        var indiceDoIdioma = $scope.idiomasSugeridos.indexOf(idioma);
        $scope.idiomasSugeridos.splice(indiceDoIdioma, 1);
    }

    function insereIdiomaUsuario(nomeIdioma) {
        var idiomaExistente = Idiomas.find({
            nome: new RegExp('^' + nomeIdioma + '$', 'i'),
            usuarioId: $scope.currentUser._id
        }).fetch();

        if (idiomaExistente.length > 0) {
            return;
        }

        Idiomas.insert({
            nome: nomeIdioma,
            usuarioId: $scope.currentUser._id
        });
    }

    $scope.adicionaIdiomaDigitado = function () {
        if ($scope.idiomaDigitado.trim().length === 0) {
            return;
        }

        insereIdiomaUsuario($scope.idiomaDigitado);

        $scope.idiomaDigitado = '';
    };

    $scope.euSeiFalar = function (idioma) {
        insereIdiomaUsuario(idioma.nome)

        removeIdiomaSugerido(idioma);
    };

    $scope.euNaoSeiFalar = function (idioma) {
        removeIdiomaSugerido(idioma);
    };


    $auth.waitForUser().then(function () {
        $scope.helpers({
            idiomasDoUsuario: function () {
                var meusIdiomas = Idiomas.find({
                    usuarioId: $scope.currentUser._id
                });

                var idiomas = meusIdiomas.fetch();

                $scope.idiomasSugeridos = _.reject($scope.idiomasSugeridos, function (i) {
                    return _.findWhere(idiomas, {
                        nome: i.nome
                    });
                });

                return meusIdiomas;
            }
        });
    });

}]);
