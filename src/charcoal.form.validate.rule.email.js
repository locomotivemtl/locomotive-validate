/**
* charcoal.form.validate.rule.email.js
*/

/**
* Empail rule
*/
Charcoal.Form.Validate.Rule.Email = function(validate_object, options)
{
	this.v = validate_object;

	var default_options = {

	};

	this.options = $.extend(default_options, options);
};
Charcoal.Form.Validate.Rule.Email.prototype = new Charcoal.Form.Validate.Rule();
Charcoal.Form.Validate.Rule.Email.prototype.constructor = Charcoal.Form.Validate.Rule;
Charcoal.Form.Validate.Rule.types = Charcoal.Form.Validate.Rule.types || {};
Charcoal.Form.Validate.Rule.types.email = Charcoal.Form.Validate.Rule.Email;

Charcoal.Form.Validate.Rule.Email.prototype.validate = function(input)
{
	var val = input.get_value();
	if(!val) {
		// Empty emails are considered valid; check with Rule.Empty
		return this.success(input, 'email');
	}
	var pattern = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i;
	var validation = (pattern.test(val));
	if(!validation) {
		return this.error(input, 'email');
	}
	else {
		return this.success(input, 'email');
	}
};
