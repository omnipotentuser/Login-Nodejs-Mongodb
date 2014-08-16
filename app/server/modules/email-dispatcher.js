'use strict';

var ES = require('./email-settings');

var server = require('emailjs/email').server.connect({ 
    host: ES.host
  , user: ES.user
  , password: ES.password
  , ssl: true
});

exports.dispatchResetPasswordLink = function(account, callback){
  server.send({
      from: ES.sender
    , to: account.email
    , subject: 'Password Reset'
    , text: 'oops...'
    , attachment: composeEmail(account)
  }, callback);
};

function composeEmail(o){
  var link = ''; // "http://<x.net>/reset-password?e="+o.email+"&p="+o.pass;
  var html = "<html><body>";
    html += "Hi "+o.name+",<br><br>";
    html += "Your username is :: <b>"+o.user+"</b><br><br>";
    html += "<a href='"+link+"'>Please click here to reset your password</a><br><br>";
    html += "Cheers,<br>";
    html += "<a href='http://www.openhack.net'>OpenHack, Copyleft 2014</a><br><br>";
    html += "</body></html>";
}
