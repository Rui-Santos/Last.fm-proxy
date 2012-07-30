var rest = require('restler'),
    redis = require("redis"),
    redisClient,
    config = require('./config'),
    apiKey = config.lastfm;

var Lastfm = (function() {
  function Lastfm() {
    this.baseURL = 'http://ws.audioscrobbler.com/2.0/?format=json&api_key=' +
      apiKey;
    this.shouldCache = false;
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

  Lastfm.prototype.setShouldCache = function(value) {
    this.shouldCache = value;
    if (!redisClient && this.shouldCache) {
      console.log(config.redis);
      redisClient =  redis.createClient(config.redis);
    }
  };

  Lastfm.prototype.getPath = function() {
    var args = arguments;
    console.log('processing ' + args[0]);
    args[0] = '' + this.baseURL + args[0];
    return rest.get.apply(rest, args);
  };

  Lastfm.prototype.requestWithComplete = function(url, callback, options) {
    var that = this;
    this.getPath(url, options).on('complete', function(data, response) {
      if (that.shouldCache) {
        redisClient.set(url, response.raw.toString());
      }
      if (callback) callback.call(that, data);
    });
  };

  Lastfm.prototype.getPathWithComplete = function(url, callback, options) {
    var that = this;
    if (this.shouldCache) {
      redisClient.get(url, function(err, value) {
        if (value && !err) {
          var data = JSON.parse(value);
          if (callback) callback.call(this, data);
        } else {
          that.requestWithComplete(url, callback, options);
        }
      });
    } else {
      this.requestWithComplete(url, callback, options);
    }
  };

  Lastfm.prototype.tag_getTopAlbums = function(tag, callback) {
    var path = '&method=tag.getTopAlbums&tag=' + tag;
    this.getPathWithComplete(path, function(data) {
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
    var path = '&method=artist.getTopAlbums&artist=' + artist;
    this.getPathWithComplete(path, function(data) {
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
    var path = '&method=album.getinfo&artist=' + artist + '&album=' + album;
    this.getPathWithComplete(path, function(data) {
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
      if (data) {
        images = {};
        data.image.forEach(function(image) {
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
