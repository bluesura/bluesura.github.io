<?php

require_once('C:\libs\php\smarty\Smarty.class.php');
$smarty = new Smarty();
ini_set( 'display_errors', 0 );
$smarty->debugging = false;
/*
 sidebar
*/
$sidebar = [];

array_push($sidebar, "<label for=\"menu_bar01\">+ State Controller Reference</label><input type=\"checkbox\" id=\"menu_bar01\" class=\"accordion\" /><ul id=\"links01\">");
array_push($sidebar, "<li><a href=\"/MUGEN/document/State/index.html\">Top Page</a></li>");
$list = json_decode(file_get_contents("./../State/json/state_list.json"), true);
$loop_end = count($list);
for ($i = 0; $i < $loop_end; $i++) {
  array_push($sidebar, "<li><a href=\"/MUGEN/document/State/".$list[$i].".html\">".$list[$i]."</a></li>");
}
array_push($sidebar, "</ul>");

array_push($sidebar, "<label for=\"menu_bar02\">+ Trigger Reference</label><input type=\"checkbox\" id=\"menu_bar02\" class=\"accordion\" /><ul id=\"links02\">");
array_push($sidebar, "<li><a href=\"/MUGEN/document/Trigger/index.html\">Top Page</a></li>");
$list = json_decode(file_get_contents("./../Trigger/json/trigger_list.json"), true);
$loop_end = count($list);
for ($i = 0; $i < $loop_end; $i++) {
  array_push($sidebar, "<li><a href=\"/MUGEN/document/Trigger/".$list[$i].".html\">".$list[$i]."</a></li>");
}
array_push($sidebar, "</ul>");


array_push($sidebar, "<label for=\"menu_bar03\">+ LifeBar Reference</label><input type=\"checkbox\" id=\"menu_bar03\" class=\"accordion\" /><ul id=\"links03\">");
array_push($sidebar, "<li><a href=\"/MUGEN/document/Lifebar/index.html\">Top Page</a></li>");
$list = array("Combo", "Face","FightFx", "Files", "LifeBar","Name", "PowerBar","Round", "SimulFace", "SimulLifeBar", "SimulName","Time", "TurnsFace", "TurnsLifeBar", "TurnsName", "WinIcon");
$loop_end = count($list);
for ($i = 0; $i < $loop_end; $i++) {
  array_push($sidebar, "<li><a href=\"/MUGEN/document/Lifebar/".$list[$i].".html\">".$list[$i]."</a></li>");
}
$list = array("BeginAction", "MakeFont");
$loop_end = count($list);
for ($i = 0; $i < $loop_end; $i++) {
  array_push($sidebar, "<li><a href=\"/MUGEN/document/Lifebar/".$list[$i].".html\">".$list[$i]."</a></li>");
}
array_push($sidebar, "</ul>");

/*
 Top Page
*/
$categorie=[];
$categorie["page_title"] = "Name = SURA";
$categorie["page"] = [];
$categorie["page"]["level"] = "1";
$categorie["sidebar"] = $sidebar;
$smarty->assign('content', $categorie);
$output = $smarty->fetch('./../Template/top_page.tpl');
file_put_contents("./../../../index.html", $output);

/*
 State項目
*/
$output_list = json_decode(file_get_contents("./../State/json/state_list.json"), true);

$loop_end = count($output_list);
$categories = [];

/*
 State Index Page
*/
for ($i = 0; $i < $loop_end; $i++) {
  $state_name = $output_list[$i];
  $json = file_get_contents("./../State/json/".$state_name.".json");
  $json = json_decode($json, true);

  $categorie = [];
  $categorie["page_subtitle"] = $json["state"];
  $categorie["description"] = $json["description"];
  $categorie["category"] = $json["category"];
    // // echo $json["state"] . "-------------------------------<br>";
  for ($j = 0; $j < count($json["parameter"]); $j++) {
    $categorie["parameter"][$j] = $json["parameter"][$j]["parameter"]. str_repeat(' ', 27-strlen($json["parameter"][$j]["parameter"]))."= " . implode(", ",$json["parameter"][$j]["value"]);
  }
  array_push($categories, $categorie);
}

//index
$categorie["page"]["level"] = "2";
$categorie["main_title"] = "Name = SURA";
$categorie["page_category"] = "State";
$categorie["page_title"] = "MUGEN State Controller";
$categorie["categories"] = $categories;
$categorie["description"] = "";
$categorie["sidebar"] = $sidebar;

$smarty->assign('content', $categorie);
file_put_contents("./../State/index.html", $smarty->fetch('./../Template/index.tpl'));


/*
 ステートコントローラー
*/
for ($i = 0; $i < $loop_end; $i++) {
  $state_name = $output_list[$i];
  $json = file_get_contents("./../State/json/".$state_name.".json");
  $json = json_decode($json, true);
  
  // 共通パラメーター
  if (strlen($state_name) != 1) {
    array_push($json["parameter"], json_decode(file_get_contents("./../State/json/Persistent.json"), true));
    array_push($json["parameter"], json_decode(file_get_contents("./../State/json/IgnoreHitPause.json"), true));
  }

  $json["main_title"] = "Name = SURA";
  $json["page_title"] = $json["page"]["title"];
  $json["page_category"] = "State";
  $json["page_subtitle"] = $json["page"]["subtitle"];
  $json["categories"] = $categories;
  $json["sidebar"] = $sidebar;

  $smarty->assign('content', $json);
  $output = $smarty->fetch('./../Template/base.tpl');
  // $output = ereg_replace("[\n|\r|\nr|\t]", "", $output);

  file_put_contents("./../State/".$state_name.".html", $output);
}


////////////////////////////////////////////////////////////////////////////////

/*
 Trigger項目
*/
$output_list = json_decode(file_get_contents("./../Trigger/json/trigger_list.json"), true);
$loop_end = count($output_list);
$categories = [];

/*
 Trigger Index Page
*/
for ($i = 0; $i < $loop_end; $i++) {
  $trigger_name = $output_list[$i];
  $json = file_get_contents("./../Trigger/json/".$trigger_name.".json");
  $json = json_decode($json, true);

  $categorie = [];
  $categorie["page_subtitle"] = $json["trigger"];
  $categorie["description"] = $json["summary"];
  $categorie["category"] = $json["category"];
  for ($j = 0; $j < count($json["syntax"]); $j++) {
    $categorie["parameter"][$j] = $json["syntax"][$j];
  }
  array_push($categories, $categorie);
}

//index
$categorie["page"]["level"] = "2";
$categorie["main_title"] = "Name = SURA";
$categorie["page_category"] = "Trigger";
$categorie["page_title"] = "MUGEN Trigger";
$categorie["categories"] = $categories;
$categorie["description"] = "";
$categorie["sidebar"] = $sidebar;

$smarty->assign('content', $categorie);
file_put_contents("./../Trigger/index.html", $smarty->fetch('./../Template/index.tpl'));


/*
 トリガー
*/
for ($i = 0; $i < $loop_end; $i++) {
  $trigger_name = $output_list[$i];
  $json = file_get_contents("./../Trigger/json/".$trigger_name.".json");
  $json = json_decode($json, true);

  $json["main_title"] = "Name = SURA";
  $json["page_title"] = $json["page"]["title"];
  $json["page_category"] = "Trigger";
  $json["page_subtitle"] = $json["page"]["subtitle"];
  $json["categories"] = $categories;
  $json["sidebar"] = $sidebar;

  $smarty->assign("content", $json);
  $output = $smarty->fetch('./../Template/base.tpl');

  file_put_contents("./../Trigger/".$trigger_name.".html", $output);
}



//////////////////////////////////////////////////////////////////////////////////////////////////
/* 初期化 */
$RELATIVE_PATH = "Lifebar";
$MAIN_TITLE = "Name = SURA";
$PAGE_TITLE = "MUGEN LifeBar";
$PAGE_SUBTITLE = "";

/*
 Lifebar項目
*/
$output_list = array(
  "Combo", "Face",
  "FightFx", "Files", "LifeBar",
  "Name", "PowerBar",
  "Round", "SimulFace", "SimulLifeBar", "SimulName",
  "Time", "TurnsFace", "TurnsLifeBar", "TurnsName", "WinIcon"
);
$html_output_list = array(
  "BeginAction", "MakeFont"
);

$categories = [];
$template_pass = "./../Template/LifeBar/";
$loop_end = count($output_list);

/*
 index
*/
$data["html"] = file_get_contents("./../Lifebar/htm/index.htm");
$data["main_title"] = $MAIN_TITLE;
$data["page_category"] = "Lifebar";
$data["page_title"] = $PAGE_TITLE;
$data["page_subtitle"] = $html_output_list[$i];
$data["page"]["level"] = "2";
$data["categories"] = $categories;
$data["sidebar"] = $sidebar;

$smarty->assign('content', $data);

$output = $smarty->fetch('./../Template/htmlbase.tpl');

file_put_contents('./../Lifebar/index.html', $output);


/*
 タイトルの処理
*/
$loop_start = 0;
$loop_end = count($html_output_list);
for ($i = 0; $i < $loop_end; $i++) {
  $categorie["main_title"] = $MAIN_TITLE;
  $categorie["page_title"] = $PAGE_TITLE;
  $categorie["page_subtitle"] = $html_output_list[$i];
  array_push($categories, $categorie);
}

$loop_end = count($output_list);
for ($i = 0; $i < $loop_end; $i++) {
  $state_name = $output_list[$i];
  $json = json_decode(file_get_contents("./../Lifebar/json/".$state_name.".json"), true);
  $json["main_title"] = $MAIN_TITLE;
  $json["page_category"] = "Lifebar";
  $json["page_title"] = $PAGE_TITLE;
  $json["page_subtitle"] = $output_list[$i];
  $json["categories"] = $categories;
  $json["sidebar"] = $sidebar;

  $smarty->assign('content', $json);

  $output = $smarty->fetch('./../Template/base.tpl');

  file_put_contents("./../Lifebar/".$state_name.".html", $output);
}



/* htm */
$loop_start = 0;
$loop_end = count($html_output_list);

for ($i = $loop_start; $i < $loop_end; $i++) {
  $data["html"] = file_get_contents("./../Lifebar/htm/".$html_output_list[$i].".htm");
  $data["main_title"] = $MAIN_TITLE;
  $data["page_category"] = "Lifebar";
  $data["page_title"] = $PAGE_TITLE;
  $data["page_subtitle"] = $html_output_list[$i];
  $data["categories"] = $categories;
  $data["sidebar"] = $sidebar;

  $smarty->assign('content', $data);

  $output = $smarty->fetch('./../Template/htmlbase.tpl');

  file_put_contents('./../Lifebar/'.$data["page_subtitle"].".html", $output);
}





echo "OK?";
// echo file_get_contents("./../State/index.html");
?>