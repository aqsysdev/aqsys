//
//
//  wave 設定 CRUD アクセス API
//
//

console.log("/api/waves begin");


const express = require('express');

const router = express.Router();

const queries = require('../db/waves');
const user = require('../db/user')

function isValidId(req, res, next) {
  console.log("wid:"+req.params.wid);
  if(!isNaN(req.params.wid)) {
    return next();
  }else{
    next(new Error('Invalid Wid'));
  }
}

function validwaves(waves) {
  console.log(waves);
//  return hasTitle && hasDescription && hasURL && hasRating;
  return(true);
}

router.get('/', user.ensureAuthenticated, function(req, res) {
  queries.getAll().then(waves => {
    res.json(waves);
  });
});

router.get('/:wid', user.ensureAuthenticated, isValidId, function(req, res, next) {
  console.log("get"+req.params.wid);
  queries.getOne(req.params.wid).then(waves => {
    if(waves) {
      res.json(waves);
    } else {
      next();
    }
  });
});

router.post('/', user.ensureAuthenticated, function(req, res, next){
  console.log("post");
  if(validwaves(req.body)) {
    queries.create(req.body).then(waves => {
      res.json(waves[0]);
    });
  } else {
    next(new Error('Invalid waves'));
  }
});

router.put('/:wid', user.ensureAuthenticated, isValidId, function(req, res, next){
  console.log("put");
  if(validwaves(req.body)) {
    queries.update(req.params.wid, req.body).then(waves => {
      res.json(waves[0]);
    });
  } else {
    next(new Error('Invalid waves'));
  }
});


router.delete('/:wid', user.ensureAuthenticated, isValidId, function(req, res){
  queries.delete(req.params.wid).then(() => {
    res.json({
      deleted: true
    });
  });
});

module.exports = router;

console.log("api/waves end");
