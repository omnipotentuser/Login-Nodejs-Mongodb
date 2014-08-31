function UserValidator(){
  this.formFields = [$('#name-signup'), $('#email-signup'), $('#user-signup'), $('#pass-signup')];
  this.controlGroups = [$('#name-cg'), $('#email-cg'), $('#user-cg'), $('#pass-cg')];

  this.alert = $('.signup-form-modal');

  this.validateName = function(s){
    return s.length >= 3;
  }

  this.validatePassword = function(s, lookup){
    if (lookup && $('#userId').val() && s===''){
      console.log('lookup user');
      return true;
    } else {
      console.log('do not lookup');
      return s.length >= 3;
    }
  }

  this.validateEmail = function(e){
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1|~,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(e);
  }

  this.showErrors = function(a){
    $('.signup-form-modal .modal-body p').text('Please fix the following problems: ');
    var ul = $('.signup-form-modal .modal-body ul');
    ul.empty();
    for (var i = 0; i < a.length; i++)
      ul.append('<li>'+a[i]+'</li>');
    this.alert.dialog('open');
  }
}

UserValidator.prototype.showInvalidEmail = function(){
  this.controlGroups[1].addClass('error');
  this.showErrors(['That email address is already in use.']);
}

UserValidator.prototype.showInvalidUserName = function(){
  this.controlGroups[2].addClass('error');
  this.showErrors(['That username is already in use.']);
}

UserValidator.prototype.validateForm = function(lookupUser){
  var e = [];
  for (var i=0; i < this.controlGroups.length; i++) this.controlGroups[i].removeClass('error');
  if(this.validateName(this.formFields[0].val()) == false) {
    this.controlGroups[0].addClass('error');
    e.push('Please enter your name');
  }
  if(this.validateEmail(this.formFields[1].val()) == false) {
    this.controlGroups[1].addClass('error');
    e.push('Please enter a valid email');
  }
  if(this.validateName(this.formFields[2].val()) == false) {
    this.controlGroups[2].addClass('error');
    e.push('Please choose a username');
  }
  if(this.validatePassword(this.formFields[3].val(), lookupUser) == false) {
    this.controlGroups[3].addClass('error');
    e.push('Password should be at least 3 characters');
  }
  if (e.length){
    this.showErrors(e);
  }
  return e.length === 0;

}
