(function ( $ ) {
 
    $.fn.lvalidate = function() {


        this.click(function(e) {
             e.preventDefault();

            alert('test');
/*

            e.preventDefault();
            var $this = $(this);
            var form = $this.parents('form');
            var required_fields = form.find('.required');
            var error = false;
            
        

            required_fields.each(function(i,e) {

                if ($(this).val() == '' || !$(this).val()) {
                    $(this).parent('label').addClass('error');
                    error = true;
                } else {
                    $(this).parent('label').removeClass('error');

                }

            });


            if ($('.form select.required').val() == "blank") {

                $('.form .selector').css("border", "1px solid red");
                error = true;

            }

            else {

                $('.form .selector').css("border", "none");

            };



            
            if (error) {
                // handle error
                //alert('erreur');
            } else {
                form.submit();
                
            }
  */          
        });


      
 
    };
 
}( jQuery ));