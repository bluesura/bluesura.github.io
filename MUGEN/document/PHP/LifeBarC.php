<?php

require_once('C:\libs\php\smarty\Smarty.class.php');
$smarty = new Smarty();

// ini_set( 'display_errors', 1 );
// $smarty->debugging = true;

/* json */
$loop_start = 0;
$loop_end = count($output_list);

$template_pass = "./../Template/LifeBar/";
$json = json_decode(file_get_contents("./../LifebarCollection/json/".$state_name.".json"), true);

for ($i = $loop_start; $i < $loop_end; $i++) {
	// $json["categories"] = $categories;

	$smarty->assign('content', $json);

	$output = $smarty->fetch($template_pass.'LifeBar.tpl');

	file_put_contents("./../LifebarCollection/".$state_name.".html", $output);
}


echo file_get_contents("./../LifebarCollection/index.html");
?>