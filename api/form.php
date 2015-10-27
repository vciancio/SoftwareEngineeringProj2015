<?php
/**
 * This is the Endpoint allows for saving and loading the form data
 */

function readJSON($path){
  $file = fopen($path, "r");
  return fread($file, filesize($path));
}

function generateError($reason){
    return "{\"error\":\"true\", \"message\":\"".$reason."\"}";
}

if($_GET["name"] && $_GET["userid"] && $_GET["student_email"]){
  $userName = str_replace(' ', '_', $_GET["name"]);
  $filePath = "db/".$_GET["userid"].".".$userName;
  if(file_exists($filePath)){
    echo "{\"error\":\"false\", \"content\":".readJSON($path)."}";
  }
  else{
    echo generateError("Student not Found");
  }
}


echo var_dump($_GET);
?>
