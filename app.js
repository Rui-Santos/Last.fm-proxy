var app = require('express').createServer(),
    Lastfm = require('./lastfm'),
    client = new Lastfm();

app.setShouldCache = function(value) {
  client.setShouldCache(value);
};

app.get('/genre_topalbums/:genre', function(req, res) {
  client.tag_getTopAlbums(req.params.genre, function(data) {
    res.json(data ? data : {});
  });
});

app.get('/genre_image/:genre', function(req, res) {
  client.tag_getImages(req.params.genre, function(images) {
    res.json(images ? images : {});
  });
});

app.get('/artist_topalbums/:artist', function(req, res) {
  client.artist_getTopAlbums(req.params.artist, function(data) {
    res.json(data ? data : {});
  });
});

app.get('/artist_image/:artist', function(req, res) {
  client.artist_getImages(req.params.artist, function(images) {
    res.json(images ? images : {});
  });
});

app.get('/artist_info/:artist', function(req, res) {
  client.artist_getInfo(req.params.artist, function(data) {
    res.json(data ? data : {});
  });
});

app.get('/artist_similar/:artist', function(req, res) {
  client.artist_getSimilar(req.params.artist, function(data) {
    res.json(data ? data : {});
  });
});

app.get('/album_info/:artist/:album', function(req, res) {
  client.album_getInfo(req.params.album, req.params.artist, function(data) {
    res.json(data ? data : {});
  });
});

app.get('/album_image/:artist/:album', function(req, res) {
  client.album_getImages(req.params.album, req.params.artist, function(images) {
    res.json(images ? images : {});
  });
});

app.enable("jsonp callback");
module.exports = app;
