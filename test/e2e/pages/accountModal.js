var browser = require('../browser');

function AccountModal (){
    this._nameField = '#new-edit-account-name-field';
    this._keywordsField = '#new-edit-account-keywords-field';
    this._industrySelect = '#new-edit-account-industry-select';
    this._clickthroughField = '#new-edit-account-url-field';
    this._leadCaptureEmailField = '#new-edit-account-email-field';
    this._enableSpanish = '#new-edit-account-spanish-checkbox';
    this._cSaveBtn = '#new-edit-account-ok-btn';
    this._cancelBtn = '#new-edit-account-cancel-btn';
}

AccountModal.prototype.industrySelect = function(section) {
    return String('option='+section);
};

var accountModal = new AccountModal();
browser.addCommand('industrySelect', accountModal.industrySelect);
module.exports = AccountModal;
