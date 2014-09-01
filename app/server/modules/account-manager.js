'use strict'

var crypto = require('crypto');
var MongoDB = require('mongodb').Db;
var Server = require('mongodb').Server;
var moment = require('moment');
//var assert = require('assert');

var dbconfig = require('./dbconfig.js');
//assert.deepEqual(dbconfig, {dbPort: 27017, dbHost: 'localhost', dbName: 'login'});

//console.log('dbName:', dbconfig.dbName);
//console.log('admin name:', dbconfig.adminUser.name);

var dbPort = dbconfig.dbPort;
var dbHost = dbconfig.dbHost;
var dbName = dbconfig.dbName;
var accounts = null;

var db = new MongoDB( dbName
  , new Server(dbHost
    , dbPort
    , {auto_reconnect: true})
  , {w:1}
);

db.open(function(e, d){
  if (e){
    console.log(e);
  } else {
    console.log('connected to database "' + dbName + '"');
    accounts = db.collection('accounts');
    seed();
  }
});

var seed = function(){
  addNewAccount(dbconfig.adminUser, function adminResult(err){
    if (err){
      console.log('Create admin user:', err);
    } else {
      console.log('Created admin user');
    }
  });
};

exports.autoLogin = function(user, pass, callback){
  accounts.findOne({user:user}, function(e, o){
    if (o){
      o.pass = pass;
      callback(o);
    } else {
      callback(null);
    }
  });
};

exports.manualLogin = function(user, pass, callback){
  accounts.findOne({user:user}, function(e, o){
    if (o){
      validatePassword(pass, o.pass, function(err, res){
        if (res){
          callback(null, o);
        } else {
          callback('invalid-password');
        }
        });
    } else {
      callback('user-not-found');
    }
  });
};

var addNewAccount = function(newData, callback){
  accounts.findOne({user:newData.user}, function(e, o){
    if (o){
      callback('username-taken');
    } else {
      accounts.findOne({email:newData.email}, function(e, o){
        if (o){
          callback('email-taken');
        } else {
          saltAndHash(newData.pass, function(hash){
            newData.pass = hash;
            newData.date = moment().format('MM Do YYY, h:mm:ss a');
            console.log('addNewAccount - saltAndHash at', newData.date);
            accounts.insert(newData, {safe: true}, callback);
          });
        }
      });
    }
  });
};

exports.addNewAccount = addNewAccount;

exports.updateAccount = function(newData, callback){
  console.log('updateAccount');
  console.log('user: ' + newData.user);
  console.log('name: ' + newData.name);
  console.log('email: ' + newData.email);
  console.log('role: ' + newData.role);
  accounts.findOne({user:newData.user}, function(e, o){
    o.name = newData.name;
    o.email = newData.email;
    o.role = newData.role;
    if (newData.pass === ''){
      accounts.save(o, {safe: true}, function(err){
        if (err){
          callback(err);
        } else {
          callback(null, o);
        }
      });
    } else {
      saltAndHash(newData.pass, function(hash){
        o.pass = hash;
        accounts.save(o, {safe: true}, callback);
      });
    }
  });
};

exports.updatePassword = function(email, newPass, callback){
  accounts.findOne({email:email}, function(e,o){
    if(e){
      callback(e);
    } else {
      saltAndHash(newPass, function(hash){
        p.pass = hash;
        accounts.save(o, {safe: true}, callback);
      });
    }
  });
};

exports.deleteAccount = function(id, callback){
  accounts.remove({_id:getObjectId(id)}, callback);
};

exports.getAccountByEmail = function(email, callback){
  accounts.findOne({email:email}, function(e, o){callback(o);});
};

exports.validateResetLink = function(email, passHash, callback){
  accounts.find( {$and: [{email:email, pass:passHash}]}, function(e, o){
    callback(o ? 'ok' : null);
  });
};

exports.getAllRecords = function(callback){
  accounts.find().toArray(function(e, res){
    if (e) callback(e);
    else callback(null, res);
  });
};

exports.delAllRecords = function(callback){
  accounts.remove({}, callback);
};

var md5 = function(str){
  return crypto.createHash('md5').update(str).digest('hex');
};

var validatePassword = function(plainPass, hashedPass, callback){
  var salt = hashedPass.substr(0, 10);
  var validHash = salt + md5(plainPass + salt);
  callback(null, hashedPass === validHash);
};

var saltAndHash = function(pass, callback){
  console.log('saltAndHash');
  var salt = generateSalt();
  callback(salt + md5(pass + salt));
};

var generateSalt = function(){
  var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
  var salt = '';
  for (var i = 0; i < 10; i++){
    var p = Math.floor(Math.random() * set.length);
    salt += set[p];
  }
  return salt;
};

var getObjectId = function(id){
  return accounts.db.bson_serializer.ObjectID.createFromHexString(id);
};

var findById = function( id, callback){
  accounts.findOne({_id: getObjectId(id)}, function(e, res){
    if (e) callback(e);
    else callback(null, res);
  });
};

var findByMultipleFields = function(a, callback){
  accounts.find({$or: a}).toArray( function(e, results){
    if (e)
      callback(e);
    else
      callback(null, result);
  });
};
