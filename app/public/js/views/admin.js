$(document).ready(function(){
  var ac = new AdminController();
  var uv = new UserValidator();

  var addbtn = $('.btn-list-controls.add');
  var delbtn = $('.btn-list-controls.del');

  var userObj = {};
  var selectedUser = {};
  var accountFormUrl = '/admin-create';
  var classHighlight = 'highlight';

  function listRemoveHighlight(){
    $('.user-list-slot').each( function(){ 
      $(this).removeClass(classHighlight);
    });
  }

  function adminUpdateList() {
    $.ajax({
      url: '/userlist',
      type: 'POST',
      dataType: 'json',
      success: function(data, textStatus, jqXHR){
        updateUserList(data);
        return false;
      },
      error: function(jqXHR, textStatus, errorThrown){
        console.error('userlist error ' + errorThrown);
      }
    });
  }

  function resetAccountForm(msg){
    $('#sub1.subheading').html(msg);
    $('#name-signup').val('');
    $('#email-signup').val('');
    $('#roles-list').val([]);
    $('#user-signup').val('');
    $('#pass-signup').val('');
  }

  function updateAccountForm(msg){
    if (selectedUser){
      $('#sub1.subheading').html(msg);
      $('#name-signup').val(selectedUser.name);
      $('#email-signup').val(selectedUser.email);
      $('#roles-list').val(selectedUser.role);
      $('#user-signup').val(selectedUser.user);
      $('#pass-signup').val('');
    }
  }

  function updateUserList(data){
    $('.user-list-layout').html('');
    for(var i = 0; i < data.length; i++){
      (function(){
        var ua = data[i];
        var slotName = document.createTextNode(ua.user);
        var slot = document.createElement('div');
        slot.className = 'user-list-slot';
        slot.appendChild(slotName);
        slot.addEventListener(
          'click', 
          function(){
            listRemoveHighlight();
            $(this).addClass(classHighlight);
            selectedUser = ua;
            updateAccountForm("Updating " + selectedUser.user);
            sendForm("/admin-edit");
            $('#user-info').show();
            $('#account-form-container').show();
            $('#user-cg').hide();
            $('#name-signup').focus();
            addbtn.removeAttr('disabled');
            delbtn.removeAttr('disabled');
            return false;
          }, 
          false
        );
        $('.user-list-layout').append(slot);
      })();
    }
  }

  function sendForm(url){
    $('#account-form').ajaxForm({
      beforeSubmit : function(formData, jqForm, options){
        console.log('sending to ' + url);
        console.log('sendForm.name: ' + formData[1].name);
        console.log('sendForm.value: ' + formData[1].value);
        console.log('sendForm.name: ' + formData[3].name);
        console.log('sendForm.value: ' + formData[3].value);
        return uv.validateForm(false);
      },
      url: url,
      success : function(responseText, status, xhr, $form){
        if (status == 'success'){
          console.log('updated database');
          $('#user-info').hide();
          adminUpdateList();
        }
      },
      error : function(e) {
        if (e.responseText == 'username-taken'){
          alert('Username taken');
        }
      }
    });
  }

  addbtn.click(function(){
    (function(){
      resetAccountForm("Please create a new user.");
      sendForm("/admin-create");
      listRemoveHighlight();
      delbtn.attr('disabled', 'disabled');
      $('#user-info').show();
      $('#account-form-container').show();
      $('#user-signup').show();
      $('#user-cg').show();
      $('#name-signup').focus();
    })();
  });

  delbtn.click(function(){
    $.ajax({
      url: '/deleteUser',
      type: 'POST',
      dataType: 'json',
      data: selectedUser,
      success: function(data, textStatus, jqXHR){
        adminUpdateList();
        $('#user-info').hide();
        return false;
      },
      error: function(jqXHR, textStatus, errorThrown){
        console.error('deleteUser invalid request ' + errorThrown);
      }
    });
  });

  delbtn.attr('disabled', 'disabled');
  
  $('#account-form-btn1.btn').html('Cancel');
  $('#account-form-btn2.btn').html('Submit');
  $('#account-form-btn2.btn').addClass('btn-primary');

  adminUpdateList();
  console.log('admin page is ready');
});
