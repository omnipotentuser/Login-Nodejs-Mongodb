function LoginController(){
  $('#login-form #forgot-password').click(function(){
    $('#get-credentials').dialog('open');
  });

  $('#login-form #sign-up').click( function(){
    $('#login-container').hide();
    $('#account-form-container').show();
  });

  $('#get-credentials').dialog({
    autoOpen: false,
    modal: true,
    title: "forgot Password",
    open: function() {
      $('#email-tf').focus();
      $('#get-credentials-form').resetForm();
      $('#get-credentials .alert').hide();
      $(this).show();
    },
    close: function(){
      $('#user-tf').focus();
      $(this).hide();
    }
  });
}
