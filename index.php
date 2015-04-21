<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
  <meta http-equiv="content-type" content="text/html; charset=utf-8">  
  <title>SMK Søg i Samling</title>
  

	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
	<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.24/jquery-ui.min.js"></script>
	
	<script src="js/common.smk.js" type="text/javascript"></script>
	<script src="js/language.js" type="text/javascript"></script>
	<script src="js/config.js" type="text/javascript"></script>
	<script src="managers/ModelManager.js" type="text/javascript"></script>
	
	<script src="managers/WidgetsManager.js" type="text/javascript"></script>
	<script src="core/Core.js" type="text/javascript"></script>
	<script src="core/AbstractManager.js" type="text/javascript"></script>
	<script src="managers/smkManager.jquery.js" type="text/javascript"></script>
	<script src="core/Parameter.js" type="text/javascript"></script>
	<script src="core/ParameterStore.js" type="text/javascript"></script>
	<script src="core/smkParameterStore.js" type="text/javascript"></script>
	<script src="core/AbstractWidget.js" type="text/javascript"></script>
	<script src="widgets/DetailWidget.js" type="text/javascript"></script>
	<script src="widgets/DetailTabsWidget.js" type="text/javascript"></script>
	<script src="widgets/OriginalWidget.js" type="text/javascript"></script>
	<script src="widgets/ThumbsWidget.js" type="text/javascript"></script>
	<script src="widgets/TeasersWidget.js" type="text/javascript"></script>	
	<script src="widgets/PagerWidget.js" type="text/javascript"></script>
	<script src="widgets/SearchInfoWidget.js" type="text/javascript"></script>	
	<script src="widgets/ScrollWidget.js" type="text/javascript"></script>
	<script src="widgets/LanguagePickerWidget.js" type="text/javascript"></script>	
	<script src="widgets/ScrollUpdateManagerWidget.js" type="text/javascript"></script>		
	<script src="js/jquery/jquery.highlight.js" type="text/javascript"></script>		
	<script src="core/AbstractFacetWidget.js" type="text/javascript"></script>
	<script src="widgets/SearchFiltersWidget.js" type="text/javascript"></script>
	<script src="widgets/CategoryWidget.js" type="text/javascript"></script>
	<script src="widgets/CurrentSearchWidget.js" type="text/javascript"></script>
	<script src="managers/EventsManager.js" type="text/javascript"></script>
   
	<script src="managers/ViewManager.js" type="text/javascript"></script>                   
	<script src="core/AbstractTextWidget.js" type="text/javascript"></script>
	<script src="widgets/SearchBoxWidget.js" type="text/javascript"></script>
	<script src="widgets/SearchBoxAutoWidget.js" type="text/javascript"></script>
	<script src="js/sprintf.min.js" type="text/javascript"></script>
	<script src="js/mustache.smk.js" type="text/javascript"></script>
	<script src="js/jquery.cookie.js" type="text/javascript"></script>
	<script src="js/masonry.pkgd.min.js" type="text/javascript"></script>
	<script src="js/masonry.smk.extend.js" type="text/javascript"></script>

	<script src="js/chosen.jquery.min.js" type="text/javascript"></script>
	<script src="js/jquery.dimensions.js" type="text/javascript"></script>
	<script src="widgets/ViewPickerWidget.js" type="text/javascript"></script>
	<script src="widgets/SorterWidget.js" type="text/javascript"></script>
	
	<script src="js/jquery.tooltipster.js" type="text/javascript"></script>
	<script src="js/imagesloaded.pkgd.min.js" type="text/javascript"></script>  
	<script src="js/fancybox/source/jquery.fancybox.pack.js" type="text/javascript"></script>
	<script src="js/jquery.address-1.5.min.js" type="text/javascript"></script>
	<script src="js/jquery.mousewheel.min.js" type="text/javascript"></script>
	<script src="js/spin.min.js" type="text/javascript"></script>
	<script src="js/queueProcessor.js" type="text/javascript"></script>	
	<script src="js/sorter.js" type="text/javascript"></script>	
	<script src="js/backtotop/js/main.js" type="text/javascript"></script>
	<script src="js/backtotop/js/modernizr.js" type="text/javascript"></script>		
	<script src="data/getData_Common_functions.js" type="text/javascript"></script>	
	<script src="data/getData_Detail.js" type="text/javascript"></script>
	<script src="data/getData_Detail_Tabs.js" type="text/javascript"></script>
	<script src="data/getData_Detail_Standard.js" type="text/javascript"></script>
	<script src="data/getData_Original.js" type="text/javascript"></script>
	<script src="data/getData_Detail_Extented.js" type="text/javascript"></script>		
	<script src="data/getData_Teasers.js" type="text/javascript"></script>		
	
	<link rel="stylesheet" type="text/css" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.24/themes/smoothness/jquery-ui.css" media="all" />
	<link rel="stylesheet" type="text/css" href="js/fancybox/source/jquery.fancybox.css" media="all" />	
	<link rel="stylesheet" type="text/css" href="js/backtotop/css/style.css" media="all" />
	<link rel="stylesheet" type="text/css" href="css/app.css" media="all" />
	<link rel="stylesheet" type="text/css" href="css/smk_modif.css" media="all" />
	<link rel="stylesheet" type="text/css" href="css/smk_print.css" media="print" />

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
