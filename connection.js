const mongoose = require('mongoose')

const database = process.env.MONGODB_URL || 'mongodb://localhost/newDB'

const option = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}

const connection = mongoose.connect(database, option).then(con => {
    console.log('DB connection Successfully!');
}).catch(err => { // if error we will be here
    console.error('App starting error:', err.stack);
    process.exit(1);
});

module.exports = connection;