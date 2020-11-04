const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const app = express();  
const port = 8888;
//var mongoStore = require('connect-mongo')(session);
app.use(cors());//solving the CORS issue
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded



/*process.on('unhandledRejection', async (reason, promise) => { 
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
  try {
    if (reason) {
      throw new SyntaxError("wtfffffff")
    }
  } catch (error) {
    console.log(error)
  }}
)*/

const db = mongoose.connection;
db.on('error', ()=> console.error.bind(console, 'error:'));
db.once('open', function() {
  // we're connected!
  console.log('mongodb connect')
});
app.use('/api/users', require('./controllers/users'));
app.use('/api/pagination', require('./controllers/pagination'));
app.listen(port);