function clientModal (){
  this._selectChannel = '#select2-new-edit-client-channels-select-container';
  this._selections = '#new-edit-client-channels-select';
  this._nameField = '#new-edit-client-name-field';
  this._saveBtn = '#new-edit-client-save-client-btn';
}

clientModal.prototype.channelSelect = function(section) {
  return String('option='+section);
}

module.exports = clientModal;
