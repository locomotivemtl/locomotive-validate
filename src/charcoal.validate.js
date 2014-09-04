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
			"requiredClass":"required",
			"similarClass":"similar",
			"requiredGroupClass":"required-group",
			"regExpClass":"regexp",
			"onError": function(e,c) {
			
			},
			"onSuccess": function(e,c) {
			
			},
			"onFirstError" : function(elem,code) {
			},
			"custom_validation" : function(lvalidate) {
				return true;
			},
			"invalid":function(o) {

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
		var settings=$.extend(defaults, options); 

		$(this).each(function(i,e) {
			// We want the actual form to be in the settings as "obj"
			settings.obj = $(this);
			
			// We implement a new instance of the Locomotive_Validate Class
			var data = new Locomotive_Validate(settings);
			
			// We wanna have access to these datas later on.
			$(this).data('lvalidate',data);
		});
		
		/**
		*	On submit, we wanna prevent default (the actual submit.)
		*	Validation should occur there
		*/
		$(this).on('click','[type=submit]',function(e) {
			e.preventDefault();
			var form = $(this).parents('form');
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
*	Locomotive_Validate js Class
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
var Locomotive_Validate = function(opts) {

	/**
	*	{jQuery Object} Form this.obj
	*	Contains the form
	*/
	if (opts) {
		this.obj = opts.obj;
		this.settings = opts;
	}
	
	// Will contain invalid inputs.
	this.invalidInputs = Array();
	
	this.validate = function() {
		// Fits the old API
		this.form = this.obj;
		
		// Required fields comes from the requiredClass setting
		var required_fields = this.form.find('.'+this.settings.requiredClass);
		var similar_fields = this.form.find('.'+this.settings.similarClass);
		var required_group_fields = this.form.find('.'+this.settings.requiredGroupClass);
		var regex_fields = this.form.find('.'+this.settings.regExpClass);

		this.form.find('.error').removeClass('error');
		// Scoping
		var that = this;
		
		// Error var
		var no_error = true;
		
		var first_input = true;
		// Looping the inputs.

		required_fields.each(function(i,e) {
			var tmp = that.validate_input($(this));
			no_error = no_error && !tmp;

			if (!no_error && first_input) {
				first_input = false;
				that.settings.onFirstError($(this),"First Error");
			}
		});

		// Check required_fields FIRST
		// if (!error) {
			// Looping the inputs.
			similar_fields.each(function(i,e) {
				var tmp = that.validate_input($(this),'similar');
				no_error = no_error && !tmp;

				if (!no_error && first_input) {
					first_input = false;
					that.settings.onFirstError($(this),"First Error");
				}
			});
		// }

		var group_fields_success;
		required_group_fields.each(function(i,e) {
			// var tmp = that.validate_input($(this));
			var _this = $(this);
			var datas = _this.data();
			var tmp = that.validate_input($(this),'required-group',datas);
			no_error = no_error && !tmp;
		});

		regex_fields.each(function(i,e) {
			// var tmp = that.validate_input($(this));
			var _this = $(this);
			var datas = _this.data();
			var tmp = that.validate_input($(this),'regex',datas);
			no_error = no_error && !tmp;
		});

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

	this.validate_input = function(input, rule, options) {
		if (!rule) {
			rule = "required";
		}
		var $this = input;
		// Scoping
		var that = this;
		var datas = $this.data();


		if (typeof datas.luhn != 'undefined') {
			rule = "luhn";
		}

		if (typeof datas.regexp != 'undefined') {
			rule = "regexp";
		}

		if (rule == "regexp") {
			if (!this.matchRegExp($this,datas)) {
				return that.error($this,'regex_err');
			}
			return that.success($this,'ok');
		}

		if (rule == "luhn") {
			if (!this.check_luhn(this.get_value($this),datas)) {
				return that.error($this,'luhn_error');
			}
			return that.success($this,'ok');
		}
		
		if (rule == "required") {
			// Tagname, type and other necessary stuff
			var tagName = $this.prop("tagName");
			var type = $this.attr('type');
			var name = $this.attr('name');


			
			//are we talking about inputs because it might be a select
			if (tagName == "INPUT") {
				//is it a text input? 
				if (type == 'text' || type == 'password' || type == 'phone' || type == 'tel') { 
					if (this.isEmpty($this)) {
						return that.error($this,'empty');
					}
					return that.success($this,'ok');
				}
				//is it a radio input? 
				if (type == 'radio') { 
					// Gets similar radio button (same name)
					// @todo we wanna interact with ALL radios or one at a time?
					var $allradios =  this.obj.find('input[name=' + name + ']');
					if (this.isRadioEmpty($allradios)) {
						return that.error($allradios,'empty');
					}
					return that.success($allradios,'ok');
				}
				//is it a radio input? 
				if (type == 'checkbox') { 
					if (!this.isChecked($this)) {
						return that.error($this,'empty');
					}
					return that.success($this,'ok');
				}

				//validating emails
				if (type == 'email') {
					if (!this.isValidEmail($this)) {
						return that.error($this,'invalid_mail');
					}
					return that.success($this,'ok');
				}
			}

			//validating textarea
			if (tagName == "TEXTAREA") {
				if (this.isEmpty($this)) {
					return that.error($this,'empty');
				}
				return that.success($this,'ok');
			}
			
			//are we talking about selects because it might be an input
			if (tagName == "SELECT") {
				//the first option of the list should not have a value...
				if (this.isSelectEmpty($this)) {   
					return that.error($this,'unselected');
				} 
				return that.success($this,'ok');                 
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
			var fields_array = Array();

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

			} else {

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
	};
	
	this.error = function(elem,code,related_elems) {
		// Error callback
		this.settings.onError(elem,code,related_elems);
		return true;
	};

	this.success = function(elem,code,related_elems) {
		// Success callback
		this.settings.onSuccess(elem,code,related_elems);
		return false;
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
	this.isEmptySmart = function(elem) {
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
	this.isEmpty = function(elem) {
		return (elem.val() === '' || !elem.val() || elem.val() == '-1');
	};
	
	// Email validation
	this.isValidEmail = function(elem) {
		//regex for validating email
		//accepts + in gmail         
		var pattern = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i;
		return (pattern.test(elem.val()));
	};
	
	// Check if all options are ''
	this.isSelectEmpty = function(elem) {
		return (this.isEmpty(elem.find("option:selected")));
	};
	
	this.isChecked = function(elem) {
		return elem.is(':checked');
	};
	// Check if all radio buttons are unselected
	this.isRadioEmpty = function(elem) {
						
		var radioError = true;
		
		elem.each(function() {
		
			var $this = $(this); 
			if($(this).is(":checked")) {
				radioError = false;
			}
			
		});
		
		return radioError;
	};

	/**
	*	Check regEx rules
	*/
	this.matchRegExp = function(elem, data) {
		var datas = data;
		var testedValue = this.get_value(elem);
		var modifiers = 'gi';
		if (typeof datas.modifiers != 'undefined') {
			modifiers = datas.modifiers;
		}
		var regex = new RegExp(data.regexp, modifiers);

		return regex.test(testedValue);
	};


	/** Can only be an array
	* @param [array] aElem 
	* @return {boolean} [true if all the object are the same]
	*/
	this.isDifferent = function(aElem) {
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
	* 
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
					if ($(this).is(":checked")) {
						return $this.val();
					}
				});
				return "";
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

	/**
	*
	*/
	this.check_luhn = function(cc_number)
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
};
