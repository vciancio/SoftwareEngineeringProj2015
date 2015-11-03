/* JSON REQUEST / SERVER HANDLING */
function isArray(obj){
  return obj.constructor === Array;
}

function getSelectionValueByName(name) {
  return $('select[name="' + name + '"]').val();
}

function setSelctionValueByName(name, value){
  return $('select[name="' + name + '"]').val(value);
}

function getCheckboxValueById(id) {
  return $("#"+id).prop('checked');
}

function setCheckboxValueById(id, value){
  return $("#"+id).prop('checked', value);
}

function buildFoundationalCourses(){
  var obj = {};
  obj['coen20'] = getCheckboxValueById("coen20");
  obj['coen21'] = getCheckboxValueById("coen21");
  obj['coen12'] = getCheckboxValueById("coen12");
  obj['coen19'] = getCheckboxValueById("coen19");
  obj['amth210']= getCheckboxValueById("amth210");
  return obj;
}

function buildTransferCredits(){
  var classes = [];
  var courses = $("#transferTable #tCredit_row input[name='course']");
  var institutions = $("#transferTable #tCredit_row input[name='inst']");
  var grades = $("#transferTable #tCredit_row input[name='grade']");
  var credits = $("#transferTable #tCredit_row input[name='qunit']");

  for(var i=0; i<courses.length; i++){
    var mClass = new Object();
    mClass.course = courses[i].value;
    mClass.institution = institutions[i].value;
    mClass.grade = grades[i].value;
    mClass.credits = credits[i].value;
    classes.push(mClass);
  }
  return classes;
}

function buildTrackUnits() {
  var classes = []; 
  var courses = $("#transferTable2 #unitTrack_row input[name='course']");
  var credits = $("#transferTable2 #unitTrack_row input[name='units']");

  for(var i=0; i<courses.length; i++) {
    var tClass = new Object();
    tClass.course = courses[i].value;
    tClass.credits = credits[i].value;
    classes.push(tClass);
  }
  return classes;
}

function buildCoenCoreReqs(){  
  var reqs_core = {};
  reqs_core['coen210'] = getCheckboxValueById("coen210");
  reqs_core['coen279'] = getCheckboxValueById("coen279");
  reqs_core['coen283'] = getCheckboxValueById("coen283");
  return reqs_core;
}

/**
  * Will Build the drop-down requirements and return a JSON
  * object.
  * @return a String that is formatted as: ' "key":{...}'
  */
function buildGradReqs() {
  var reqs_grad = {};
  reqs_grad['req_emerg'] = getSelectionValueByName("req_emerg");
  reqs_grad['req_business'] = getSelectionValueByName("req_business");
  reqs_grad['req_society'] = getSelectionValueByName("req_society");

  return reqs_grad;
}

/**
  * Will Build the JSON String that will be stored in the server
  * @return a JSON String
  */
function buildDataObj() {
  var obj = new Object();
  var json = new Object();
  json.mName = $('input[name="fname"]').val() + " " + $('input[name="lname"]').val();
  json.stdid = $('input[name="stdid"]').val();
  json.email = $('input[name="email"]').val();
  json.gradReqs = buildGradReqs();
  json.coenReqs = buildCoenCoreReqs();
  json.transferCredits = buildTransferCredits();
  json.foundationCourses = buildFoundationalCourses();
  json.trackUnits = buildTrackUnits();
  obj.mForm = json;

  return obj;
}

function processSaveResponse(result){
  var json = JSON.parse(result);
  if(!json.error){
    alert("Your Form was saved successfully!");
  }
  else{
    alert("Your Form couldn't be saved. \n" + json.message);
  }
  console.log(response);
}

function processLoadResponse(result){
  var json = JSON.parse(result);
  if(json.error == "true"){
    alert("There was an error: " + json.message);
    return;
  }

  var obj = json.content.mForm;
  console.log(obj);

  //Populate the Approved Transfer Credits
  for(var i=0; i<obj.transferCredits.length; i++){
    var mClass = obj.transferCredits[i];
    addRow_TransferCredit(mClass.course, mClass.institution, mClass.grade, mClass.credits);
  }
  transferCreditAnalysis();

  //Populate the Track Unit Corses
  for(var i=0; i<obj.trackUnits.length; i++){
    var mClass = obj.trackUnits[i];
    addRow_TrackUnits(mClass.course, mClass.credits);
  }
  trackUnitAnalysis();

  //Populate the Foundational Courses
  var foundationKeys = Object.keys(obj.foundationCourses);
  for(var i=0; i<foundationKeys.length; i++){
    var courseNumber = foundationKeys[i];
    var value = obj.foundationCourses[courseNumber];
    setCheckboxValueById(courseNumber, value);
  }

  //Populate the COEN Requirements
  var coenReqsKeys = Object.keys(obj.coenReqs);
  for(var i=0; i<coenReqsKeys.length; i++){
    var courseNumber = coenReqsKeys[i];
    var value = obj.coenReqs[courseNumber];
    setCheckboxValueById(courseNumber, value);
  }

  //Populate the Graduate Core Requirements
  var gradCoreKeys = Object.keys(obj.gradReqs);
  for(var i=0; i<gradCoreKeys.length; i++){
    var requirement = gradCoreKeys[i];
    var value = obj.gradReqs[requirement];
    setSelctionValueByName(requirement, value);
  }

}

/**
 * Save Data To the Server
 * Will call BuildDataObject and then send to server
 */
function saveData(){
  var obj = buildDataObj();
  var url = "http://dark-fusion.servegame.com/Software2015/api/form.php?name=" + obj.mForm.mName + "&userid=" + obj.mForm.stdid + "&student_email=" + obj.mForm.email; 
  console.log(url);
  $.ajax({
      url: url,
      type: "POST",
      data: JSON.stringify(obj),
      dataType: "text",
      success: function (result) {
          switch (result) {
              case true:
                  processSaveResponse(result);
                  break;
              default:
                  console.log(result);
          }
      },
      error: function (xhr, ajaxOptions, thrownError) {
      console.log("Error: xhr.status = " + xhr.status);
      console.log("Thrown Error: " + thrownError);
      }
  });
}

/**
 * Load the Data from the server for the username and the email
 */
function loadData(){
  var obj = buildDataObj();
  var url = "http://dark-fusion.servegame.com/Software2015/api/form.php?name=" + obj.mForm.mName + "&userid=" + obj.mForm.stdid + "&student_email=" + obj.mForm.email; 
    $.ajax({
      url: url,
      type: "GET",
      dataType: "text",
      success: function (result) {
          switch (result) {
              default:
                  processLoadResponse(result);
                  console.log(result);
          }
      },
      error: function (xhr, ajaxOptions, thrownError) {
      console.log("Error: xhr.status = " + xhr.status);
      console.log("Thrown Error: " + thrownError);
      }
  });
}