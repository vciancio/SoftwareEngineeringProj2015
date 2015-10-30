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
else if($_POST["name"] && $_POST["userid"]){
  $username = strtolower(str_replace(' ', '_', $_POST["name"]));
  $filePath = generatePath(strtolower($_POST["userid"]), $userName);
  $json = file_get_contents('php://input'); 
  writeJson($filePath, $json); 
}


//echo var_dump($_GET);
?>
