function get(name){
   if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
      return decodeURIComponent(name[1]);
}

function addRow_TransferCredit(course, institution, grade, credits){
	
}

function processLoadResponse(result){
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

  //Populate the Approved Transfer Credits
  for(var i=0; i<obj.transferCredits.length; i++){
    var mClass = obj.transferCredits[i];
    addRow_TransferCredit(mClass.course, mClass.institution, mClass.grade, mClass.credits);
  }

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

  totalUnitCount();
}


$(document).ready(function () {
	var name = get('name');
	var stdid= get('stdid');
	var email= get('email');

	  var url = "http://dark-fusion.servegame.com/Software2015/api/form.php?name=" + name + "&userid=" + stdid + "&student_email=" + email; 
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
});