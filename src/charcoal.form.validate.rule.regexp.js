/**
* charcoal.form.validate.rule.regexp.js
*/

/**
* Regexp rule
*/
Charcoal.Form.Validate.Rule.Regexp = function(validate_object, options)
{
	this.v = validate_object;

	var default_options = {
		'regexp':null,
		'modifiers':'gi'
	};

	this.options = $.extend(default_options, options);
};
Charcoal.Form.Validate.Rule.Regexp.prototype = new Charcoal.Form.Validate.Rule();
Charcoal.Form.Validate.Rule.Regexp.prototype.constructor = Charcoal.Form.Validate.Rule;
Charcoal.Form.Validate.Rule.types = Charcoal.Form.Validate.Rule.types || {};
Charcoal.Form.Validate.Rule.types.regexp = Charcoal.Form.Validate.Rule.Regexp;

Charcoal.Form.Validate.Rule.Regexp.prototype.detect_rule_options = function(input)
{
	var rule_options = input.get_data();

	return rule_options;
};

/**
* @return boolean
*/
Charcoal.Form.Validate.Rule.Regexp.prototype.validate = function(input)
{
	
	var options = $.extend(this.options, this.detect_rule_options(input));
	if(options.regexp === null) {
		// No regexp found
		return this.error(input, 'setup-regexp-missing');
	}

	var regex = new RegExp(options.regexp, options.modifiers);
	var match = regex.test(input.get_value());

	if(!match) {
		return this.error(input, 'regexp');
	}
	else {
		return this.success(input, 'regexp');
	}

};
