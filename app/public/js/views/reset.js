$(document).ready( function() {
  var rv = new ResetValidator();
  $('#set-password-form').ajaxForm({
    beforeSubmit : function(formData, jqForm, options) {
      rv.hideAlert();
      return rv.validatePassword($('#pass-tf').val());
    },
    succes: function(responseText, status, xhr, $form) {
      rv.showSuccess('Email has been sent with link for new password');
    },
    error: function() {
      rv.showAlert("I'm sorry something went wrong, please try again.");
    }
  });

  $('#set-password').dialog({
    autoOpen : false,
    show : function(){
      $('#pass-tf').focus();
      $(this).show();
    },
    close : function(){
      window.location.href = '/';
    }
  });

  var rc = new ResetController();

});
