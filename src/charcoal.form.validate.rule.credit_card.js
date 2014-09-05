/**
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
