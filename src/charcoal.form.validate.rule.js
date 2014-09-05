/**
* charcoal.form.validate.rule.js
*/

/**
* Charcoal.Form.Validate.Rule base class
* Defines the default rule behavior for the validator
*
* 
*/
Charcoal.Form.Validate.Rule = function(validate_object, input, options)
{
	this.v = validate_object;
	this.input = input;
	this.types = {};

	var default_options = {

	};

	this.options = $.extend(default_options, options);
};

/**
* @return boolean
*/
Charcoal.Form.Validate.Rule.prototype.error = function(elem, code, related_items)
{
	if(!this.v) {
		return false;
	}
	return this.v.error(elem, code, related_items);
};

/**
*
*/
Charcoal.Form.Validate.Rule.prototype.success = function(elem, code, related_items)
{
	if(!this.v) {
		return true;
	}
	return true;
	//return this.v.success(elem, code, related_items);
};
