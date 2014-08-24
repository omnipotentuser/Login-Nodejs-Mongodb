function LoginValidator(){
  var loginErrors = $('#modal-alert');
  this.showLoginError = function (t, m){
    console.log('showLoginerror');
    $('#modal-alert .modal-header h3').text(t);
    $('#modal-alert .modal-body p').text(m);
    console.log('before open');
    loginErrors.dialog( "moveToTop" );
    loginErrors.dialog("open");
    console.log('after open');
  }
}
LoginValidator.prototype.validateForm = function(){
  console.info('validateForm');
  if ($('#user-tf').val() == ''){
    console.info('username empty');
    this.showLoginError('Whoops!', 'Please enter a valid username');
    return false;
  } else if ($('#pass-tf').val() == ''){
    console.info('password empty');
    this.showLoginError('Whoops!', 'Please enter a valid password');
    return false;
  } else {
    console.info('validated');
    return true;
  }
  return false;
}
