var BASE_URL = "http://linux.students.engr.scu.edu/~vciancio/Software2015"


/* JSON REQUEST / SERVER HANDLING */
function isArray(obj){
    return obj.constructor === Array;
}

function getSelectionValueByName(name) {
    return $('select[name="' + name + '"]').val();
}

function setSelectionValueByName(name, value){
    return $('select[name="' + name + '"]').val(value);
}

function getCheckboxValueById(id) {
    return $("#"+id).prop('checked');
}

function setCheckboxValueById(id, value){
    return $("#"+id).prop('checked', value);
}

function setInputByName(name, value){
    $('input[name="'+name+'"]').val(value);
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
    obj['oneofthree'] = getSelectionValueByName("oneofthree");
    obj['advprgm'] = getSelectionValueByName("advprgm");
    
    return obj;
}

function buildCoenCoreReqs(){  
    var reqs_core = {};
    reqs_core['coen210'] = getSelectionValueByName("coen210");
    reqs_core['coen279'] = getSelectionValueByName("coen279");
    reqs_core['coen283'] = getSelectionValueByName("coen283");
    
    return reqs_core;
}

 /*
  * Will Build the drop-down requirements and return a JSON
  * object.
  * @return a String that is formatted as: ' "key":{...}'
  */
function buildGradReqs() {
    var req_emerg = $('input[name="req_emerg"]').val();
    var req_business = $('input[name="req_business"]').val();
    var req_society = $('input[name="req_society"]').val();
    var req_emerg_unit = $('input[name="req_emerg_unit"]').val();
    var req_business_unit = $('input[name="req_business_unit"]').val();
    var req_society_unit = $('input[name="req_society_unit"]').val();
    var reqs_list = ["req_emerg", "req_business", "req_society"];
    var reqs_course = [req_emerg, req_business, req_society];
    var reqs_unit = [req_emerg_unit, req_business_unit, req_society_unit];
    var reqs_grad = {};
    for (var i=0; i<3; i++) {
        var gClass = new Object;
        gClass.area = reqs_list[i];
        gClass.course = reqs_course[i];
        gClass.unit = reqs_unit[i];
        reqs_grad[reqs_list[i]] = gClass;
    }
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
    var json = JSON.parse(result);
    if(!json.error){
        alert("Your Form was saved successfully!");
    } else {
        alert("Your Form couldn't be saved. \n" + json.message);
    }
    console.log(response);
}

function processLoadResponse(result){
    console.log(result);
    var json = JSON.parse(result);
    if(json.error == "true") {
        alert("There was an error: " + json.message);
        return;
    }

    var obj = json.content.mForm;
    console.log(obj);
    removeRow_TransferCredits();

    //Set the Student Type
    $('input[value="'+ obj.transferCredits.student_type + '"]').prop('checked', true);
    console.log('input[value="'+ obj.transferCredits.student_type + '"]');

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
        setSelectionValueByName(courseNumber, value);
    }

    //Populate the COEN Requirements
    var coenReqsKeys = Object.keys(obj.coenReqs);
    for(var i=0; i<coenReqsKeys.length; i++){
        var courseNumber = coenReqsKeys[i];
        var value = obj.coenReqs[courseNumber];
        setSelectionValueByName(courseNumber, value);
    }

    //Populate the Graduate Core Requirements
    var gradCoreKeys = Object.keys(obj.gradReqs);
    for(var i=0; i<gradCoreKeys.length; i++){
        var requirement = gradCoreKeys[i];
        var value = obj.gradReqs[requirement].course;
        setInputByName(requirement, value);
        var units = obj.gradReqs[requirement].unit;
        setInputByName(requirement + "_unit", units);
    }

    transferCreditsAnalysis();
    coenFoundationalAnalysis();
    coenCoreAnalysis();
    gradCoreAnalysis();
    trackAnalysis();
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