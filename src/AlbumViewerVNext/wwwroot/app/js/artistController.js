﻿(function () {
    'use strict';

    angular
        .module('app')
        .controller('artistController', artistController);

    artistController.$inject = ["$http","$window","$routeParams","$animate","albumService"];

    function artistController($http,$window,$routeParams,$animate,albumService) {        
        var vm = this;

        vm.artist = null;
        vm.albums = [];
        vm.error = {
            message: null,
            icon: "warning",
            reset: function() { vm.error = { message: "", icon: "warning" } },
            show: function(msg, icon) {
                vm.error.message = msg;
                vm.error.icon = icon ? icon : "warning";
            }
        };

        vm.getArtist = function(pk) {
            $http.get("artist?id=" + pk)
                .success(function(artist) {
                    vm.artist = artist;
                })
                .error(function() {
                    vm.error.show("Artist couldn't be loaded.", "warning");
                });
        };

        vm.saveArtist = function(artist) {
            $http.post("artist.ms?id=" + artist.pk, artist)
                .success(function(artist) {
                    vm.artist = artist;
                    $("#EditModal").modal("hide");
                });
        }

        vm.albumClick = function(album) {
            $window.location.hash = "/album/" + album.pk;
        };

        vm.addAlbum = function () {            
            albumService.album = albumService.newAlbum();
            albumService.album.artistPk = vm.artist.pk;
            albumService.album.artist.pk = vm.artist.pk;
            albumService.album.artist.artistname = vm.artist.artistname;

            albumService.updateAlbum(albumService.album);
            $window.location.hash = "/album/edit/0";
        };

        vm.getArtist($routeParams.artistId);

        // force explicit animation of the view and edit forms always
        $animate.addClass("#MainView", "slide-animation");
    }
})();
