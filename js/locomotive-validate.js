(function ( $ ) {    

    var Locomotive_Validate = function(obj){

        this.obj = obj;
        

        this.validate = function(){
            $this = this.obj;

            //are we talking about inputs because it might be a select
            if ($this.prop("tagName") == "INPUT") {

               //is it a text input? 
               if ($this.attr('type') == 'text') { 
                    
                    //basic validation for text inputs
                    if ($this.val() === '' || !$this.val()) {

                        $this.parent('label').addClass("error");
                        $this.addClass('error');
                    }

                    else {
                        $this.removeClass('error');
                        $this.parent('label').removeClass("error");
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
                    //regex for validating email
                    //accepts + in gmail         
                    //@todo maybe find an even better regex?          
                    var pattern = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i;

                    if(!pattern.test($this.val()))
                    {
                        $this.parent('label').addClass("error");
                        $this.addClass('error');
                    }

                    else {
                        $this.parent('label').removeClass("error");
                        $this.removeClass('error');
                    }   
                }
            }


            //validating textarea
            if ($this.prop("tagName") == "TEXTAREA") {

                //basic validation for text inputs
                if ($this.val() === '' || !$this.val()) {

                    $this.parent('label').addClass("error");
                    $this.addClass('error');
                }

                else {
                    $this.parent('label').removeClass("error");
                    $this.removeClass('error');
                }   

            }
            //are we talking about selects because it might be an input
            if ($this.prop("tagName") == "SELECT") {

                //the first option of the list should not have a value...
                if ($this.find("option:selected").val() === "") {   
                    $this.parent('label').addClass("error");
                    $this.parents(".selector").addClass("error");
                } 

                else {
                    $this.parent('label').removeClass("error");
                    $this.parents(".selector").removeClass("error");
                }                   
            }

        };

        this.error = function(){

        };

        this.success = function(){
       
        };

    };


    $.fn.lvalidate = function(options) {
        var defauts=
        {   
            "uniform" : false,
            "popup"   : false,
            "callback": null
        };

        var settings=$.extend(defauts, options); 

        var $this = $(this);
        var form = $this.parents('form');
        var required_fields = form.find('.required');

        var error = false;


        this.click(function(e) {

            e.preventDefault();          
            
            required_fields.each(function(i,e) {    
               var $this = $(this); 

               //creatobect
               $data = new Locomotive_Validate($this);

             //  $this.data('locomotive_validate',$data);            

               //call the functions in validate
               $data.validate();


                // @todo type = CHECKBOX
            }); 

            //ajouté un callback pour ajouter tes propres trucs
           if(settings.callback)
           {
              settings.callback();
           }   

        }); 
    };
 
}( jQuery ));



