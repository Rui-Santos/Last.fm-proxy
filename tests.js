var Lastfm = require('./lastfm'),
    client = new Lastfm(),
    sinon = require('sinon'),
    fixtures = require('./test_fixtures'),
    config = require('./config'),
    redis = require("redis"),
    redisClient,
    app = require('./app');

exports.common = {
  getPathWithCompleteCache: function (assert) {
    assert.expect(4);
    client.setShouldCache(true);
    redisClient =  redis.createClient(config.redis);
    url = '&method=tag.getTopAlbums&tag=Rock';
    client.getPathWithComplete(url, function(data) {
      assert.ok(data);
      assert.ok(data.topalbums);
      redisClient.get(url, function(err, value) {
        assert.ok(!err);
        assert.ok(value);
        redisClient.end();
        client.setShouldCache(false);
        assert.done();
      });
    });
  }
};

exports.routing = {
  check_routes: function(assert) {
    expect_routes = [
      '/genre_topalbums/:genre',
      '/genre_image/:genre/:type',
      '/genre_image/:genre',
      '/artist_topalbums/:artist',
      '/artist_image/:artist/:type',
      '/artist_image/:artist',
      '/artist_info/:artist',
      '/artist_similar/:artist',
      '/album_info/:artist/:album',
      '/album_image/:artist/:album/:type',
      '/album_image/:artist/:album'
    ];
    assert.ok(app);
    assert.ok(app.routes);
    routes = app.routes.get;

    expect_routes.forEach(function(expected_route) {
      assert.ok(routes.some(function(route){
        return route.path === expected_route;
      }));
    });
    assert.done();
  },
  check_jsonp: function(assert) {
    settings = app.locals.settings;
    assert.ok(settings['jsonp callback']);
    assert.equals(settings['jsonp callback name'], 'callback');
    assert.done();
  }
};

exports.albums = {
  setUp: function (callback) {
    stub = sinon.stub(client, 'getPathWithComplete');
    stub.callsArgWith(1, fixtures.album);
    callback();
  },
  tearDown: function (callback) {
    client.getPathWithComplete.restore();
    callback();
  },
  album_getInfo: function (assert) {
    client.album_getInfo('This Modern Glitch', 'The Wombats', function(info) {
      assert.ok(info);
      assert.equals(info.name, 'This Modern Glitch');
      assert.equals(info.artist, 'The Wombats');
      assert.equals(info.url,
        'http://www.last.fm/music/The+Wombats/This+Modern+Glitch');
      assert.ok(info.image);
      assert.done();
    });
  },
  album_getImages: function (assert) {
    client.album_getImages('This Modern Glitch', 'The Wombats', function(images) {
      assert.ok(images);
      assert.ok(images.small);
      assert.ok(images.large);
      assert.ok(images.extralarge);
      assert.done();
    });
  },
  album_getImages_typed: function (assert) {
    client.album_getImages('This Modern Glitch', 'The Wombats', 'small', function(image) {
      assert.equals('http://userserve-ak.last.fm/serve/34s/58968567.png', image);
      assert.done();
    });
  }
};

exports.artists = {
  setUp: function (callback) {
    stub = sinon.stub(client, 'getPathWithComplete');
    stub.withArgs('&method=artist.getInfo&artist=The Wombats').
      callsArgWith(1, fixtures.artist);
    stub.withArgs('&method=artist.getSimilar&artist=The Wombats').
      callsArgWith(1, fixtures.artist_similar);
    stub.withArgs('&method=artist.getTopAlbums&artist=The Wombats').
      callsArgWith(1, fixtures.artist_top);
    callback();
  },
  tearDown: function (callback) {
    client.getPathWithComplete.restore();
    callback();
  },
  artist_getInfo: function (assert) {
    client.artist_getInfo('The Wombats', function(info) {
      assert.ok(info);
      assert.equals(info.name, 'The Wombats');
      assert.equals(info.url, 'http://www.last.fm/music/The+Wombats');
      assert.ok(info.image);
      assert.done();
    });
  },
  artist_getSimilar: function (assert) {
    client.artist_getSimilar('The Wombats', function(artists) {
      assert.ok(artists);
      assert.ok(artists instanceof Array);
      assert.equals(artists.length, 100);
      assert.done();
    });
  },
  artist_getTopAlbums: function (assert) {
    client.artist_getTopAlbums('The Wombats', function(artists) {
      assert.ok(artists);
      assert.ok(artists instanceof Array);
      assert.equals(artists.length, 11);
      assert.done();
    });
  },
  artist_getImages: function (assert) {
    client.artist_getImages('The Wombats', function(images) {
      assert.ok(images);
      assert.ok(images.small);
      assert.ok(images.large);
      assert.ok(images.extralarge);
      assert.done();
    });
  },
  artist_getImages_typed: function (assert) {
    client.artist_getImages('The Wombats', 'small', function(image) {
      assert.equals('http://userserve-ak.last.fm/serve/34s/23514427.png', image);
      assert.done();
    });
  }
};

exports.genres = {
  setUp: function (callback) {
    stub = sinon.stub(client, 'getPathWithComplete');
    stub.callsArgWith(1, fixtures.genre);
    callback();
  },
  tearDown: function (callback) {
    client.getPathWithComplete.restore();
    callback();
  },
  tag_getTopAlbums: function (assert) {
    client.tag_getTopAlbums('Rock', function(artists) {
      assert.ok(artists);
      assert.ok(artists instanceof Array);
      assert.equals(artists.length, 50);
      assert.done();
    });
  },
  tag_getImages: function (assert) {
    client.tag_getImages('Rock', function(images) {
      assert.ok(images);
      assert.ok(images.small);
      assert.ok(images.large);
      assert.ok(images.extralarge);
      assert.done();
    });
  },
  tag_getImages_typed: function (assert) {
    client.tag_getImages('Rock', 'small', function(image) {
      assert.equals('http://userserve-ak.last.fm/serve/34s/66662762.png', image);
      assert.done();
    });
  }
};
