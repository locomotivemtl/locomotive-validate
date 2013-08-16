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
			"onError": function(e) {
			
			},
			"onSuccess": function(e) {
			
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
		var form = this.obj;
		
		// Required fields comes from the requiredClass setting
		var required_fields = form.find('.'+this.settings.requiredClass);
		
		// Scoping
		var that = this;
		
		// Error var
		var error = false;
		
		// Looping the inputs.
		required_fields.each(function(i,e) {
			error = that.validate_input($(this));
		});
		
		// If there's an error, heres the callback
		// @todo create an Error object.
		if (error) {
			this.settings.invalid(this.obj);
		} else {
			this.settings.valid(this.obj);
		}
	};

	this.validate_input = function(input) {
		var $this = input;
		// Scoping
		var that = this;
		
		// Tagname, type and other necessary stuff
		var tagName = $this.prop("tagName");
		var type = $this.attr('type');
		var name = $this.attr('name');
		
		
		//are we talking about inputs because it might be a select
		if (tagName == "INPUT") {
		   //is it a text input? 
		   if (type == 'text') { 
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
				// These should be in the error function
				// $this.parent('label').addClass("error");
				// $this.parents(".selector").addClass("error");
			} 
			return that.success($this,'ok');                 
		}
		
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
		return (elem.val() == '' || !elem.val());
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

}


