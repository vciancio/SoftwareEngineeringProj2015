function get(name){
   if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
      return decodeURIComponent(name[1]);
}

function processPrintLoadResponse(result){
  var json = JSON.parse(result);
  if(json.error == "true"){
    alert("There was an error: " + json.message);
    return;
  }

  var obj = json.content.mForm;
  console.log(obj);
  var name = obj.mName.split(" ");
  $('input[name="fname"]').val(name[0]);
  $('input[name="lname"]').val(name[1]);
  $('input[name="stdid"]').val(obj.stdid);
  $('input[name="email"]').val(obj.email);

  // removeRow_TransferCredit();

  //Populate the Approved Transfer Credits
  for(var i=0; i<obj.transferCredits.length; i++){
    var mClass = obj.transferCredits[i];
    addRow_TransferCredit(mClass.course, mClass.institution, mClass.grade, mClass.credits);
  }

  removeRow_TrackUnits();
  //Populate the Track Unit Corses
  for(var i=0; i<obj.trackUnits.length; i++){
    var mClass = obj.trackUnits[i];
    addRow_TrackUnits(mClass.course, mClass.credits);
  }

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

  totalUnitAnalysis();
var millisecondsToWait = 1000;
setTimeout(function() {
    window.print();
}, millisecondsToWait);
}


$(document).ready(function () {
	var name = get('name');
	var stdid= get('stdid');
	var email= get('email');

  callLoadServer(name, stdid, email, processPrintLoadResponse);
});
