<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title></title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width">

        <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->

        <link rel="stylesheet" href="css/normalize.css">
        <link rel="stylesheet" href="css/main.css">
        <script src="js/vendor/modernizr-2.6.2.min.js"></script>
    </head>
    <body>
        <!--[if lt IE 7]>
            <p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">activate Google Chrome Frame</a> to improve your experience.</p>
        <![endif]-->

        <!-- Add your site or application content here -->
        <form>  
            <label>
                hey
                <input type="text" class="required"></input>
            </label>

            <label>
                hey
                <input type="text" class="required"></input>
            </label>

             <label>
                email
                <input type="email" class="required"></input>
            </label>           

             <label>
                email
                <input type="email" class="required"></input>
            </label>     
             <label>
                email
                <textarea class="required"></textarea>
            </label>  

             <label>
                email
                <textarea class="required"></textarea>
            </label>   


            <select class="required">
              <option value="">title</option>
              <option value="bla">Orange</option>
              <option value="bla">Pineapple</option>
              <option value="bla">Banana</option>
            </select>


            <select class="required">
              <option value="">title</option>
              <option value="bla">Orange</option>
              <option value="bla">Pineapple</option>
              <option value="bla">Banana</option>
            </select>

            <select class="required">
              <option value="">title</option>
              <option value="bla">Orange</option>
              <option value="bla">Pineapple</option>
              <option value="bla">Banana</option>
            </select>

            <div class="note cf">
                <div class="five columns alpha">
                    <label data-message="fgdg">Apparence des employ&eacute;s*</label>
                </div>
                <div class="one columns">
                    <input type="radio" name="radio1" class="required"   value="Excellent"<?php echo isset($_REQUEST['appearance']) && $_REQUEST['appearance']== 'Excellent' ? ' checked="checked"':''; ?>  data-validation="required" data-message="Veuillez r&eacute;pondre &agrave; la question">
                </div>
                <div class="one columns">
                    <input type="radio"  name="radio1" value="Bon"<?php echo isset($_REQUEST['appearance']) && $_REQUEST['appearance']== 'Bon' ? ' checked="checked"':''; ?>  data-validation="required" data-message="Veuillez r&eacute;pondre &agrave; la question">
                </div>
                <div class="one columns">
                    <input type="radio"  name="radio1" value="Passable"<?php echo isset($_REQUEST['appearance']) && $_REQUEST['appearance']== 'Passable' ? ' checked="checked"':''; ?>  data-validation="required" data-message="Veuillez r&eacute;pondre &agrave; la question">
                </div>
                <div class="one columns omega">
                    <input type="radio"  name="radio1" value="Inacceptable"<?php echo isset($_REQUEST['appearance']) && $_REQUEST['appearance']== 'Inacceptable' ? ' checked="checked"':''; ?> data-validation="required" data-message="Veuillez r&eacute;pondre &agrave; la question">
                </div>
            </div>


            <div class="note cf">
                <div class="five columns alpha">
                    <label data-message="fgdg">Apparence des employ&eacute;s*</label>
                </div>
                <div class="one columns">
                    <input type="radio" name="radio2" class="required"   value="Excellent"<?php echo isset($_REQUEST['appearance']) && $_REQUEST['appearance']== 'Excellent' ? ' checked="checked"':''; ?>  data-validation="required" data-message="Veuillez r&eacute;pondre &agrave; la question">
                </div>
                <div class="one columns">
                    <input type="radio"  name="radio2" value="Bon"<?php echo isset($_REQUEST['appearance']) && $_REQUEST['appearance']== 'Bon' ? ' checked="checked"':''; ?>  data-validation="required" data-message="Veuillez r&eacute;pondre &agrave; la question">
                </div>
                <div class="one columns">
                    <input type="radio"  name="radio2" value="Passable"<?php echo isset($_REQUEST['appearance']) && $_REQUEST['appearance']== 'Passable' ? ' checked="checked"':''; ?>  data-validation="required" data-message="Veuillez r&eacute;pondre &agrave; la question">
                </div>
                <div class="one columns omega">
                    <input type="radio"  name="radio2" value="Inacceptable"<?php echo isset($_REQUEST['appearance']) && $_REQUEST['appearance']== 'Inacceptable' ? ' checked="checked"':''; ?> data-validation="required" data-message="Veuillez r&eacute;pondre &agrave; la question">
                </div>
            </div>


            <div class="note cf">
                <div class="five columns alpha">
                    <label data-message="fgdg">Apparence des employ&eacute;s*</label>
                </div>
                <div class="one columns">
                    <input type="radio" name="radio3" class="required" value="Excellent"<?php echo isset($_REQUEST['appearance']) && $_REQUEST['appearance']== 'Excellent' ? ' checked="checked"':''; ?>  data-validation="required" data-message="Veuillez r&eacute;pondre &agrave; la question">
                </div>
                <div class="one columns">
                    <input type="radio"  name="radio3" value="Bon"<?php echo isset($_REQUEST['appearance']) && $_REQUEST['appearance']== 'Bon' ? ' checked="checked"':''; ?>  data-validation="required" data-message="Veuillez r&eacute;pondre &agrave; la question">
                </div>
                <div class="one columns">
                    <input type="radio"  name="radio3" value="Passable"<?php echo isset($_REQUEST['appearance']) && $_REQUEST['appearance']== 'Passable' ? ' checked="checked"':''; ?>  data-validation="required" data-message="Veuillez r&eacute;pondre &agrave; la question">
                </div>
                <div class="one columns omega">
                    <input type="radio"  name="radio3" value="Inacceptable"<?php echo isset($_REQUEST['appearance']) && $_REQUEST['appearance']== 'Inacceptable' ? ' checked="checked"':''; ?> data-validation="required" data-message="Veuillez r&eacute;pondre &agrave; la question">
                </div>
            </div>

            
            <input class="lvalidate" type="submit"></input>


        </form>


        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
        <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.9.1.min.js"><\/script>')</script>
        <script src="js/locomotive-validate.js"></script>
        <script src="js/jquery.uniform.min.js"></script>

        <script src="js/main.js"></script>

        <!-- Google Analytics: change UA-XXXXX-X to be your site's ID. -->
        <script>
            var _gaq=[['_setAccount','UA-XXXXX-X'],['_trackPageview']];
            (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
            g.src='//www.google-analytics.com/ga.js';
            s.parentNode.insertBefore(g,s)}(document,'script'));
        </script>


    
        <script type="text/javascript" charset="utf-8">
            $(document).ready(function() {
                    
                $(".lvalidate").lvalidate({"callback" : function(){
                    alert('fonction callback');
                }});     

                $("input[type=radio], select").uniform();                   

            });    
        </script>    


    </body>
</html>
