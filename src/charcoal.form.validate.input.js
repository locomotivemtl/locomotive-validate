/**
* charcoal.form.validate.input.js
*/

// Remove "function within a loop" jshint error
/*jshint -W083 */

/**
* Charcoal.Form.Validate.Rule base class
* Defines the default rule behavior for the validator
*
* 
*/
Charcoal.Form.Validate.Input = function(validate_object, input, options)
{
	this.v = validate_object;
	this.types = {};

	this.input = input;

	this.options = options || {};

	this.results = {
		error:[],
		warning:[],
		success:[]
	};

	/**
	* Error callback
	*
	* Do nothing and simply call parent's Charcoal.Form.Validate object error() function
	*/
	this.error = function(code, related_elems)
	{
		this.results.error.push(code);
		return this.v.error(this.input, code, related_elems);
	};

	/**
	* Success callback
	*
	* Do nothing and simply call parent's Charcoal.Form.Validate object succes() function
	*/
	this.succes = function(code, related_elems)
	{
		this.results.success.push(code);
		return this.v.success(this.input, code, related_elems);
	};

	/**
	* Auto detect rules
	*
	* @return string
	*/
	this.detect_rules = function()
	{
		var tag_name = this.input.prop("tagName");
		var type = this.input.attr('type');
		var datas = this.input.data();

		var rules;
		if(typeof datas.rules == 'string' || datas.rules instanceof String) {
			rules = datas.rules.split(' ');
		}
		else if(datas.rules instanceof Array) {
			rules = datas.rules;
		}
		else {
			rules = [];
		}

		if(tag_name == 'INPUT') {
			if(type == 'email') {
				rules.push('email');
			}
			// Temporary hack
			if (typeof datas.luhn != 'undefined' || typeof datas.creditCard != 'undefined') {
				rules.push('credit-card');
			}
			if (typeof datas.regexp != 'undefined') {
				rules.push('regexp');
			}
		}

		if(this.input.attr('required')) {
			rules.push('required');
		}

		// Default
		return (rules.length > 0) ? rules : [];
	};

	/**
	* Validate the input.
	* Return true on error
	*
	* @return boolean
	*/
	this.validate = function(options)
	{
		/*if (!rule) {
			rule = "required";
		}*/
		options = options || {};
		options = $.extend(this.options, options);
		var $this = input;
		// Scoping
		var that = this;
		var datas = $this.data();
		//console.debug(datas);

		// Set default rule, if not specified
		options.rules = options.rules || {};
		rules = $.extend(this.detect_rules(), this.options.rules);

		var is_valid = true;

		for (var r in rules) {
			var rule = rules[r];
			var rule_options = {};
			if(Charcoal.Form.Validate.Rule.types[rule] !== undefined) {
				var validate_rule = new Charcoal.Form.Validate.Rule.types[rule](this, rule_options);
				var ret = validate_rule.validate(this);
				if(!ret) {
					is_valid = false;
				}
			}
			
			if (rule == "similar") {
				if ($this.attr("data-related")) {
					var related = $this.attr("data-related");
					var related_inputs = this.form.find("[name="+related+"]");
					if (this.isDifferent([$this,related_inputs])) {
						return that.error(related_inputs,'similar',$this);
					}
					return that.success(related_inputs,'Similar');
				}
				return that.success($this,"no-related-elements");
			}

			if (rule == "required-group" && options) {
				var isMultiple = false;
				var fields;
				if (options.required.indexOf('[]') > 0) {
					isMultiple = true;
					fields = options.required.substr(0,options.required.indexOf('[]'));
				} else {
					fields = options.required.replace(' ','').split(',');
				}

				var atLeastOne = false;
				var fields_array = [];

				var elems = isMultiple ? that.form.find('[name^='+fields+']') : '';

				if (elems.length) {

					elems.each(function(i,e) {
						var el = $(this);
						if (el.length) {
							fields_array.push(el);
						}
						// stop the loop if you got what you need.
						if (!atLeastOne) {
							if (el.length && !atLeastOne) {
								var tmp = !that.isEmptySmart(el);
								atLeastOne = !!tmp;
							}
						}
					});

				} 
				else {

					for (var i = 0; i < fields.length; i++) {
						var el = that.form.find('[name='+fields[i]+']');
						if (el.length) {
							fields_array.push(el);
						}
						// stop the loop if you got what you need.
						if (atLeastOne) {
							continue;
						}
						if (el.length && !atLeastOne) {
							var tmp = !that.isEmptySmart(el);
							atLeastOne = !!tmp;
						}
					}

				}

				if (!atLeastOne) {
					// return error on THIS being the container DIV with the DATAS
					//  rule required_group
					// Concerned fields.
					return that.error($this,'required_group',fields_array);
				}
				return that.success($this,'required_group',fields_array);

			}
		}
		return is_valid;
	};

	/**
	* @return string
	*/
	this.get_value = function()
	{
		var $this = this.input;
		var tagName = $this.prop('tagName');
		var type = $this.attr('type');
		
		//are we talking about inputs because it might be a select
		if (tagName == 'INPUT') {
			//is it a text input? 
			
			if (type == 'checkbox') {
				return $this.is(':checked') ? $this.val() : '';
			}
			//is it a radio input? 
			else if (type == 'radio') { 
				var name = $this.attr('name');
				var all_radios = this.obj.find('input[name=' + name + ']');
				
				all_radios.each(function(i, e){
					if ($(this).is(':checked')) {
						return $this.val();
					}
				});
				return '';
			}
			else {
				return $this.val();
			}

		}
		//validating textarea
		if (tagName == 'TEXTAREA') {
			return $this.val();
		}
		//are we talking about selects because it might be an input
		if (tagName == 'SELECT') {
			return $this.find("option:selected").val();
		}	
	};

	/**
	* Helper function to get data from input
	*/
	this.get_data = function()
	{
		var $this = this.input;
		return $this.data();
	};
};
