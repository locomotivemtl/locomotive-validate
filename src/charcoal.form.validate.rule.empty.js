/**
* charcoal.form.validate.rule.empty.js
*/


/**
* Empty rule
*
* The empty rule support all
*/
Charcoal.Form.Validate.Rule.Empty = function(validate_object, options)
{
	this.v = validate_object;
	var default_options = {

	};

	this.options = $.extend(default_options, options);
};
Charcoal.Form.Validate.Rule.Empty.prototype = new Charcoal.Form.Validate.Rule();
Charcoal.Form.Validate.Rule.Empty.prototype.constructor = Charcoal.Form.Validate.Rule;
Charcoal.Form.Validate.Rule.types = Charcoal.Form.Validate.Rule.types || {};
Charcoal.Form.Validate.Rule.types.empty = Charcoal.Form.Validate.Rule.Empty;
// Legacy support for "required" rule name (now "empty")
Charcoal.Form.Validate.Rule.types.required = Charcoal.Form.Validate.Rule.Empty;	

/**
* @return boolean
*/
Charcoal.Form.Validate.Rule.Empty.prototype.validate = function(input)
{
	var $this = input;

	this.is_empty = function(elem)
	{
		return (elem.val() === '' || !elem.val() || elem.val() == '-1');
	};

	/**
	* Return true if the element is empty
	*
	* @param {jQuery} elem
	*
	* @return boolean
	*/
	this.is_element_empty = function(elem)
	{
		var $this = elem.input;
		var that = this;

		var tag_name = $this.prop("tagName");
		var type = $this.attr('type');
		var name = $this.attr('name');

		if (tag_name == "INPUT") {

			if (type == 'radio') { 
				var checked = $this.parents('form').find('input[name=' + name + ']:checked');
				// If length is false / 0, then it was empty
				return !checked.length;
			}
			else if (type == 'checkbox') { 
				return $this.is(':checked');
			}
			else {
				return ($this.val() === '') || !$this.val();
			}
		}

		//validating textarea
		if (tag_name == "TEXTAREA") {
			return ($this.val() === '' || !$this.val() || $this.val() == '-1');
		}
		if (tag_name == "SELECT") {
			return this.is_empty($this.find("option:selected"));        
		}
	};

	var validation = this.is_element_empty(input);
	if (validation) {
		return this.error(input, 'empty');
	}
	return this.success(input, 'ok');
};
