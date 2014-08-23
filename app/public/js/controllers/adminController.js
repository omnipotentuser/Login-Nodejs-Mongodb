function AdminController(){
  var that = this;
  $('#btn-logout').click( function() {
    that.attemptLogout();
  });

  $(#account-form-btn1.btn').click( function(){
    $('#user-info').hide();
    $('#account-form-container').hide();
    $('.btn-list-controls.add').removeAttr('disabled');
    $('.btn-list-controls.edit').attr('disabled', 'disabled');
  });

  this.attemptLogout = function(){
    var that = this;
    $.ajax({
      url: "/home",
      type: "POST",
      data: {logout: true},
      success: function(data){
        console.log('successfully logged out');
        window.location.href = '/';
      },
      error: function(jqXHR){
        console.log(jqXHR.responseText + '::' + jqXHR.statusText);
      }
    });
  }

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
