var app = require('./app');

app.setShouldCache(true);
app.listen(process.env.PORT || 3001);
