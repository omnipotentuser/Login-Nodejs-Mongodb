$(document).ready(function(){
  var lv = new LoginValidator();
  var lc = new LoginController();
  var ev = new EmailValidator();

  $('#login-form').ajaxForm({
    beforeSubmit: function(formData, jqForm, options){
      console.log('beforeSubmit');
      if (lv.validateForm() == false){
        return false;
      } else {
        formData.push({ name: 'remember-me', value:$('input:checkbox:checked').length == 1});
        return true;
      }
    },
    url: '/',
    success: function(responseText, status, xhr, $form){
      if (status === 'success'){
        window.location.href = "/home";
      }
    },
    error: function(e){
      lv.showLoginError('Login Failure', 'Please check your username and/or password');
    }
  });

  $('#user-tf').focus();
  $('#login-container').show();

  $('#get-credentials-form').ajaxForm({
    beforeSubmit: function(formData, jqForm, options){
      console.log('email value = '+$('#email-tf').val());
      if (ev.validateEmail($('#email-tf').val())){
        ev.hideEmailAlert();
        return true;
      } else {
        ev.showEmailAlert('<br> Error! </b> Please enter a valid email address');
        return false;
      }
    },
    url : "/lost-password",
    success: function(responseText, status, xhr, $form){
      ev.showEmailSuccess('Check your email on how to reset your password.');
    },
    error: function(data){
      //console.log(data);
      console.log("Message: " + data.responseText);
      if( data.responseText === 'email-not-found'){
        ev.showEmailAlert('This email was not in our system!');
      } else {
        ev.showEmailAlert('Oops! There was a problem, please try again later.');
      }
    }
  });
});
