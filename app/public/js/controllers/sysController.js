function SysController(){
  $('#modal-alert').dialog({
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
