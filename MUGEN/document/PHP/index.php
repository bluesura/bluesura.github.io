<?php

require_once('C:\libs\php\smarty\Smarty.class.php');
$smarty = new Smarty();
ini_set( 'display_errors', 0 );
$smarty->debugging = false;
set_time_limit(120);//30秒でファイルが出力しきれなかったため

echo "<br>===================start===================<br>";

/*
 sidebar
*/
$sidebar = [];

array_push($sidebar, "<label for=\"menu_bar01\">+ ステートコントローラー 一覧を見る</label><input type=\"checkbox\" id=\"menu_bar01\" class=\"accordion\" /><ul id=\"links01\">");
array_push($sidebar, "<li><a href=\"/MUGEN/document/State/\">Top Page</a></li>");
$list = json_decode(file_get_contents("./../State/json/state_list.json"), true);
$loop_end = count($list);
for ($i = 0; $i < $loop_end; $i++) {
  array_push($sidebar, "<li><a href=\"/MUGEN/document/State/".$list[$i].".html\">".$list[$i]."</a></li>");
}
array_push($sidebar, "</ul>");

array_push($sidebar, "<label for=\"menu_bar02\">+ トリガー 一覧を見る</label><input type=\"checkbox\" id=\"menu_bar02\" class=\"accordion\" /><ul id=\"links02\">");
array_push($sidebar, "<li><a href=\"/MUGEN/document/Trigger/\">Top Page</a></li>");
$list = json_decode(file_get_contents("./../Trigger/json/trigger_list.json"), true);
$loop_end = count($list);
for ($i = 0; $i < $loop_end; $i++) {
  array_push($sidebar, "<li><a href=\"/MUGEN/document/Trigger/".$list[$i].".html\">".$list[$i]."</a></li>");
}
array_push($sidebar, "</ul>");


array_push($sidebar, "<label for=\"menu_bar03\">+ ライフバーの設定 を見る</label><input type=\"checkbox\" id=\"menu_bar03\" class=\"accordion\" /><ul id=\"links03\">");
array_push($sidebar, "<li><a href=\"/MUGEN/document/Lifebar/\">Top Page</a></li>");
$list = array("Combo", "Face","FightFx", "Files", "LifeBar","Name", "PowerBar","Round", "SimulFace", "SimulLifeBar", "SimulName","Time", "TurnsFace", "TurnsLifeBar", "TurnsName", "WinIcon");
$loop_end = count($list);
for ($i = 0; $i < $loop_end; $i++) {
  array_push($sidebar, "<li><a href=\"/MUGEN/document/Lifebar/".$list[$i].".html\">".$list[$i]."</a></li>");
}
$list = array("BeginAction", "Format", "MakeFont");
$loop_end = count($list);
for ($i = 0; $i < $loop_end; $i++) {
  array_push($sidebar, "<li><a href=\"/MUGEN/document/Lifebar/".$list[$i].".html\">".$list[$i]."</a></li>");
}
array_push($sidebar, "</ul>");
/*
 sidebar END
*/

/****************************************************/
$PROTOCOL   = "https";
$DOMAIN     = "bluesura.github.io";
$MUGEN_PATH = "/MUGEN/document";
$URL        = $PROTOCOL."://".$DOMAIN;
$SITE_NAME  = "Name = すら";
$MAIN_TITLE = "";
$sub_title  = "";
$PATH_LIST  = [];
/****************************************************/

/*
 Top Page
*/
$categorie=[];
$categorie["site_name"] = $SITE_NAME;
$categorie["page"] = [];
$categorie["page"]["level"] = "1";
$categorie["sidebar"] = $sidebar;
$filename = "index.html";
$path = "/";
$categorie["url"] = $URL.$path;

$smarty->assign('content', $categorie);
file_put_contents("./../../..".$path.$filename, $smarty->fetch('./../Template/top_page.tpl'));
array_push($PATH_LIST, $URL.$path);



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

// print_r($json);

  $categorie = [];
  $categorie["page_subtitle"] = $json["state"];
  $categorie["description"] = $json["description"];
  $categorie["category"] = $json["category"];

    echo $state_name . "-------------------------------<br>";
    // echo $json["parameter"] . "-------------------------------<br>";

  if (!empty($json["parameter"])) {
    for ($j = 0; $j < count($json["parameter"]); $j++) {
      $categorie["parameter"][$j] = $json["parameter"][$j]["parameter"]. str_repeat(' ', 27-strlen($json["parameter"][$j]["parameter"]))."= " . implode(", ",$json["parameter"][$j]["value"]);
    }
  }
  array_push($categories, $categorie);
}

//index
$categorie["page"]["level"] = "2";
$categorie["site_name"] = $SITE_NAME;
$categorie["page_category"] = "State";
$categorie["page_title"] = "MUGEN State Controller Reference";
$categorie["page_subtitle"] = "";
$categorie["categories"] = $categories;
$categorie["description"] = "";
$categorie["sidebar"] = $sidebar;
$filename = "index.html";
$path = "/State/";
$categorie["url"] = $URL.$MUGEN_PATH.$path;

$smarty->assign('content', $categorie);
file_put_contents("./..".$path.$filename, $smarty->fetch('./../Template/base.tpl'));
array_push($PATH_LIST, $URL.$MUGEN_PATH.$path);

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

  $json["site_name"] = $SITE_NAME;
  $json["page_title"] = $json["page"]["title"];
  $json["page_category"] = "State";
  $json["page_subtitle"] = $json["page"]["subtitle"];
  $json["categories"] = $categories;
  $json["sidebar"] = $sidebar;
  $filename = $state_name.".html";
  $json["url"] = $URL.$MUGEN_PATH.$path.$filename;

  $smarty->assign('content', $json);

  file_put_contents("./..".$path.$filename, $smarty->fetch('./../Template/base.tpl'));
  array_push($PATH_LIST, $URL.$MUGEN_PATH.$path.$filename);
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
$categorie["site_name"] = $SITE_NAME;
$categorie["page_category"] = "Trigger";
$categorie["page_title"] = "MUGEN Trigger Reference";
$categorie["page_subtitle"] = "";
$categorie["categories"] = $categories;
$categorie["description"] = "";
$categorie["sidebar"] = $sidebar;
$filename = "index.html";
$path = "/Trigger/";
$categorie["url"] = $URL.$MUGEN_PATH.$path;

$smarty->assign('content', $categorie);

file_put_contents("./..".$path.$filename, $smarty->fetch('./../Template/base.tpl'));
array_push($PATH_LIST, $URL.$MUGEN_PATH.$path);


/*
 トリガー
*/
for ($i = 0; $i < $loop_end; $i++) {
  $trigger_name = $output_list[$i];
  $json = file_get_contents("./../Trigger/json/".$trigger_name.".json");
  $json = json_decode($json, true);

  $json["site_name"] = $SITE_NAME;
  $json["page_title"] = $json["page"]["title"];
  $json["page_category"] = "Trigger";
  $json["page_subtitle"] = $json["page"]["subtitle"];
  $json["categories"] = $categories;
  $json["sidebar"] = $sidebar;
  $filename = $trigger_name.".html";
  $json["url"] = $URL.$MUGEN_PATH.$path.$filename;

  $smarty->assign("content", $json);

  file_put_contents("./..".$path.$filename, $smarty->fetch('./../Template/base.tpl'));
  array_push($PATH_LIST, $URL.$MUGEN_PATH.$path.$filename);
}



//////////////////////////////////////////////////////////////////////////////////////////////////
/* 初期化 */
$RELATIVE_PATH = "Lifebar";
$PAGE_TITLE = "MUGEN Lifebar Reference";
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
$categorie["html"] = file_get_contents("./../Lifebar/htm/index.htm");
$categorie["site_name"] = $SITE_NAME;
$categorie["page_category"] = "Lifebar";
$categorie["page_title"] = $PAGE_TITLE;
$categorie["page_subtitle"] = "";
$categorie["page"]["level"] = "2";
$categorie["categories"] = $categories;
$categorie["sidebar"] = $sidebar;
$filename = "index.html";
$path = "/Lifebar/";
$categorie["url"] = $URL.$MUGEN_PATH.$path;

$smarty->assign('content', $categorie);

file_put_contents("./..".$path.$filename, $smarty->fetch('./../Template/base.tpl'));
array_push($PATH_LIST, $URL.$MUGEN_PATH.$path);


/*
 
*/
$categorie["html"] = file_get_contents("./../Lifebar/htm/Format.htm");
$categorie["site_name"] = $SITE_NAME;
$categorie["page_category"] = "Lifebar";
$categorie["page_title"] = $PAGE_TITLE;
$categorie["page"]["level"] = "2";
$categorie["categories"] = $categories;
$categorie["sidebar"] = $sidebar;
$filename = "Format.html";
$path = "/Lifebar/";
$categorie["url"] = $URL.$MUGEN_PATH.$path.$filename;

$smarty->assign('content', $categorie);

file_put_contents("./..".$path.$filename, $smarty->fetch('./../Template/base.tpl'));
array_push($PATH_LIST, $URL.$MUGEN_PATH.$path);


/*
 タイトルの処理
*/
$loop_end = count($html_output_list);
for ($i = 0; $i < $loop_end; $i++) {
  $categorie["site_name"] = $SITE_NAME;
  $categorie["page_title"] = $PAGE_TITLE;
  $categorie["page_subtitle"] = $html_output_list[$i];
  array_push($categories, $categorie);
}

$loop_end = count($output_list);
for ($i = 0; $i < $loop_end; $i++) {
  $name = $output_list[$i];
  $json = json_decode(file_get_contents("./../Lifebar/json/".$name.".json"), true);
  $json["site_name"] = $SITE_NAME;
  $json["page_category"] = "Lifebar";
  $json["page_title"] = $PAGE_TITLE;
  $json["page"]["level"] = "3";
  $json["page_subtitle"] = $output_list[$i];
  $json["categories"] = $categories;
  $json["sidebar"] = $sidebar;
  $filename = $name.".html";
  $json["url"] = $URL.$MUGEN_PATH.$path.$filename;

  $smarty->assign('content', $json);

  file_put_contents("./..".$path.$filename, $smarty->fetch('./../Template/base.tpl'));
  array_push($PATH_LIST, $URL.$MUGEN_PATH.$path.$filename);
}



/* htm */
$loop_end = count($html_output_list);
for ($i = 0; $i < $loop_end; $i++) {
  $name = $html_output_list[$i];
  $categorie["html"] = file_get_contents("./../Lifebar/htm/".$name.".htm");
  $categorie["site_name"] = $SITE_NAME;
  $categorie["page_category"] = "Lifebar";
  $categorie["page_title"] = $PAGE_TITLE;
  $categorie["page"]["level"] = "2";
	$array_result = [];
	preg_match('/<h1>(.+?)<\/h1>/',$categorie["html"],$array_result);
  $categorie["page_subtitle"] = $array_result[1];
  $categorie["categories"] = $categories;
  $categorie["sidebar"] = $sidebar;
  $filename = $name.".html";
  $categorie["url"] = $URL.$MUGEN_PATH.$path.$filename;

  $smarty->assign('content', $categorie);

  array_push($PATH_LIST, $URL.$MUGEN_PATH.$path.$filename);

  file_put_contents("./..".$path.$filename, $smarty->fetch('./../Template/base.tpl'));
}

/*sitemap*/
$smarty->assign('urls', $PATH_LIST);
file_put_contents("./../../../sitemap.xml", $smarty->fetch('./../../../sitemap.tpl'));



echo "OK?";
// echo file_get_contents("./../State/index.html");
?>