(function ( $ ) {
 
    $.fn.lvalidate = function() {


        this.click(function(e) {
            e.preventDefault();

            var $this = $(this);
            var form = $this.parents('form');
            var required_fields = form.find('.required');

            var error = false;

            var $select     = $this.parents(".selector"); 
            var $radioinput = $this.parents(".radio"); 
            var $radiolabel = $this.parents('label');
            var $input = $this.is("input");


            required_fields.each(function(i,e) {    
                var $this = $(this); 

                //are we talking about inputs because it might be a select
                if ($this.prop("tagName") == "INPUT") {

                   //is it a text input? 
                   if ($this.attr('type') == 'text') { 
                        
                        //basic validation for text inputs
                        if ($this.val() === '' || !$this.val()) {

                            $this.addClass('error-input');
                        }

                        else {
                            $this.removeClass('error-input');
                        }   

                    }

                    //is it a radio input? 
                    if ($this.attr('type') == 'radio') { 
                        
                        var $name =  $this.attr("name");
                        var $allradios =  form.find('input[name=' + $name + ']')
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
                }

                //are we talking about selects because it might be an input
                if ($this.prop("tagName") == "SELECT") {

                    //the first option of the list should not have a value...
                    if ($this.find("option:selected").val() === "") {   

                        $this.parents(".selector").addClass("error-select");
                    } 

                    else {
                       
                        $this.parents(".selector").removeClass("error-select");
                    }                   
                }
            });     
        }); 
    };
 
}( jQuery ));