$(document).ready(function(){
  var sc = new SignupController();
  var av = new AccountValidator();
          
  $('#account-form').ajaxForm({
    beforeSubmit : function(formData, jqForm, options){
      console.log('account-form submit');
      return av.validateForm();
    },
    url: '/signup',
    success : function(responseText, status, xhr, $form){
      console.log('/signup success');
      if (status == 'success'){
        var alert = $('#signup-alert');
        alert.dialog('open');
        alert.show();
      }
    },
    error : function(e){
      if (e.responseText == 'email-taken'){
        av.showInvalidEmail();
      } else if (e.responseText == 'username-taken') {
        av.showInvalidUserName();
      }
    }
  });

  $('#name-tf').focus();

  $('#account-form h1').text('Signup');
  $('#account-form #sub1').text('Please tell us a little about yourself');
  $('#account-form #sub2').text('Choose your username & password');
  $('#account-form-btn1').html('Cancel');
  $('#account-form-btn2').html('Submit');
  $('#account-form-btn2').addClass('btn-primary');
  $('#signup-alert .modal-header h3').text('Success!');
  $('#signup-alert .modal-body p').html('Your account has been created.</br>Click OK to return to the login page.');
});
