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
               
                //simple inputs 
                if ($this.is("input")) {                    
                        
                    console.log($this.val());

                    if ($this.val() == '' || !$this.val()) {

                        $this.addClass('error-input');
                    }

                    else {
                        $this.removeClass('error-input');
                    }                  
                }; 


                //select
                if ($this.is("select")) {
                   if ($this.find("option:selected").val() == "") {   

                        $this.parents(".selector").addClass("error-select");
                    } 

                    else {
                       
                        $this.parents(".selector").removeClass("error-select");
                    }        
                   
                }

                //radio
                if ($this.is(":radio")) {
                   
                    if ($radioinput.is(':checked')){

                        $radioinput.parents(".radio").removeClass("error");
                       // $this.parents('.note').find('label').css("color", "#6c413b").removeClass("error");
                       //$this.parents('.note').find('label').data('checked', true);
                    }

                    else {

                        $radioinput.parents(".radio").addClass("error");

                        if (!$this.parents('.note').find('label').data('checked')) {
                           // $this.parents('.note').find('label').css("color", "#a62122").addClass("error");
                        };                        
                    }                   
                }
            });     
        }); 
    };
 
}( jQuery ));