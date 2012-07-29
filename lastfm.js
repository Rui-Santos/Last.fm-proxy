var rest = require('restler'),
    apiKey = require('./config').lastfm;

var Lastfm = (function() {
  function Lastfm() {
    this.baseURL = 'http://ws.audioscrobbler.com/2.0/?format=json&api_key=' +
      apiKey;
  }

  function randomImage (albums) {
    if (albums && albums.length > 0) {
      images = {};
      firstAlbum = albums[Math.floor(Math.random()*albums.length)];
      firstAlbum.image.forEach(function(image) {
        images[image.size] = image['#text'];
      });

      return images;
    }

    return null;
  }

  Lastfm.prototype.getPath = function() {
    var args = arguments;
    console.log('processing ' + args[0]);
    args[0] = '' + this.baseURL + args[0];
    return rest.get.apply(rest, args);
  };

  Lastfm.prototype.tag_getTopAlbums = function(tag, callback) {
    this.getPath('&method=tag.getTopAlbums&tag=' + tag).
    on('complete', function(data) {
      var albums;
      if (data && data.topalbums) {
        albums = data.topalbums.album;
      }
      if (callback) {
        callback.call(this, albums);
      }
    });
  };

  Lastfm.prototype.tag_getImages = function(tag, callback) {
    this.tag_getTopAlbums(tag, function(albums) {
      var images = randomImage(albums);
      if (callback) {
        callback.call(this, images);
      }
    });
  };

  Lastfm.prototype.artist_getTopAlbums = function(artist, callback) {
    this.getPath('&method=artist.getTopAlbums&artist=' + artist).
    on('complete', function(data) {
      var albums;
      if (data && data.topalbums) {
        albums = data.topalbums.album;
      }
      if (callback) {
        callback.call(this, albums);
      }
    });
  };

  Lastfm.prototype.artist_getImages = function(artist, callback) {
    this.artist_getTopAlbums(artist, function(albums) {
      var images = randomImage(albums);
      if (callback) {
        callback.call(this, images);
      }
    });
  };

  Lastfm.prototype.album_getInfo = function(album, artist, callback) {
    this.getPath('&method=album.getinfo&artist=' + artist + '&album=' + album).
    on('complete', function(data) {
      var info;
      if (data) {
        info = data.album;
      }
      if (callback) {
        callback.call(this, info);
      }
    });
  };

  Lastfm.prototype.album_getImages = function(album, artist, callback) {
    this.album_getInfo(album, artist, function(data) {
      var images;
      if (data && data.album) {
        images = {};
        data.album.image.forEach(function(image) {
          images[image.size] = image['#text'];
        });
      }
      if (callback) {
        callback.call(this, images);
      }
    });
  };

  return Lastfm;
}());

module.exports = Lastfm;
