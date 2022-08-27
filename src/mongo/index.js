const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/docefit');


const mongo = mongoose.connection;
mongo.on('error', (error) => console.error(error));
mongo.once('open', () => {
    console.log('connected to doceFit database');
});

module.exports = mongo;