function SignupController(){
  $('#account-form-btn1').click( function(){
    $('#account-form-container').hide();
    $('#login-container').show();
  });

  $('#signup-alert').dialog({
    autoOpen: false,
    modal: true,
    buttons: [{
      text: 'OK',
      click: function(){
        setTimeout( function(){
          $('#signup-alert').dialog('close');
          $('#account-form-container').hide();
          $('#login-container').show();
        }, 300);
      }
    }]
  });

  $('.signup-form-modal').dialog({
    autoOpen: false,
    modal: true,
    buttons: [{
      text: 'OK',
      click: function(){
        $(this).dialog('close');
      }
    }]
  });
}
