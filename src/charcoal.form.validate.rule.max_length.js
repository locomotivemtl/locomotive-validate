/**
* charcoal.form.validate.rule.Max_Length.js
*/

/**
* Empail rule
*/
Charcoal.Form.Validate.Rule.Max_Length = function(validate_object, options)
{
	this.v = validate_object;

	var default_options = {
		'max-length':null
	};

	this.options = $.extend(default_options, options);
};
Charcoal.Form.Validate.Rule.Max_Length.prototype = new Charcoal.Form.Validate.Rule();
Charcoal.Form.Validate.Rule.Max_Length.prototype.constructor = Charcoal.Form.Validate.Rule;
Charcoal.Form.Validate.Rule.types = Charcoal.Form.Validate.Rule.types || {};
Charcoal.Form.Validate.Rule.types.max_length = Charcoal.Form.Validate.Rule.Max_Length;
Charcoal.Form.Validate.Rule.types['max-length'] = Charcoal.Form.Validate.Rule.Max_Length;

/**
*
*/
Charcoal.Form.Validate.Rule.Max_Length.prototype.detect_rule_options = function(input)
{
	var data = input.get_data();
	if(data.maxLength) {
		data['max-length'] = data.maxLength;
	}

	return data;
};

/**
*
*/
Charcoal.Form.Validate.Rule.Max_Length.prototype.validate = function(input)
{
	var options = $.extend(this.options, this.detect_rule_options(input));
	if(!options['max-length']) {
		return this.error(input, 'setup-max-length-unspecified');
	}

	var val = input.get_value();
	var validation = (val.length > options['max-length']);
	if(!validation) {
		return this.error(input, 'max-length');
	}
	else {
		return this.success(input, 'max-length');
	}
};
