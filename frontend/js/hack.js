function get(name){
    if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
        return decodeURIComponent(name[1]);
}

function setStudentType(type){
    var text = "";
    var units= 0;
    if(type == 'undergraduate'){
        text = "Student was a SCU Undergraduate";
        units= 16;
    }
    else if(type == 'accelerated'){
        text = "Student is an Accelerated Masters Student";
        units= 20;
    }
    else {
        text = "Student is a Transfer Student";
        units= 9;
    }

    var html = "<div class='table-cell'><h4>" + text + "</h4></div><div class='table-cell'><h5>Max Units: " + units + " quarter units</h5></div>";
    $('#student_type').html(html);
}

function processPrintLoadResponse(result){
    console.log(result);
    var json = JSON.parse(result);
    if(json.error == "true") {
        alert("There was an error: " + json.message);
        return;
    }

    var obj = json.content.mForm;
    var name = obj.mName;
    var name = name.split(" ");
    setInputByName('fname', name[0]);
    setInputByName('lname', name[1]);
    setInputByName('stdid', obj.stdid);
    setInputByName('email', obj.email);

    removeRow_TransferCredits();

    var student_type = obj.transferCredits.student_type;
    setStudentType(student_type);

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
        var value = obj.gradReqs[requirement];
        setSelectionValueByName(requirement, value);
    }

totalUnitAnalysis();
}

$(document).ready(function () {
    var name = get('name');
	var stdid= get('stdid');
	var email= get('email');

    callLoadServer(name, stdid, email, processPrintLoadResponse);
});
