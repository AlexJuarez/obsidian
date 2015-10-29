var browserSingleton = require('../browser');

function ClientModal (){
  this._selectChannel = '#select2-new-edit-client-channels-select-container';
  this._selections = '#new-edit-client-channels-select';
  this._nameField = '#new-edit-client-name-field';
  this._saveBtn = '#new-edit-client-save-client-btn';
}

ClientModal.prototype.channelSelect = function(section) {
  return String('option='+section);
};

browserSingleton.addCommands(ClientModal);

module.exports = ClientModal;
