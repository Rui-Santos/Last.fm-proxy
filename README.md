## Summary ##

Simple Last.fm REST proxy with redis caching and JSONP support.

[![Build Status](https://secure.travis-ci.org/ap4y/Last.fm-proxy.png?branch=master)](http://travis-ci.org/ap4y/Last.fm-proxy)

## Install ##

  * setup your `api key` and `redis` config in `config.js`
  * `npm install`
  * `node index.js`

## Tests ##

`nodeunit tests`

## Supported routes ##

  Currently supports only `get` requests throught `getPathWithComplete` and contains several wraped methods:

  * `/genre_topalbums/:genre`
  * `/genre_image/:genre`
  * `/artist_topalbums/:artist`
  * `/artist_image/:artist`
  * `/artist_info/:artist`
  * `/artist_similar/:artist`
  * `/album_info/:artist/:album`
  * `/album_image/:artist/:album`

## References ##

- [http://last.fm/](http://last.fm/)

## License ##

(The MIT License)
