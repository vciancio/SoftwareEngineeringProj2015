/* JSON REQUEST / SERVER HANDLING */
function getSelectionValueByName(name) {
    return $('select[name="' + name + '"]').val();
}

/**
  * Will Build the drop-down requirements and return a JSON
  * object.
  * @return a String that is formatted as: ' "key":{...}'
  */
function buildJSON_reqs() {
    var json = '"reqs":"{'
    var req_emerg = getSelectionValueByName("req_emerg");
    var req_business = getSelectionValueByName("req_business");
    var req_society = getSelectionValueByName("req_society");

    json = json + "\"req_emerg\":\"" + req_emerg + "\"";
    json = json + ", \"req_business\":\"" + req_business + "\"";
    json = json + ", \"req_business\":\"" + req_society + "\"";
    return json;
}

/**
  * Will Build the JSON String that will be stored in the server
  * @return a JSON String
  */
function buildJSON() {
    var name = $('input[name="fname"]').val() + " " + $('input[name="lname"]').val();
    var stdid = $('input[name="stdid"]').val();
    var email = $('input[name="email"]').val();

    var json = "{";

    json = json + '"name":"' + name + '", "stdid":"' + stdid +
        '", "email":"' + email + '"';

    json = json + ", " + buildJSON_reqs();

    json = json + "}";
    alert(json);
    return json;
}