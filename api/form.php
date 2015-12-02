<?php
/**
 * This is the Endpoint allows for saving and loading the form data
 */
function generateError($reason){
  return "{\"error\":\"true\", \"message\":\"".$reason."\"}";
}

function generateSuccess($content, $message){
 return "{\"error\":\"false\", \"message\":\"".$message."\", \"content\":".$content."}";
}

function generatePath($userid, $name){
  return getcwd()."/db/".$userid.".".$name.".json";
}

function readRawJSON($path){
  $rawJson = file_get_contents($path);
  $json = json_decode($rawJson);
  return $rawJson;
}

function writeJson($path, $rawJson){
  $file = null;
  $json = json_decode($rawJson);
  if(file_exists($path)){
    $rawTempJson = file_get_contents($path);
    $jsonTemp = json_decode($rawTempJson);
    $passes = strcmp($jsonTemp->pass, $json->pass);
    if($passes){
      echo generateError("Password was Incorrect");
      return;
    }
  }

  if(!$file = fopen($path, 'w')){
    echo generateError("Cannot open file");
  }
  else {
    fwrite($file,$rawJson);
    fclose($file); 
    echo generateSuccess("", "Saved the File");
  }
}

function handle_get(){
  if($_GET["name"] && $_GET["userid"]){
    $userName = strtolower(str_replace(' ', '_', $_GET["name"]));
    $filePath = generatePath(strtolower($_GET["userid"]), $userName);
    if(file_exists($filePath)){
      $rawJson = readRawJSON($filePath);
      $json = json_decode($rawJson);
      $json->pass = "nicetrytroll";
      echo generateSuccess(json_encode($json), "");
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
    $rawJson = file_get_contents('php://input');    
    writeJson($filePath, $rawJson);
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
?>
