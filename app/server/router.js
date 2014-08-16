var RL = require('./modules/roles-list');
var AM = require('./modules/account-manager');
var EM = require('./modules/email-dispatcher');

module.exports = function(app){
  app.get('/', function(req, res){
    if (typeof(req.cookies.user) === 'undefined' || typeof(req.cookies.pass) === 'undefined'){
      res.render('login', {title: 'Please Login to Your Account', roles: RL});
    } else {
      AM.autoLogin(req.cookies.user, req.cookies.pass, function(userObj){
        if (userObj){
          req.session.user = userObj;
          res.redirect('/home');
        } else {
          res.render('login', {title: 'Please Login to Your Account', roles: RL});
        }
      })
    }
  });
  app.post('/', function(req, res){
    AM.manualLogin(req.param('user'), req.param('pass'), function(err, userObj){
      if (userObj){
        req.session.user = userObj;
        if (req.param('remember-me') === true){
          res.cookie('user', userObj.user, {maxAge: 900000});
          res.cookie('pass', userObj.pass, {maxAge: 900000});
        }
        res.send(userObj, 200);
      } else {
        res.send(err, 400);
      }
    });
  });
  app.post('/userlist', function(req, res){
    if (req.session.user){
      AM.getAllRecords( function(err, list){
        if (list){
          console.log('userlist length:', list.length);
          res.send(list, 200);
        } else {
          res.send(err, 400);
        }
      })
    } else {
      res.redirect('/');
    }
  });
  app.post('/deleteUser', function(req, res){
    if (req.session.user){
      console.log('deleteUser param _id', req.param('_id'),', id', req.param('id'));
      AM.deleteAccount(req.param('_id'), function(err, userObj){
        if (err){
          console.log('deleteUser error', err.message);
          res.send(err, '400');
        } else {
          AM.getAllRecords( function(err, list){
            if (list){
              res.send(list, '200');
            } else {
              console.log('deleteUser error', err.message);
              res.send(err, '400');
            }
          });
        };
      });
    } else {
      res.redirect('/');
    }
  });
  app.get('/home', function(req, res){
    var user = req.session.user;
    if (user){
      console.info('session user: ', user.user, user.role);
      if (user.role === 'admin'){
        res.render('admin', {
          title: 'Administrator Panel',
          roles: RL,
          udata: user
        });
      } else if (user.role === 'agent') {
        res.render('agent', {
          title: 'Home Panel',
          roles: RL,
          udata: user
        });
      } else {
        res.render('regular', {
          title: 'Home Panel',
          roles: RL,
          udata: user
        });
      }
    } else {
      res.redirect('/');
    }
  });
  app.post('/home', function(req, res){
    if (req.param('user')){
      AM.updateAccount({
        user: req.param('user'),
        name: req.param('name'),
        email: req.param('email'),
        role: req.param('role'),
        pass: req.param('pass')
      }, function(err, userObj){
        if (err){
          res.send('error-updating-account', 400);
        } else {
          req.session.user = userObj;
          if (req.cookies.user){
            res.cookie('user', userObj.user, {maxAge: 900000});
            res.cookie('pass', userObj.pass, {maxAge: 900000});
          }
          res.send('ok', 200);
        }
      });
    } else if (req.param('logout') == 'true') {
      res.clearCookie('user');
      res.clearCookie('pass');
      req.session.destroy(function(){
        res.send('ok', 200);
      })
    }
  });
  app.post('/signup', function(req, res){
    AM.addNewAccount({
      name: req.param('name'),
      email: req.param('email'),
      role: req.param('role'),
      user: req.param('user'),
      pass: req.param('pass')
    }, function(err){
      if (err){
        console.error(e);
        res.send(err, 400);
      } else {
        console.info('/signup ok');
        res.send('ok', 200);
      }
    });
  });
  app.post('/admin-create', function(req, res){
    AM.addNewAccount({
      name: req.param('name'),
      email: req.param('email'),
      role: req.param('role'),
      user: req.param('user'),
      pass: req.param('pass')
    }, function(err){
      if (err){
        console.error(e);
        res.send(err, 400);
      } else {
        console.info('/admin-create ok');
        res.send('ok', 200);
      }
    });
  });
  app.post('/admin-edit', function(req, res){
    AM.updateAccount({
      name: req.param('name'),
      email: req.param('email'),
      role: req.param('role'),
      user: req.param('user'),
      pass: req.param('pass')
    }, function(err){
      if (err){
        console.error(e);
        res.send(err, 400);
      } else {
        console.info('/admin-edit ok');
        res.send('ok', 200);
      }
    });
  });
  app.get('/reset-password', function(req, res){
    var email = req.query.e;
    var passH = req.query.p;
    AM.validateResetLink(email, passH, function(flag){
      if (flag !== 'ok'){
        res.redirect('/');
      } else {
        req.session.reset = {email: email, passH: passH};
        res.render('reset', {title: 'Reset Password'});
      }
    });
  });
  app.post('/reset-password', function(req, res){
    var nPass = req.param('pass');
    var email = req = req.session.reset.email;
    req.session.destroy();
    AM.updatePassword(email, nPass, function(err, userObj){
      if (userObj){
        res.send('ok');
      } else {
        res.send('unable to reset password', 400);
      }
    });
  });
  app.post('/lost-password', function(req, res){
    AM.getAccountByEmail(req.param('email'), function(userObj){
      if (userObj){
        res.send('ok', 200);
        EM.dispatchResetPasswordLink(userObj, function(err, m){
          if (err){
            res.send('email-server-error', 400);
            for (var k in err){
              console.log('error :', k, err[k]);
            }
          } else {
            console.log('dispatch email ok - lost-password');
          }
        });
      } else {
        console.log('email not found - lost-password');
        res.send('email-not-found', 400);
      }
    });
  });
};
