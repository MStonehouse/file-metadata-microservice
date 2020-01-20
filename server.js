'use strict';

const express = require('express');
const fileUpload = require('express-fileupload')
const cors = require('cors');

// require and use "multer"...

const app = express();

app.use(cors());
app.use(fileUpload())
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
     res.sendFile(process.cwd() + '/views/index.html');
  });

app.post('/api/fileanalyse', function(req, res) {
  
  // check if a file was uploaded, if not throw error
  if (!req.files) {
    throw new Error('No files uploaded')
  }

  let returnObj = {
    name: req.files.upfile.name,
    type: req.files.upfile.mimetype,
    size: req.files.upfile.size
  }
  
  res.json(returnObj);
})


// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

app.listen(process.env.PORT || 3000, function () {
  console.log('Node.js listening ...');
});
