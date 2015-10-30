<?php
/**
 * This is the Endpoint allows for saving and loading the form data
 */

function generatePath($userid, $name){
  return "db/".$userid.".".$name.".json";
}

function readRawJSON($path){
  return file_get_contents($path);
}

function writeJson($path, $json){
  $file = fopen($path, "w");
  fwrite($file,$json);
  fclose($file); 
}

function generateError($reason){
    return "{\"error\":\"true\", \"message\":\"".$reason."\"}";
}

function handle_get(){
  if($_GET["name"] && $_GET["userid"] && $_GET["student_email"]){
    $userName = strtolower(str_replace(' ', '_', $_GET["name"]));
    $filePath = generatePath(strtolower($_GET["userid"]), $userName);
    if(file_exists($filePath)){
      echo "{\"error\":\"false\", \"content\":".readRawJSON($filePath)."}";
    }
    else{
      echo generateError("Student not Found");
    }
  }
}

function handle_post(){
  if($_GET["name"] && $_GET["userid"]){
    $userName = strtolower(str_replace(' ', '_', $_GET["name"]));
    $filePath = generatePath(strtolower($_GET["userid"]), $userName);
    $json = file_get_contents('php://input'); 
    writeJson($filePath, $json); 
  }
  else{
    echo generateError("Error while generating / saving");
  }
}

$method = $_SERVER['REQUEST_METHOD'];
$request = explode("/", substr(@$_SERVER['PATH_INFO'], 1));

switch ($method) {
    case 'POST':
      handle_post();
      break;
    case 'GET':
      handle_get(); 
      break;
}

echo var_dump($_GET)."/n";
echo var_dump($_POST);
?>
