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

    //Remove the Row Auto-Generated at the beginning by onLoad
    removeRow_TrackUnits();

    //Fill in the Track Units
    fillInTrackUnits(obj);

    //Fill in the Transfer Credits
    fillInTransferCredits(obj);

    //Fill in the COEN Requirements
    fillInCoenReq(obj);

    //Fill in the Foundational Core
    fillInFoundational(obj);

    //Fill in the Grad Core
    fillInGradCore(obj);

    completeUnitAnalysis();
}

$(document).ready(function () {
    var name = get('name');
	var stdid= get('stdid');
	var email= get('email');

    callLoadServer(name, stdid, email, processPrintLoadResponse);
});
