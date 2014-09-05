// Charcoal Namespace
var Charcoal = Charcoal || {};
Charcoal.Form = Charcoal.Form || {};
Charcoal.Form.Validate = Charcoal.Form.Validate || {};

(function ( $ ) {    

	"use strict";

	/**
	*	lvalidate Plugin
	*	Applys to a <form> element.
	*	Takes all the required fields and validates them accordingly.
	*
	*	@todo Rules
	*
	*/
    $.fn.lvalidate = function(options) {
		/**
		*	Default settings
		*/
        var defaults =
        {   
			requiredClass:"required",
			similarClass:"similar",
			requiredGroupClass:"required-group",
			regExpClass:"regexp",

			onError: function(e,c) {
			
			},
			onSuccess: function(e,c) {
			
			},
			onFirstError : function(elem,code) {

			},
			custom_validation : function(lvalidate) {
				return true;
			},
			valid:function(o) {
				// @todo: Default valid function should submit form
			},
			invalid:function(o) {

			}
        };
		
		/**
		* If "options" are passed as a string
		* Means we have a command
		*
		* add more here
		*/
		if (typeof options == 'string' && $(this).data('lvalidate')) {
			var obj = $(this).data('lvalidate');
			switch (options) {
				case 'validate':
					obj.validate();
					return this;
				//break;
				default:
					return this;
				//break;
			}
		}

		/**
		*	Extended settings
		*/
		var settings = $.extend(defaults, options); 

		$(this).each(function(i,e) {
			
			// We implement a new instance of the Charcoal.Form.Valicate Class
			var data = new Charcoal.Form.Validate($(this), settings);
			
			// We wanna have access to these datas later on.
			$(this).data('lvalidate',data);
		});
		
		/**
		* Bind the click event on submit button
		* On submit, we wanna prevent default (the actual submit.)
		* Validation should occur there
		*
		* @todo Shouldn't we override the form submit handler instead?
		* @todo shouldn't the form data be reset here to allow dynamic form?
		*/
		$(this).on('click','[type=submit]',function(e) {
			e.preventDefault();
			var form = $(this).parents('form');
			// Call the validate function
			var lvalidate = form.data('lvalidate');
			
			// We call the validation
			// All the handlers for success or error are within the "lvalidate" datas.
			lvalidate.validate();
		});

		// Chainable
		return this;

	};

}(jQuery));



/***
*	Charcoal.Fom.Validate js Class
*	Validates the form with the parameters
*	
*	@param {object} opts
*		{
*			obj : [Form element],
*			requiredClass : 'required',
*			requiredGroupClass : "required-group"
*			onError : function(e) {},
*			onSuccess: function(e) {}
*		}
*
*	@notes
*	There are some "error strings" that define the type of error (or success).
*		- ok (success)
*		- empty	(error / global)
*		- invalid_mail (error / email rule)
*		- invalid (error / global)
*		- unchecked (error / radio)
*		- unselected (error / select)
*
*	@precisions
*	For radio inputs, only ONE should have the "requiredClass".  
*	You want only one errors for all the connected radios.
*
*	@author Stephen Bégay
*	@coauthor Benjamin Roch
*	@todo Customize callbacks and rules
*	@version 2013-08-15
*/
Charcoal.Form.Validate = function(form, opts) {

	/**
	*	{jQuery Object} Form this.obj
	*	Contains the form
	*/
	this.obj = form;
	this.settings = opts || {};
	
	
	// Will contain invalid inputs.
	this.invalidInputs = [];
	
	/**
	* Validate the form
	*/
	this.validate = function() 
	{
		// Fits the old API
		this.form = this.obj;
		
		// Required fields comes from the requiredClass setting
		var required_fields = this.form.find('.'+this.settings.requiredClass);
		var similar_fields = this.form.find('.'+this.settings.similarClass);
		var required_group_fields = this.form.find('.'+this.settings.requiredGroupClass);
		var regex_fields = this.form.find('.'+this.settings.regExpClass);

		// @todo De-hardcode this behavior if possible...
		this.form.find('.error').removeClass('error');

		// Scoping
		var that = this;
		
		// Error var
		var no_error = true;
		var first_input = true;

		var element_selector = 'input, select, textarea';
		var element_blacklist = ':hidden, :disabled, [type=submit], [type=button]'; // @todo support the blacklist with not
		var form_fields = this.form.find(element_selector);


		// Looping the inputs to validate each
		form_fields.each(function(i, e) {
			var input_elem = $(this);
			var input_validation = that.validate_input(input_elem);
			no_error = no_error && !input_validation;

			if (!no_error && first_input) {
				first_input = false;
				that.settings.onFirstError(input_elem, "First Error");
			}
		});

		/*
		// Looping the inputs to validate each
		required_fields.each(function(i,e) {
			var tmp = that.validate_input($(this));
			no_error = no_error && !tmp;

			if (!no_error && first_input) {
				first_input = false;
				that.settings.onFirstError($(this), "First Error");
			}
		});
		*/

		// Check required_fields FIRST
		// if (!error) {
			// Looping the inputs.
			similar_fields.each(function(i,e) {
				var tmp = that.validate_input($(this), 'similar');
				no_error = no_error && !tmp;

				if (!no_error && first_input) {
					first_input = false;
					that.settings.onFirstError($(this), "First Error");
				}
			});
		// }

		var group_fields_success;
		required_group_fields.each(function(i,e) {
			// var tmp = that.validate_input($(this));
			var _this = $(this);
			var datas = _this.data();
			var tmp = that.validate_input($(this), 'required-group', datas);
			no_error = no_error && !tmp;
		});

		/*
		regex_fields.each(function(i,e) {
			// var tmp = that.validate_input($(this));
			var _this = $(this);
			var datas = _this.data();
			var tmp = that.validate_input($(this), 'regexp');
			console.debug('rexep: '+tmp);
			no_error = no_error && !tmp;
		});
		*/

		if(no_error) {
			// Last logic -> the user appended logic.
			// Only if there are no errors yet.
			if (typeof this.settings.custom_validation == 'function') {
				var tmp = this.settings.custom_validation(this);
				// @todo CHANGE LOGIC
				// In this one we need a "TRUE" response instead of FALSE
				no_error = no_error && tmp;
				if (!no_error && first_input) {
					first_input = false;
					that.settings.onFirstError(false,"Custom Error");
				}
			}

		}
		
		// If there's an error, heres the callback
		// @todo create an Error object.
		if (!no_error) {
			this.settings.invalid(this.obj);
		} else {
			this.settings.valid(this.obj);
		}
	};

	this.default_rule = function()
	{
		return 'required';
	};

	this.validate_input = function(input, rule, options) 
	{
		options = options || {};
		options.rules = rule ? [rule] : null;
		var i = new Charcoal.Form.Validate.Input(this, input, options);
		return i.validate();
	};
	
	/**
	* Error callback for elements having an error
	* @return true
	*/
	this.error = function(elem, code, related_elems) 
	{
		// Error callback
		this.settings.onError(elem, code, related_elems);
		return false;
	};

	/**
	* Success callback for elements passing the test
	* @return false
	*/
	this.success = function(elem, code, related_elems) 
	{
		// Success callback
		this.settings.onSuccess(elem,code,related_elems);
		return true;
	};
	
	this.listeners = function() {
		// We might wanna add custom listeners like "focus, blur, click, etc"
	};
	
	
	/**
	*	Behaviors
	*	These will help validate.
	*	Note that you can you these as STATIC function like this:
	*
	*	new Locomotive_Validate().isEmpty($('input'))
	*
	*	All the following functions apply to only one element.
	*	In any other case, you should use the jQuery instanciation
	*
	*/
	this.isEmptySmart = function(elem) 
	{
		var $this = elem;
		var that = this;

		var tagName = $this.prop("tagName");
		var type = $this.attr('type');
		var name = $this.attr('name');

		if (tagName == "INPUT") {
			if (type == 'text' || type == 'password') { 
				return this.isEmpty($this);
			}

			if (type == 'radio') { 
				var $allradios =  this.obj.find('input[name=' + name + ']');
				return this.isRadioEmpty($allradios);
			}

			if (type == 'checkbox') { 
				return !this.isChecked($this);
			}

			//validating emails
			if (type == 'email') { 
				return !this.isValidEmail($this);
			}
		}

		//validating textarea
		if (tagName == "TEXTAREA") {
			return this.isEmpty($this);
		}
		if (tagName == "SELECT") {
			return this.isSelectEmpty($this);            
		}
	};

	// Check if val == '';
	this.isEmpty = function(elem) 
	{
		return (elem.val() === '' || !elem.val() || elem.val() == '-1');
	};
	
	// Email validation
	this.isValidEmail = function(elem) 
	{
		//regex for validating email
		//accepts + in gmail         
		var pattern = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i;
		return (pattern.test(elem.val()));
	};
	
	// Check if all options are ''
	this.isSelectEmpty = function(elem) 
	{
		return (this.isEmpty(elem.find("option:selected")));
	};
	
	this.isChecked = function(elem) 
	{
		return elem.is(':checked');
	};
	// Check if all radio buttons are unselected
	this.isRadioEmpty = function(elem) 
	{
						
		var radioError = true;
		
		elem.each(function() {
		
			var $this = $(this); 
			if($(this).is(":checked")) {
				radioError = false;
			}
			
		});
		
		return radioError;
	};

	/** Can only be an array
	* @param [array] aElem 
	* @return {boolean} [true if all the object are the same]
	*/
	this.isDifferent = function(aElem) 
	{
		var sameError = false;
		var sameValueFound = "";
		var that = this;

		for (var i = 0; i < aElem.length; i++) {
		// aElem.each(function(i,e){
			if (i === 0) {
				sameValueFound = that.get_value(aElem[i]);
				// sameValueFound = that.get_value($(this));
				// return true;
				continue;
			}
			if (sameValueFound != that.get_value(aElem[i])) {
			// if (sameValueFound != that.get_value($(this))) {
				sameError = true;
			}

		}
		// });

		return sameError;	
	};

	/**
	*  Get an input value
	*/
	this.get_value = function(elem) 
	{
		var $this = elem;
		var tagName = $this.prop('tagName');
		var type = $this.attr('type');
		var name = $this.attr('name');
		
		
		//are we talking about inputs because it might be a select
		if (tagName == 'INPUT') {
			//is it a text input? 
			if (type == 'text' || type == 'email' || type == 'password' || type == 'tel') { 
				return $this.val();
			}
			if (type == 'checkbox') {
				return $this.is(':checked') ? $this.val() : '';
			}
			//is it a radio input? 
			if (type == 'radio') { 
				var $allradios = this.obj.find('input[name=' + name + ']');
				
				$allradios.each(function(i, e){
					if ($(this).is(':checked')) {
						return $this.val();
					}
				});
				return '';
			}

		}
		//validating textarea
		if (tagName == "TEXTAREA") {
			return $this.val();
		}
		//are we talking about selects because it might be an input
		if (tagName == "SELECT") {
			return $this.find("option:selected").val();
		}	

	};

};
;/**
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
;/**
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
;/**
* charcoal.form.validate.rule.credit_card.js
*/

/**
* Empail rule
*/
Charcoal.Form.Validate.Rule.Credit_Card = function(validate_object, options)
{
	this.v = validate_object;

	var default_options = {

	};

	this.options = $.extend(default_options, options);
};
Charcoal.Form.Validate.Rule.Credit_Card.prototype = new Charcoal.Form.Validate.Rule();
Charcoal.Form.Validate.Rule.Credit_Card.prototype.constructor = Charcoal.Form.Validate.Rule;
Charcoal.Form.Validate.Rule.types = Charcoal.Form.Validate.Rule.types || {};
Charcoal.Form.Validate.Rule.types.credit_card = Charcoal.Form.Validate.Rule.Credit_Card;
Charcoal.Form.Validate.Rule.types['credit-card'] = Charcoal.Form.Validate.Rule.Credit_Card;
Charcoal.Form.Validate.Rule.types.luhn = Charcoal.Form.Validate.Rule.Credit_Card;

/**
* @return boolean
*/
Charcoal.Form.Validate.Rule.Credit_Card.prototype.check_luhn = function(cc_number)
{
	// takes the form field value and returns true on valid number
	if (!cc_number) {
		return false;
	}
	// accept only digits, dashes or spaces
	if (/[^0-9-\s]+/.test(cc_number)) {
		return false;
	}

	// The Luhn Algorithm. It's so pretty.
	var nCheck = 0;
	var nDigit = 0; 
	var bEven = false;

	cc_number = cc_number.replace(/\D/g, "");

	for (var n = cc_number.length - 1; n >= 0; n--) {
		var cDigit = cc_number.charAt(n);
		nDigit = parseInt(cDigit, 10);

		if (bEven) {
			if ((nDigit *= 2) > 9) {
				nDigit -= 9;
			}
		}

		nCheck += nDigit;
		bEven = !bEven;
	}

	return ((nCheck % 10) === 0);
};

/**
*
*/
Charcoal.Form.Validate.Rule.Credit_Card.prototype.validate = function(input)
{
	if (!this.check_luhn(input.get_value())) {
		return this.error(input, 'credit-card');
	}
	return this.success(input, 'credit-card');
};
;/**
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
;/**
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
;/**
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
;/**
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
