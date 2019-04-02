const validationInfo = {
	username: [
		{
			type: 'required',
			message: 'This is a required field'
		},
		{
			type: 'regex',
			value: /[^a-z0-9]/gi,
			message: 'No special charachters allowed!'
		}
	],
	password: [
		{
			type: 'required',
			message: 'This is a required field'
		},
		{
			type: 'minLength',
			value: 8,
			message: 'Password should be have minimum length of 8'
		}
	]
};

function _isEmpty(value) {
	return !value;
}

function _hasMinimumLength(value, minLength) {
	if (value && value.length) {
		return value < minLength;
	}
	return false;
}

function _matchesRegex(value, regex) {
	return regex.test(value);
}

function _removeErrorMessage(element) {
	$(element).removeClass('error');
	$(element)
		.siblings('.error-container')
		.text('')
		.addClass('hide');
}

function _showErrorMessage(input, message) {
	$(input).addClass('error');
	$(input)
		.siblings('.error-container')
		.text(message)
		.removeClass('hide');
}

function _bindOnFocusInEvent(form) {
	$(form).on('focusin', function(e) {
		_removeErrorMessage(e.target);
	});
}

function _performValidation(input, config) {
	let hasError = false,
		value = $(input).val();

	if (config && config.length > 0) {
		for (let i = 0; i < config.length; i++) {
			let rule = config[i];
			switch (rule.type) {
				case 'required':
					hasError = _isEmpty(value);
					break;
				case 'minLength':
					hasError = _hasMinimumLength(value, rule.value);
					break;
				case 'regex':
					hasError = _matchesRegex(value, rule.value);
					break;
				default:
					break;
			}

			if (hasError) {
				_showErrorMessage(input, rule.message);
				break;
			}
		}
	}

	return hasError;
}

function _bindOnFocusOutEvent(form, info) {
	$(form).on('focusout', function(e) {
		_performValidation(e.target, info[e.target.name]);
	});
}

function _bindSubmitEvent(form, info, callback) {
	$(form).on('submit', function(e) {
		let hasError = false;
		let inputs = $(this).find('input');

		$.each(inputs, function(idx, input) {
			let isInvalid = _performValidation(input, info[input.name]);
			hasError = hasError || isInvalid;
		});

		if (hasError) {
			e.preventDefault();
		} else if (typeof callback === 'function') {
			e.preventDefault();
			callback(e);
		}
	});
}

function bindValidations(form, info, callback) {
	_bindOnFocusInEvent(form);
	_bindOnFocusOutEvent(form, info);
	_bindSubmitEvent(form, info, callback);
}

$(document).ready(function() {
	bindValidations($('#sign-up-form'), validationInfo);
});
