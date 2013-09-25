(function ( $ ) {    

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
        var defauts=
        {   
            // "uniform" : false, // You decide the error handlings in the instanciation of the plugin.
            // "popup"   : false, // You decide the error handlings in the instanciation of the plugin.
			"requiredClass":"required",
			"similarClass":"similar",
			"onError": function(e,c) {
			
			},
			"onSuccess": function(e,c) {
			
			},
			"onFirstError" : function(elem,code) {
			},
			"custom_validation" : function(lvalidate) {
				return true;
			}
        };
		
		/**
		*	Extended settings
		*/
        var settings=$.extend(defauts, options); 

		$(this).each(function(i,e) {
			// We want the actual form to be in the settings as "obj"
			settings['obj'] = $(this);
			
			// We implement a new instance of the Locomotive_Validate Class
			var data = new Locomotive_Validate(settings);
			
			// We wanna have access to these datas later on.
			$(this).data('lvalidate',data);
		});
		
		/**
		*	On submit, we wanna prevent default (the actual submit.)
		*	Validation should occur there
		*/
		$(this).find('input[type=submit]').click(function(e) {	
			e.preventDefault();
			var form = $(this).parents('form');
			var lvalidate = form.data('lvalidate');
			
			// We call the validation
			// All the handlers for success or error are within the "lvalidate" datas.
			lvalidate.validate();
		});

    };
 
}( jQuery ));

/***
*	Locomotive_Validate js Class
*	Validates the form with the parameters
*	
*	@param {object} opts
*		{
*			obj : [Form element],
*			requiredClass : 'required',
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
var Locomotive_Validate = function(opts){

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


		// if(no_error) {
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

		// }
		
		// If there's an error, heres the callback
		// @todo create an Error object.
		if (!no_error) {
			this.settings.invalid(this.obj);
		} else {
			this.settings.valid(this.obj);
		}
	};

	this.validate_input = function(input, option) {
		if (!option) {
			option = "required";
		};
		var $this = input;
		// Scoping
		var that = this;
		
		if (option == "required") {
			// Tagname, type and other necessary stuff
			var tagName = $this.prop("tagName");
			var type = $this.attr('type');
			var name = $this.attr('name');
			// console.log(name);
			
			//are we talking about inputs because it might be a select
			if (tagName == "INPUT") {
			   //is it a text input? 
			   if (type == 'text' || type == 'password') { 
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
		if (option == "similar") {
			if ($this.attr("data-related")) {
				var related = $this.attr("data-related");
				var related_inputs = this.form.find("[name="+related+"]");

				if (this.isDifferent([$this,related_inputs])) {
					return that.error(related_inputs,'similar',$this);
				}
				return that.success(related_inputs,'Similar');

			};
			return that.success($this,"no-related-elements");
		};
	}
	
	this.error = function(elem,code) {
		// Error callback
		this.settings.onError(elem,code);
		return true;
	};

	this.success = function(elem,code) {
		// Success callback
		this.settings.onSuccess(elem,code);
		return false;
	};
	
	this.listeners = function() {
		// We might wanna add custom listeners like "focus, blur, click, etc"
	}
	
	
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
	
	// Check if val == '';
	this.isEmpty = function(elem) {
		return (elem.val() == '' || !elem.val() || elem.val() == '-1');
	}
	
	// Email validation
	this.isValidEmail = function(elem) {
		//regex for validating email
		//accepts + in gmail         
		var pattern = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i;
		return (pattern.test(elem.val()));
	}
	
	// Check if all options are ''
	this.isSelectEmpty = function(elem) {
		return (this.isEmpty(elem.find("option:selected")));
	}
	
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
	}

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
			if (i == 0) {
				sameValueFound = that.get_value(aElem[i]);
				// sameValueFound = that.get_value($(this));
				// return true;
				continue;
			}
			if (sameValueFound != that.get_value(aElem[i])) {
			// if (sameValueFound != that.get_value($(this))) {
				sameError = true;
			};

		}
		// });

		return sameError;	
	}

	/**
	* 
	*/
	this.get_value = function(elem) 
	{
		var $this = elem;
		var tagName = $this.prop("tagName");
		var type = $this.attr('type');
		var name = $this.attr('name');
		
		
		//are we talking about inputs because it might be a select
		if (tagName == "INPUT") {
		   //is it a text input? 
			if (type == 'text' || type == 'email' || type == 'password') { 
				return $this.val();
		 	}
			//is it a radio input? 
			if (type == 'radio') { 
				var $allradios =  this.obj.find('input[name=' + name + ']');
				
				$allradios.each(function(i,e){
					if ($(this).is(":checked")) {
						return $this.val();
					};
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

	}
}
