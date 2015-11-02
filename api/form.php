<?php
/**
 * This is the Endpoint allows for saving and loading the form data
 */
function generateError($reason){
  return "{\"error\":\"true\", \"message\":\"".$reason."\"}";
}

function generateSuccess($content, $message){
 return "{\"error\":\"false\", \"message\":\"".$message."\", \"content\":\"".$content."\"}";
}

function generateSuccess($content){
  return "{\"error\":\"false\", \"content\":\"".$content."\"}";
}

function generatePath($userid, $name){
  return getcwd()."/db/".$userid.".".$name.".json";
}

function readRawJSON($path){
  return file_get_contents($path);
}

function writeJson($path, $json){
/*  if(is_writable(getcwd()."/db/")){
    echo (getcwd()."/db/")." is Writable!\n";
  }
  else{
    echo (getcwd()."/db/")." is not writable. gg rip\n";
  }

  if(file_exists($path)){
    echo $path." exists!\n";
  }
  else{
    echo $path." doesn't exist. Creating File.\n";
  }
 */
  $file = null;
  if(!$file = fopen($path, 'w')){
    echo generateError("Cannot open file");
  }
  else{
    fwrite($file,$json);
    fclose($file); 
    echo generateSuccess("", "Opened File");
  }
}

function handle_get(){
  if($_GET["name"] && $_GET["userid"] && $_GET["student_email"]){
    $userName = strtolower(str_replace(' ', '_', $_GET["name"]));
    $filePath = generatePath(strtolower($_GET["userid"]), $userName);
    if(file_exists($filePath)){
      echo generateSuccess(readRawJSON($filePath));
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

//echo var_dump($_GET)."/n";
//echo var_dump($_POST);
?>
