/* JSON REQUEST / SERVER HANDLING */
function isArray(obj){
  return obj.constructor === Array;
}

function getSelectionValueByName(name) {
  return $('select[name="' + name + '"]').val();
}

function getCheckboxValueById(id) {
  return $("#"+id).prop('checked');
}

function buildCoenCoreReqs(){  
  var reqs_core = new Object();
  reqs_core.coen210 = getCheckboxValueById("coen210");
  reqs_core.coen279 = getCheckboxValueById("coen279");
  reqs_core.coen283 = getCheckboxValueById("coen283");
  return reqs_core;
}

/**
  * Will Build the drop-down requirements and return a JSON
  * object.
  * @return a String that is formatted as: ' "key":{...}'
  */
function buildGradReqs() {
  var json = '"reqs_grad":"{'
  var req_emerg = getSelectionValueByName("req_emerg");
  var req_business = getSelectionValueByName("req_business");
  var req_society = getSelectionValueByName("req_society");
  
  var reqs_grad = new Object();
  reqs_grad.req_emerg = getSelectionValueByName("req_emerg");
  reqs_grad.req_business = getSelectionValueByName("req_business");
  reqs_grad.req_society = getSelectionValueByName("req_society");

  return reqs_grad;
}

/**
  * Will Build the JSON String that will be stored in the server
  * @return a JSON String
  */
function buildJSON() {
  var obj = new Object();
  var json = new Object();
  json.mName = $('input[name="fname"]').val() + " " + $('input[name="lname"]').val();
  json.stdid = $('input[name="stdid"]').val();
  json.email = $('input[name="email"]').val();
  json.gradReqs = buildGradReqs();
  json.coenReqs = buildCoenCoreReqs();

  obj.mForm = json;

  return JSON.stringify(obj);
}