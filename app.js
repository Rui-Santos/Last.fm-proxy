var app = require('express').createServer(),
    Lastfm = require('./lastfm'),
    client = new Lastfm();

app.get('/genre_topalbums/:genre/', function(req, res) {
  client.tag_getTopAlbums(req.params.genre, function(data) {
    res.send(data ? data : 404);
  });
});

app.get('/genre_image/:genre/', function(req, res) {
  client.tag_getImages(req.params.genre, function(data) {
    res.send(data ? data : 404);
  });
});

app.get('/artist_topalbums/:artist/', function(req, res) {
  client.artist_getTopAlbums(req.params.artist, function(data) {
    res.send(data ? data : 404);
  });
});

app.get('/artist_image/:artist/', function(req, res) {
  client.artist_getImages(req.params.artist, function(images) {
    res.send(images ? images : 404);
  });
});

app.get('/album_info/:artist/:album', function(req, res) {
  client.album_getInfo(req.params.album, req.params.artist, function(data) {
    res.send(data ? data : 404);
  });
});

app.get('/album_image/:artist/:album', function(req, res) {
  client.album_getImages(req.params.album, req.params.artist, function(images) {
    res.send(images ? images : 404);
  });
});

app.enable("jsonp callback");
app.listen(3001);
