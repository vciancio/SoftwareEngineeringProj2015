var BASE_URL = "http://linux.students.engr.scu.edu/~vciancio/Software2015"


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

function buildTransferCredits(){
    var transferCredits = new Object();
    var student_type = $('input[name="where"]:checked').val();
    var mClasses = [];
    var courses = $("input[name='course-for-tc']");
    var institutions = $("input[name='inst-for-tc']");
    var grades = $("input[name='grade-for-tc']");
    var credits = $("input[name='units-for-tc']");

    for(var i=0; i<courses.length; i++){
        var mClass = new Object();
        mClass.course = courses[i].value;
        mClass.institution = institutions[i].value;
        mClass.grade = grades[i].value;
        mClass.credits = credits[i].value;
        mClasses.push(mClass);
    }
    
    transferCredits.student_type = student_type;
    transferCredits.mClasses = mClasses;
    return transferCredits;
}

function buildFoundationalCourses(){
    var obj = {};
    obj['coen20'] = getSelectionValueByName("coen20");
    obj['coen21'] = getSelectionValueByName("coen21");
    obj['coen12'] = getSelectionValueByName("coen12");
    obj['coen19'] = getSelectionValueByName("coen19");
    obj['amth210']= getSelectionValueByName("amth210");
    
    return obj;
}

function buildCoenCoreReqs(){  
    var reqs_core = {};
    reqs_core['coen210'] = getCheckboxValueById("coen210");
    reqs_core['coen279'] = getCheckboxValueById("coen279");
    reqs_core['coen283'] = getCheckboxValueById("coen283");
    
    return reqs_core;
}

 /*
  * Will Build the drop-down requirements and return a JSON
  * object.
  * @return a String that is formatted as: ' "key":{...}'
  */
function buildGradReqs() {
    var reqs_grad = {};
    reqs_grad['req_emerg'] = $('input[list="req_emerg"]').val();
    reqs_grad['req_business'] = $('input[list="req_business"]').val();
    reqs_grad['req_society'] = $('input[list="req_society"]').val();

    return reqs_grad;
}

function buildTrackUnits() {
    var classes = []; 
    var courses = $("input[name='course-for-track']");
    var credits = $("input[name='units-for-track']");

    for (var i=0; i<courses.length; i++) {
        var tClass = new Object();
        tClass.course = courses[i].value;
        tClass.credits = credits[i].value;
        classes.push(tClass);
    }
    
    return classes;
}

 /*
  * Will Build the JSON String that will be stored in the server
  * @return a JSON String
  */
function buildDataObj() {
    var obj = new Object();
    var json = new Object();

    json.mName = $('input[name="fname"]').val() + " " + $('input[name="lname"]').val();
    json.stdid = $('input[name="stdid"]').val();
    json.email = $('input[name="email"]').val();
    
    json.transferCredits = buildTransferCredits();
    json.foundationCourses = buildFoundationalCourses();
    json.coenReqs = buildCoenCoreReqs();
    json.gradReqs = buildGradReqs();
    json.trackUnits = buildTrackUnits();
    obj.mForm = json;

    return obj;
}

function processSaveResponse(result){
    console.log(response);
    var json = JSON.parse(result);
    if(!json.error){
        alert("Your Form was saved successfully!");
    } else {
        alert("Your Form couldn't be saved. \n" + json.message);
    }
}

function processLoadResponse(result){
    var json = JSON.parse(result);
    if(json.error == "true") {
        alert("There was an error: " + json.message);
        return;
    }

    var obj = json.content.mForm;
    console.log(obj);
    removeRow_TransferCredit();
    
    // Set the Student Type
    $('input[value="'+ obj.transferCredits.student_type + '"]').prop('checked', true);

    //Populate the Approved Transfer Credits
    for(var i=0; i<obj.transferCredits.mClasses.length; i++){
        var mClass = obj.transferCredits.mClasses[i];
        addRow_TransferCredits(mClass.course, mClass.institution, mClass.grade, mClass.credits);
    }

    removeRow_TrackUnits();

    //Populate the Track Unit Corses
    for(var i=0; i < obj.trackUnits.length; i++){
        var mClass = obj.trackUnits[i];
        addRow_TrackUnits(mClass.course, mClass.credits);
    }

    //Populate the Foundational Courses
    var foundationKeys = Object.keys(obj.foundationCourses);
    for(var i=0; i < foundationKeys.length; i++){
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

totalUnitAnalysis();
}

/*
 * Save Data To the Server
 * Will call BuildDataObject and then send to server
 */
function saveData(){
    var obj = buildDataObj();
    var url = BASE_URL + "/api/form.php?name=" + obj.mForm.mName + "&userid=" + obj.mForm.stdid + "&student_email=" + obj.mForm.email; 
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

function loadData(){
    var obj = buildDataObj();
    callLoadServer(obj.mForm.mName, obj.mForm.stdid, obj.mForm.email, processLoadResponse);
}

/*
 * Load the Data from the server for the username and the email
 */
function callLoadServer(name, stdid, email, callback){
    var obj = buildDataObj();
    var url = BASE_URL + "/api/form.php?name=" + name + "&userid=" + stdid + "&student_email=" + email; 
    $.ajax({
        url: url,
        type: "GET",
        dataType: "text",
        success: function (result) {
            switch (result) {
                default:
                callback(result);
                console.log(result);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("Error: xhr.status = " + xhr.status);
            console.log("Thrown Error: " + thrownError);
        }
    });
}

function printData(){
    saveData();
    var obj = buildDataObj();
    var url = BASE_URL + "/frontend/form.html?name=" + obj.mForm.mName + "&stdid=" + obj.mForm.stdid + "&email=" + obj.mForm.email;
    var win = window.open(url, '_blank');
    win.focus();
}