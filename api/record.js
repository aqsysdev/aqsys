//
//
//  記録データベース CRUD アクセス API
//
//

// console.log("api/record begin");


const express = require('express');

const router = express.Router();

const queries = require('../db/record');
const user = require('../db/user')

function isValidId(req, res, next) {
  console.log("tnum_rid:"+req.params.tnum_rid);
  var tnumRid = req.params.tnum_rid.split("_");
  if(!isNaN(tnumRid[0]) && !isNaN(tnumRid[1])) {
    return next();
  }else{
    next(new Error('Invalid tnum or rid'));
  }
}

function validrecord(record) {
//  console.log(record);
  queries.encodeRow(record);
  return(true);
}


router.get('/:tnum_rid(\\d+_\\d+)', user.ensureAuthenticated, isValidId, function(req, res, next) {
  queries.getOne(req.params.tnum_rid.split("_")[0]*1,req.params.tnum_rid.split("_")[1]*1, req.body).then(entry => {
    if(entry) {
      queries.decodeRow(entry);
      res.json(entry);
    } else {
      next();
    }
  });
});

router.get('/:tnum(\\d+)', user.ensureAuthenticated, function(req, res) {
  console.log("tnum:"+req.params.tnum);
  queries.getAll(req.params.tnum).then(recordlist => {
    recordlist.forEach(function(row){queries.decodeRow(row);});
    res.json(recordlist);
  });
});


router.post('/:tnum(\\d+)', user.ensureAuthenticated, function(req, res, next){
//  console.log("put:"+req.param.tnum);
  if(validrecord(req.body)) {
    queries.create(req.params.tnum, req.body).then(recordlist => {
      res.json(recordlist[0]);
    });
  } else {
    next(new Error('Invalid record'));
  }
});

router.put('/:tnum_rid(\\d+_\\d+)', user.ensureAuthenticated, isValidId, function(req, res, next){
//  console.log("put:"+req.param.tnum_rid);
  if(validrecord(req.body)) {
    queries.update(req.params.tnum_rid.split("_")[0]*1,req.params.tnum_rid.split("_")[1]*1, req.body).then(recordlist => {
      res.json(recordlist[0]);
    });
  } else {
    next(new Error('Invalid record'));
  }
});


router.delete('/:tnum_rid(\\d+_\\d+)', user.ensureAuthenticated, isValidId, function(req, res){
  queries.delete(req.params.tnum_rid.split("_")[0]*1,req.params.tnum_rid.split("_")[1]*1,req.params.id).then(() => {
    res.json({
      deleted: true
    });
  });
});

module.exports = router;

// console.log("api/record end");
