function _showErrorMessage(input, errorMessage) {
	$(input).addClass('error');
	const errorContainer = $(input).siblings('.error-container');
	$(errorContainer)
		.text(errorMessage)
		.removeClass('hide');
}

function _hideErrorMessage(input) {
	$(input).removeClass('error');
	$(input)
		.siblings('.error-container')
		.addClass('hide');
}

function _isEmpty(value) {
	return !value || typeof value === 'undefined' || value === null;
}

function _hasMinimumLength(value, minLength) {
	return value.length < minLength;
}

function _matchesRegex(value, regex) {
	return regex.test(value);
}

function _performValidation(input, config) {
	let value = $(input).val();
	let hasErrors = false;

	if (config && config.length > 0) {
		for (let i = 0; i < config.length; i++) {
			let rule = config[i];

			switch (rule.type) {
				case 'required':
					hasErrors = _isEmpty(value);
					break;
				case 'minLength':
					hasErrors = _hasMinimumLength(value, rule.value);
					break;
				case 'regex':
					hasErrors = _matchesRegex(value, rule.value);
					break;
				default:
					break;
			}

			if (hasErrors) {
				_showErrorMessage(input, rule.message);
				break;
			}
		}
	}

	return hasErrors;
}

function _bindFocusInEvent(form) {
	$(form).on('focusin', function(e) {
		_hideErrorMessage(e.target);
	});
}

function _bindFocusOutEvent(form, info) {
	$(form).on('focusout', function(e) {
		_performValidation(e.target, info[e.target.name]);
	});
}

function _bindSubmitEvent(form, info, callback) {
	$(form).on('submit', function(e) {
		let formError = false;
		e.preventDefault();

		const inputs = $(form).find('input');

		$.each(inputs, function(idx, input) {
			let isInvalid = _performValidation(input, info[input.name]);
			formError = formError || isInvalid;
		});

		if (!formError) {
			if (typeof callback === 'function') {
				callback(e);
			}
		}
	});
}

function bindValidations(form, info, callback) {
	_bindFocusInEvent(form);
	_bindFocusOutEvent(form, info);
	_bindSubmitEvent(form, info, callback);
}

const validationInfo = {
	username: [
		{
			type: 'required',
			value: true,
			message: 'This a is required field.'
		},
		{
			type: 'regex',
			value: /[\w-]+@([\w-]+\.)+[\w-]+/,
			message:
				'Invalid format for username. Please enter in format username@xyz.com'
		}
	],
	password: [
		{
			type: 'required',
			value: true,
			message: 'This a is required field.'
		},
		{
			type: 'minLength',
			value: 8,
			message: 'Password must have atleast 8 characters'
		},
		{
			type: 'regex',
			value: /[A-Z][0-9]/g,
			message: 'Password must contain atleast one numeric value'
		}
	]
};

function submitCallback() {
	console.log('formSubmitted successfully');
}

$(document).ready(() => {
	bindValidations($('#sign-up-form'), validationInfo, submitCallback);
});
