const mongoose = require('mongoose');

module.exports = function(req, res, next){
  mongoose.connect(
    'mongodb+srv://xiaoyuesang:xiaoyuesang@dev-twu5o.mongodb.net/test?retryWrites=true&w=majority', 
      {useNewUrlParser: true, 
      useUnifiedTopology: true},
      function(err){
        if (err) {
          return res.status(401).json({ msg: 'No token, authorization denied' });
        } } 
  ).catch(
    error => res.status(500).json(error)
  )
  next()
 };
