(function ( $ ) {
 
    $.fn.lvalidate = function(options) {

        this.click(function(e) {
            e.preventDefault();

            var $this = $(this);
            var form = $this.parents('form');
            var required_fields = form.find('.required');

            var error = false;

           
            var parametres=$.extend(defauts, options); 
            var defauts=
            {
                "popup"   : false,
                "callback": null
            };

            required_fields.each(function(i,e) {    
                var $this = $(this); 

                //are we talking about inputs because it might be a select
                if ($this.prop("tagName") == "INPUT") {

                   //is it a text input? 
                   if ($this.attr('type') == 'text') { 
                        
                        //basic validation for text inputs
                        if ($this.val() === '' || !$this.val()) {

                            $this.addClass('error');
                        }

                        else {
                            $this.removeClass('error');
                        }   

                    }

                    //is it a radio input? 
                    if ($this.attr('type') == 'radio') { 
                        
                        var $name =  $this.attr("name");
                        var $allradios =  form.find('input[name=' + $name + ']');
                        //console.log($name);
                       
                        $allradios.each(function() { 
                            
                           var $this = $(this); 
                            
                           if($allradios.is(":checked")) {

                                $this.parents(".radio").removeClass("error");
                           }

                           else {
                                $this.parents(".radio").addClass("error");
                           }
                       });

                    }

                  //validating emails
                    if ($this.attr('type') == 'email') { 
                        var pattern = /^\b[A-Z0-9._%\-]+@[A-Z0-9.\-]+\.[A-Z]{2,4}\b$/i;

                        if(!pattern.test($this.val()))
                        {
                            $this.addClass('error');
                        }

                        else {
                            $this.removeClass('error');
                        }   
                    }
                }

                //validating textarea
                if ($this.prop("tagName") == "TEXTAREA") {

                    //basic validation for text inputs
                    if ($this.val() === '' || !$this.val()) {

                        $this.addClass('error');
                    }

                    else {
                        $this.removeClass('error');
                    }   

                }
                //are we talking about selects because it might be an input
                if ($this.prop("tagName") == "SELECT") {

                    //the first option of the list should not have a value...
                    if ($this.find("option:selected").val() === "") {   

                        $this.parents(".selector").addClass("error");
                    } 

                    else {
                       
                        $this.parents(".selector").removeClass("error");
                    }                   
                }
                // @todo type = CHECKBOX
            }); 

            //ajouté un callback pour ajouter tes propres trucs
           if(parametres.callback)
           {
              parametres.callback();
           }   

        }); 
    };
 
}( jQuery ));