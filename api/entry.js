//
//
//  データベース CRUD アクセス API
//
//

console.log("api/entry begin");


const express = require('express');

const router = express.Router();

const queries = require('../db/entry');
const user = require('../db/user')

function isValidId(req, res, next) {
  console.log("id:"+req.params.id);
  if(!isNaN(req.params.id)) {
    return next();
  }else{
    next(new Error('Invalid ID'));
  }
}

function validentry(entry) {
  console.log(entry);
  return(true);
}

router.get('/', user.ensureAuthenticated, function(req, res) {
  queries.getAll().then(entrylist => {
    res.json(entrylist);
  });
});

router.get('/:id', user.ensureAuthenticated, isValidId, function(req, res, next) {
  queries.getOne(req.params.id).then(entry => {
    if(entry) {
      res.json(entry);
    } else {
      next();
    }
  });
});

router.post('/', user.ensureAuthenticated, function(req, res, next){
  if(validentry(req.body)) {
    queries.create(req.body).then(entrylist => {
      res.json(entrylist[0]);
    });
  } else {
    next(new Error('Invalid entry'));
  }
});

router.put('/:id', user.ensureAuthenticated, isValidId, function(req, res, next){
  if(validentry(req.body)) {
    queries.update(req.params.id, req.body).then(entrylist => {
      res.json(entrylist[0]);
    });
  } else {
    next(new Error('Invalid entry'));
  }
});


router.delete('/:id', user.ensureAuthenticated, isValidId, function(req, res){
  queries.delete(req.params.id).then(() => {
    res.json({
      deleted: true
    });
  });
});

module.exports = router;

console.log("api/entry end");
