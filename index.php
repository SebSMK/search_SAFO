<!DOCTYPE html>
<html>
  <head>
  	<meta charset="utf-8">
	<meta content="IE=edge" http-equiv="X-UA-Compatible">
	<meta content="Supporters Static Mockups" name="description">
	<link href="favicon.ico" type="image/x-icon" rel="icon">	
  	
  	<title>SMK | Søg i Samling</title>
  

	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
	<script src="http://code.jquery.com/jquery-migrate-1.2.1.js"></script>
	<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.24/jquery-ui.min.js"></script>
			
	<script src="js/smk.search.mini-1.003.0014.js" type="text/javascript"></script>
	
	<script src="src/managers/ModelManager.js" type="text/javascript"></script>		
	
	<script src="js/supplier/jquery.highlight.js" type="text/javascript"></script>  	
	<script src="js/supplier/backtotop/js/main.js" type="text/javascript"></script>
	<script src="js/supplier/backtotop/js/modernizr.js" type="text/javascript"></script>
  	<script src="js/supplier/imagesloaded.pkgd.min.js" type="text/javascript"></script>  
	<script src="js/supplier/fancybox/source/jquery.fancybox.pack.js" type="text/javascript"></script>
	<script src="js/supplier/jquery.address.js" type="text/javascript"></script>
	<script src="js/supplier/spin.min.js" type="text/javascript"></script>	
  	<script src="js/supplier/chosen.jquery.min.js" type="text/javascript"></script>	      
	<script src="js/supplier/typeahead.bundle.js" type="text/javascript"></script>  
	<script src="js/supplier/sprintf.min.js" type="text/javascript"></script>
	<script src="js/supplier/jquery.visible.min.js" type="text/javascript"></script>
	<script src="js/supplier/feed.js" type="text/javascript"></script>
	<script src="js/supplier/dotdotdot.js" type="text/javascript"></script>
	<script src="js/supplier/dotdotdot-config.js" type="text/javascript"></script>
	<!-- Google Tag Manager -->
	<noscript><iframe src="//www.googletagmanager.com/ns.html?id=GTM-TH787P"
	height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
	<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
	new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
	j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
	'//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
	})(window,document,'script','dataLayer','GTM-TH787P');</script>
	<!-- End Google Tag Manager -->


	
	<link rel="stylesheet" type="text/css" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.24/themes/smoothness/jquery-ui.css" media="all" />
	<link rel="stylesheet" type="text/css" href="js/supplier/fancybox/source/jquery.fancybox.css" media="all" />	
	<link rel="stylesheet" type="text/css" href="js/supplier/backtotop/css/style.css" media="all" />
	<link rel="stylesheet" type="text/css" href="css/app.css" media="all" />
	<link rel="stylesheet" type="text/css" href="css/smk_modif.css" media="all" />
	<link rel="stylesheet" type="text/css" href="css/print.css" media="print" />

</head>
  <body>

<?php


echo main();

function main() {			
	$content = '';
	
	//* check browser version
	$check_browser = false; 		
	$pattern = '/(?i)msie [4-8]/';
	$u_agent = $_SERVER['HTTP_USER_AGENT'];		

	if(preg_match($pattern,$u_agent))
	{
		// browser is configured in compatibility mode IE <= 8... 
		// ... we must check the "real" IE version			
		$pattern = '/(?i)trident\/\d{1,2}.\d{1,2}/';
		preg_match($pattern, $u_agent, $matches);
		
		if(count($matches) > 0){
			$str = $matches[0];
			
			preg_match_all('!\d+!', $str, $matches_v);
			
			if(count($matches_v) > 0 && count($matches_v[0]) > 0 && $matches_v[0][0] > 4){
				// browser is IE > 8
				$check_browser = true;					
			}				
		}						
	}
	else{
		// browser is IE > 8 or other than IE
		$check_browser = true;
	};				
	
	
	
	//* proceed plugin if browser is IE > 8 or other than IE
	if ($check_browser == true)
	{	
		//echo 'ok';					
		//* get search string in POST
		$sword =  '';//htmlspecialchars($this->piVars['sword']);			
		$dir_base = dirname($_SERVER['PHP_SELF']) == '/' ? "" :  dirname($_SERVER['PHP_SELF']);
		//$dir_base .= t3lib_extMgm::siteRelPath('smk_search_all');						
		$solr_path = 'http://solr-02.smk.dk:8080/solr/prod_all_dk';
		$language = 'dk';
		
		
		//* in first place, we create a dummy page (below in $content) that will be replaced by the Widgets on loading
		//* this trick is implemented in order to avoid a glitch between the call from search form and widget's loading
		$content = sprintf('
		
				<script>
		
				var smkSearchAllConf = {
					solrPath: "%s/",
					pluginDir: "%s/",
					serverName: "%s/",
					currentLanguage: "%s",
					searchStringPOST: "%s"
				}
		
				</script>
					
				<div id="smk_search_wrapper">
				
				</div>',
					
				$solr_path,
				$dir_base,
				$_SERVER['SERVER_NAME'],
				$language,
				$sword						
		);
		
	}else{
		// IE<=8
		$content = sprintf('
					
				<div id="smk_search_wrapper">
				<div class="view">
				<div class="container">
				<section class="section--main" role="main">
				<div class="" id="smk_teasers">
				<div id="smk_search_info" style="
				    left: 25%%;
				    padding-left: 2px;
				    padding-right: 2px;
				    top: 10%%;
				    width: 50%%;
				"
				class="tooltipster-base tooltipster-shadow tooltipster-fade tooltipster-fade-show">
		
				<div class="tooltipster-content">
				%s
				</div>
		
				</div>
					
					
				</div>
				</section>
				</div>
				</div>
				</div>',
					
				"You're version of Internet Explorer is outdated.<br><br>Please update Internet Explorer, or try accessing our website with another browser (Firefox, Safari, Opera...).<br><br>Thank you for your understanding."
		
		);			
	}

	return $content;
}


?>

  </body>
</html>
