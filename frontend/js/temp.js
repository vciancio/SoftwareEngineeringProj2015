var c = 0;
var ct = 0;
var maxtransfer = 9;

function addRow_TransferCredits(course, institution, grade, unit) {
    var table = document.getElementById("transferTable");
    c++;
    var tableRow = $("<div class='table-row container-fluid' id='row-transfer-credit" + c + "'>");
    var input = $("<input type='text' name='course-for-tc' id='course" + c + "' value='" + course + "' placeholder='coen12'/>");
    input = input.on("keydown", function (e) {
        return e.which !== 32;
    }); // restriction on typing space 
    $("<div class='table-cell'>").on('input', function() {
        transferCreditsAnalysis();
    }).append(input).appendTo(tableRow);
    var input = $("<input type='text' name='inst-for-tc' id='inst" + c + "' value='" + institution + "' ></p>");
    $("<div class='table-cell'>").append(input).appendTo(tableRow);
    var input = $("<input type='text' name='grade-for-tc' id='grade" + c + "' value='" + grade + "' />");
    $("<div class='table-cell'>").append(input).appendTo(tableRow);
    var input = $("<input type='text' name='units-for-tc' id='qunit" + c + "' value='" + unit + "' />");
    $("<div class='table-cell'>").on('input', function () {
        transferCreditsAnalysis();
        totalUnitAnalysis();
    }).append(input).appendTo(tableRow);
    tableRow.appendTo(table);
}

function removeRow_TransferCredits() {
    if (c > 0) {
        $("#row-transfer-credit" + c).remove();
        c--;
        transferCreditsAnalysis();
        totalUnitAnalysis();
    }
}

function addRow_TrackUnits(course, units) {
    var table = document.getElementById("transferTable2");
    ct++;
    var tableRow = $("<div class='table-row container-fluid' id='row-for-track" + ct + "''>");
    var input = $("<input type='text' name='course-for-track' id='course" + ct + "' value='" + course + "' />");
    input = input.on("keydown", function (e) {
        return e.which !== 32;
    });
    $("<div class='table-cell'>").on('input', function () {
        trackAnalysis();
        totalUnitAnalysis();
    }).append(input).appendTo(tableRow);
    var input = $("<input type='text' name='units-for-track' id='units" + ct + "' value=" + units + " />");
    $("<div class='table-cell'>").on('input', function () {
        trackAnalysis();
        totalUnitAnalysis();
    }).append(input).appendTo(tableRow);
    tableRow.appendTo(table);
    trackAnalysis();
}

function removeRow_TrackUnits() {
    if (ct > 0) {
        $("#row-for-track" + ct).remove();
        ct--;
        trackAnalysis();
        totalUnitAnalysis();
    }
}

function omitSpaceKey() {
    /*
     *  + REMOVES:  Any white spaces that appears on the targeted input texts
     *              as soon as user pasted a string with white space included.
     *  + DEPENDABILITY:
     *      [] .no-white-space: an empty CSS class name in index.css
     */

    $('.no-white-space').on('input', function() {
        $(this).val($(this).val().replace(/ /g,""));
    });
}

function lowerAndSpaceless(element) {
    var element = element.toLowerCase();
    element = element.replace(/ /g,"");
    return element;
}


/* -------------------------------------------------------------------------------- *
 *  FUNCTIONS:    OVERVIEW OF 'UNIT COUNT'                                               *
 * -------------------------------------------------------------------------------- *
 *  - transferCreditsUnitCount()
 *      + RETURNS:  total number of units in "transfer credit" section.
 *
 *  - coenFoundationalUnitCount()
 *      + RETURNS:  total number of units in "coen foundational" section.
 *  
 *  - coenCoreUnitCount()
 *      + RETURNS:  total number of units for checked item(s) in "coen core" section.
 *
 *  - gradCoreUnitCount()
 *      + RETURN:  total number of units in "grad core" section.
 *
 *  - trackUnitCount()
 *      + RETURNS:  total number of units in "track" section.
 *
 *  - trackUnitCount_Coen()
 *      + RETURNS:  total number of COEN units in "track" section.
 *
 *  - totalUnitCount()
 *      + RETURNS:  total number of units in all sections.
 */

function transferCreditsUnitCount() {
    /*
     *  + RETURNS:  total number of units in "transfer credit" section.
     *  + DEPENDENCY:
     *      [] buildTransferCredits()
     */
    var total = 0;
    var transfer = buildTransferCredits().mClasses;
    for (i = 0; i < transfer.length; i++) {
        total += Number(transfer[i].credits);
    }
    return total;
}

// function coenFoundationalUnitCount() {
//     /*
//      *  + RETURNS:  total number of units in "coen foundational" section.
//      *  + DEPENDENCY:
//      *      [] buildFoundationalCourses()
//      */
//     var total = 0;
//     var foundational = buildFoundationalCourses();
//     total += foundational.coen20 ? 4 : 0;
//     total += foundational.coen21 ? 4 : 0;
//     total += foundational.coen12 ? 4 : 0;
//     total += foundational.coen19 ? 4 : 0;
//     total += foundational.amth210 ? 4 : 0;
//     return total;
// }

function coenCoreUnitCount() {
    /*
     *  + RETURNS:  total number of units for checked item(s) in "coen core" section.
     *  + DEPENDENCY:
     *      [] buildCoenCoreReqs()
     *   
     *  + NOTE: 2 --> transfered 
     *          1 --> waived
     *          0 --> required
     */
    var total = 0;
    var core = buildCoenCoreReqs();
    total += core.coen210 == 0? 4 : 0;
    total += core.coen279 == 0? 4 : 0;
    total += core.coen283 == 0? 4 : 0;
    return total;
}

function gradCoreUnitCount() {
    /*
     *  + RETURN:  total number of units in "grad core" section.
     *  + DEPENDENCY:
     *      [] buildGradReqs()
     */
    var total = 0;
    var core = buildGradReqs();
    for (var i in core){
        total += Number(core[i].unit);
    }
    return total;
}

function trackUnitCount() {
    /*
     *  + RETURNS:  total number of units in "track" section.
     *  + DEPENDENCY:
     *      [] buildTrackUnits():
     */
    var total = 0;
    var track = buildTrackUnits();
    for (i = 0; i < track.length; i++) {
        total += Number(track[i].credits);
    }
    return total;
}

function trackUnitCount_Coen() {
    /*
     *  + RETURNS:  total number of COEN units in "track" section.
     *  + DEPENDENCY:
     *      [] buildTrackUnits()
     *      [] lowerAndSpaceless()
     */
    var total = 0;
    var track = buildTrackUnits();
    var trackCourseName = [];
    for (var i in track) {
        if (track[i].course == "") {
            var string = "none"+String(i);
            trackCourseName[i] = string;
        } else {
            var trackTemp = track[i].course;
            trackTemp = lowerAndSpaceless(trackTemp);
            trackCourseName[i] = trackTemp;
        }
    }

    for (i in trackCourseName) {
        var trackTemp = trackCourseName[i];
        if ((trackTemp.substr(0,4) == "coen") && Number(trackTemp.substr(4,3)) > 300) {
            total += Number(track[i].credits);
        }
    }
    return total;
}

function totalUnitCount() {
    /*
     *  + RETURNS: total number of units in all sections.
     *  + DEPENDENCY:
     *      [] transferCreditsUnitCount():
     *      [] coenFoundationalUnitCount():
     *      [] coenCoreUnitCount():
     *      [] gradCoreUnitCount():
     *      [] trackUnitCount():
     */
    var total = 0;
    total += transferCreditsUnitCount();
    // total += coenFoundationalUnitCount();
    total += coenCoreUnitCount();
    total += gradCoreUnitCount();
    total += trackUnitCount();
    return total;
}


/* -------------------------------------------------------------------------------- *
 *  FUNCTIONS: OVERVIEW OF 'VALIDATION'                                               *
 * -------------------------------------------------------------------------------- *
 *  - isSCU()
 *      + RETURNS:  number of maximum units, allowed for "transfer credit" section
 * 
 *  - transferCreditsValidation()
 *      + DISPLAY:  group of all warning message(s) for "transfer credit" section
 *
 *  - coenFoundationalValidation()
 *      + DISPLAY:  a warning message for "coen foundational" section.
 *
 *  - coenCoreValidation()
 *      + DISPLAY:  a warning message for "coen core" section.
 *
 *  - gradCoreValidation()
 *      + DISPLAY:  group of all warning message(s) for "grad core" section.
 *
 *  - trackValidation()
 *      + DISPLAY:  group of all warning message(s) for "track" section.
 *
 *  - totalUnitValidation()
 *      + DISPLAY:  a warning message if total overall units are under 45.
 */


function isSCU() {
    /*
     *  + RETURNS:  number of maximum units, allowed for "transfer credit" section.
     *  + NOTE: undergraduate --> 16
     *          accelerated --> 20
     *          transfer --> 9
     */
    var where = $('input[name="where"]:checked').val();
    if (where == 'undergraduate') {
        $('input[name="inst-for-tc"]').val("SCU Undergraduate");
        maxtransfer = 16;
    } else if (where == 'accelerated') {
        $('input[name="inst-for-tc"]').val("SCU Accelerated Masters");
        maxtransfer = 20;
    } else if (where == 'transfer')  {
        maxtransfer = 9;
    }
    return maxtransfer;
}

function transferCreditsValidation() {
    /* 
     *  + DISPLAY: group of all warning message(s) for "transfer credit" section.
     *  + DEPENDENCY:
     *      [] transferCreditsValidation_Unit()
     *      [] transferCreditsValidation_Duplicate()
     *      [] transferCreditsValidation_Coen()
     *      [] transferCreditsValidation_Grad()
     *      [] transferCreditsValidation_Track()
     */

    $("#messageBox1-3a").html("");
    $("#messageBox1-3b").html("");
    $("#messageBox1-3c").html("");
    $("#messageBox1-3d").html(""); 
    $("#messageBox1-3e").html(""); 

    transferCreditsValidation_Unit();
    transferCreditsValidation_Duplicate();
    transferCreditsValidation_Coen();
    transferCreditsValidation_Grad();
    transferCreditsValidation_Track();
}

function transferCreditsValidation_Unit() {
    /*
     *  + DISPLAYS:  a warning message if unit for "transfer credit" section 
     *               has exceeded its limit.
     *  + DEPENDENCY:
     *      [] transferCreditsUnitCount()
     *      [] isSCU()
     */
    if (transferCreditsUnitCount() > isSCU()) {
        $("#messageBox1-3a").html("<b>WARNING</b>: The number has exceeded the maximum unit allowed.");
    }
}

function transferCreditsValidation_Duplicate() {
    /*
     *  + DISPLAYS:  a warning message if duplicate course names are found
     *               within the "transfer credit" section.
     *               .
     *  + DEPENDENCY:
     *      [] buildTransferCredits()
     */
    var transfer = buildTransferCredits().mClasses;
    var transferCourseName = [];
    //exclude NULL values and rename it to none+i
    for (var i in transfer) {
        if (transfer[i].course == "") {
            var string = "none"+String(i);
            transferCourseName[i] = string;
        } else {
            var transferTemp = transfer[i].course;
            transferTemp = lowerAndSpaceless(transferTemp);
            transferCourseName[i] = transferTemp;
        }
    }
    //check duplicate names in courses
    for (var i in transferCourseName) {
        for (var j in transferCourseName) {
             if ((transferCourseName[i] == transferCourseName[j]) && (i !== j)) {
                $('#messageBox1-3b').html("<b>WARNING</b>: You have duplicate course name in the Transfer Credits section.")
            }
        }
    }
}

function transferCreditsValidation_Coen() {
    /*
     *  + DISPLAYS:  a warning message if duplicate course names are found
     *               between the "transfer credit" and "coen core" section.
     *               .
     *  + DEPENDENCY:
     *      [] buildTransferCredits()
     *      [] buildCoenCoreReqs()
     *      [] lowerAndSpaceless()
     */
    var transfer = buildTransferCredits().mClasses;
    var transferCourseName = [];
    //exclude NULL values and rename it to none+i
    for (var i in transfer) {
        if (transfer[i].course == "") {
            var string = "none"+String(i);
            transferCourseName[i] = string;
        } else {
            var transferTemp = transfer[i].course;
            transferTemp = lowerAndSpaceless(transferTemp);
            transferCourseName[i] = transferTemp;
        }
    }

    var coen = buildCoenCoreReqs();
    //check duplicate names appearing in GradCore  
    for (var i in transferCourseName) {
        for (var index in coen){
            if ((transferCourseName[i] == index)) {
                $('#messageBox1-3c').html("<b>WARNING</b>: You have duplicate course name in your Coen Core section.")
            }
        }
    }
}

function transferCreditsValidation_Grad() {
    /*
     *  + DISPLAYS:  a warning message if duplicate course names are found
     *               between the "transfer credit" and "grad core" section.
     *               .
     *  + DEPENDENCY:
     *      [] buildTransferCredits()
     *      [] buildGradReqs()
     *      [] lowerAndSpaceless()
     */
    var transfer = buildTransferCredits().mClasses;
    var transferCourseName = [];
    //exclude NULL values and rename it to none+i
    for (var i in transfer) {
        if (transfer[i].course == "") {
            var string = "none"+String(i);
            transferCourseName[i] = string;
        } else {
            var transferTemp = transfer[i].course;
            transferTemp = lowerAndSpaceless(transferTemp);
            transferCourseName[i] = transferTemp;
        }
    }
    var grad = buildGradReqs();
    //check duplicate names appearing in GradCore  
    for (var i in transferCourseName) {
        for (var j in grad) {
             if ((transferCourseName[i] == grad[j].course)) {
                $('#messageBox1-3d').html("<b>WARNING</b>: You have duplicate course name in your Grad Core section.");
            }
        }
    }
}

function transferCreditsValidation_Track() {
    /*
     *  + DISPLAYS:  a warning message if duplicate course names are found
     *               between the "transfer credit" and "track" section.
     *               .
     *  + DEPENDENCY:
     *      [] buildTransferCredits()
     *      [] buildTrackUnits()
     *      [] lowerAndSpaceless()
     */

    var transfer = buildTransferCredits().mClasses;
    var transferCourseName = [];
    for (var i in transfer) {
        if (transfer[i].course == "") {
            var string = "none"+String(i);
            transferCourseName[i] = string;
        } else {
            var transferTemp = transfer[i].course;
            transferTemp = lowerAndSpaceless(transferTemp);
            transferCourseName[i] = transferTemp;
        }
    }

    var track = buildTrackUnits();
    var trackCourseName = [];
    for (var i in track) {
        if (track[i].course == "") {
            var string = "mone"+String(i);
            trackCourseName[i] = string;
        } else {
            var trackTemp = track[i].course;
            trackTemp = lowerAndSpaceless(trackTemp);
            trackCourseName[i] = trackTemp;
        }
    }

    for (var i in transferCourseName) {
        for (var j in trackCourseName) {
            if ((transferCourseName[i] !== "") & ((trackCourseName[j] !== "")) & (transferCourseName[i] == trackCourseName[j])) {
                $("#messageBox1-3e").html("WARNING: You are not allowed to put TRANSFER CREDIT course here.");
            }
        }
     }
}


function coenFoundationalValidation() {
     
    /*  + DISPLAY: a warning message of violation for "coen foundational" section.
     *  + DEPENDENCY:
     *      [] buildFoundationalCourses():
     */
    /*
    $('#messageBox2-1').html('');
    var output = '';
    var foundational = buildFoundationalCourses();
    for (index in foundational) {
        if (foundational[index] == 0) {
            output += '<p>' + index + ': required </p>'; 
        } else {
            output += '<p>' + index + ': waived </p>';
        }
    }
    $('#messageBox2-1').html(output);*/
}


function coenCoreValidation() {
    /* 
     *  + DISPLAY: a warning message of violation for 3rd section.
     *  + DEPENDENCY:
     *      [] buildCoenCoreReqs():
     */
    var fail = false;
    var core = buildCoenCoreReqs();
}


function gradCoreValidation() {
    /* 
     *  + DISPLAY:  group of all warning message(s) for "grad core" section.
     *  + DEPENDENCY:
     *      [] gradCoreValidation_Unit()
     *      [] gradCoreValidation_Duplicate()
     *      [] gradCoreValidation_Transfer()
     *      [] gradCoreValidation_Coen()
     */

    $("#messageBox4-3a").html("");
    $("#messageBox4-3b").html("");
    $("#messageBox4-3c").html("");
    $("#messageBox4-3d").html("");
    
    gradCoreValidation_Unit();
    gradCoreValidation_Duplicate();
    gradCoreValidation_Transfer();
    gradCoreValidation_Coen();
}

function gradCoreValidation_Unit() {
    /*
     *  + DISPLAYS:  a warning message if unit for "grad core" section 
     *               has exceeded its maximum.
     *  + DEPENDENCY:
     *      [] gradCoreUnitCount()
     */
    if (gradCoreUnitCount() < 6) {
        $("#messageBox4-3a").html("WARNING: Your minimum unit is not met.");
    }
}

function gradCoreValidation_Duplicate() {
    /*
     *  + DISPLAYS:  a warning message if duplicate course names are found
     *               within the "grad core" section.
     *               .
     *  + DEPENDENCY:
     *      [] buildGradReqs()
     */
    var grad = buildGradReqs();
    var gradCourseName = [];
    /* temporary variables set to specify non-input */
    for (i in grad) {
        if (grad[i].course == "") {
            var string = "none"+String(i);
            gradCourseName[i] = string;
        } else {
            var gradTemp = grad[i].course;
            gradTemp = lowerAndSpaceless(gradTemp);
            gradCourseName[i] = gradTemp;
        }
    }

    for (i in gradCourseName) {
        for (j in gradCourseName) {
            if ((gradCourseName[i] == gradCourseName[j]) & (i!==j))
                $("#messageBox4-3b").html("WARNING: You included the same course twice");
        }
    }
}

function gradCoreValidation_Transfer() {
    /*
     *  + DISPLAYS:  a warning message if duplicate course names are found
     *               between the "grad core" and "transfer credit" section.
     *               .
     *  + DEPENDENCY:
     *      [] buildGradReqs()
     *      [] buildTransferCredits()
     *      [] lowerAndSpaceless()
     */
    var grad = buildGradReqs();
    var gradCourseName = [];
    for (var i in grad) {
        if (grad[i].course == "") {
            var string = "mone"+String(i);
            gradCourseName[i] = string;
        } else {
            var gradTemp = grad[i].course;
            gradTemp = lowerAndSpaceless(gradTemp);
            gradCourseName[i] = gradTemp;
        }
    }

    var transfer = buildTransferCredits().mClasses;
    var transferCourseName = [];
    //exclude NULL values and rename it to none+i
    for (var i in transfer) {
        if (transfer[i].course == "") {
            var string = "none"+String(i);
            transferCourseName[i] = string;
        } else {
            var transferTemp = transfer[i].course;
            transferTemp = lowerAndSpaceless(transferTemp);
            transferCourseName[i] = transferTemp;
        }
    }

    //check duplicate names appearing in GradCore  
    for (var i in transferCourseName) {
        for (var j in gradCourseName) {
             if ((transferCourseName[i] == gradCourseName[j])) {
                $("#messageBox4-3c").html("<b>WARNING</b>: You have duplicate course name in your Transfer Credit section.");
            }
        }
    }
}

function gradCoreValidation_Coen() {
    /*
     *  + DISPLAYS:  a warning message if duplicate course names are found
     *               between the "grad core" and "coen core" section.
     *               .
     *  + DEPENDENCY:
     *      [] buildGradReqs()
     *      [] buildCoenCoreReqs()
     *      [] lowerAndSpaceless()
     */
    var grad = buildGradReqs();
    var gradCourseName = [];
    for (var i in grad) {
        if (grad[i].course == "") {
            var string = "none"+String(i);
            gradCourseName[i] = string;
        } else {
            var gradTemp = grad[i].course;
            gradTemp = lowerAndSpaceless(gradTemp);
            gradCourseName[i] = gradTemp;
        }
    }

    var coen = buildCoenCoreReqs();
    //check duplicate names appearing in GradCore  
    for (var i in gradCourseName) {
        for (var index in coen) {
             if ((gradCourseName[i] == index)) {
                $("#messageBox4-3d").html("<b>WARNING</b>: You have duplicate course name in your Coen Core section.");
            }
        }
    }
}


function trackValidation() {
    /* 
     *  + DISPLAYS: group of all warning message(s) for "track" section.
     *  + DEPENDENCY:
     *      [] trackValidation_Unit()
     *      [] trackValidation_Duplicate()
     *      [] trackValidation_Transfer()
     *      [] trackValidation_Coen()
     *      [] trackValidation_Grad()
     */

    $("#messageBox5-3a").html("");
    $("#messageBox5-3b").html("");
    $("#messageBox5-3c").html("");
    $("#messageBox5-3d").html("");
    $("#messageBox5-3e").html("");

    trackValidation_Unit();
    trackValidation_Duplicate();
    trackValidation_Transfer();
    trackValidation_Coen();
    trackValidation_Grad();
}

function trackValidation_Unit() {
    /*
     *  + DISPLAYS:  a warning message if COEN unit for "track" section 
     *               has NOT met its minimum.
     *  + DEPENDENCY:
     *      [] trackUnitCount_Coen()
     */
    if (trackUnitCount_Coen() < 8) {
        $("#messageBox5-3a").html("WARNING: Your COEN minimum unit is not met.");
    }
}

function trackValidation_Duplicate() {
    /*
     *  + DISPLAYS:  a warning message if duplicate course names are found
     *               within the "track" section.
     *               .
     *  + DEPENDENCY:
     *      [] buildTrackUnits()
     */
    var track = buildTrackUnits();
    var trackCourseName = [];
    //exclude NULL values and rename it to none+i
    for (var i in track) {
        if (track[i].course == "") {
            var string = "none"+String(i);
            trackCourseName[i] = string;
        } else {
            var trackTemp = track[i].course;
            trackTemp = lowerAndSpaceless(trackTemp);
            trackCourseName[i] = trackTemp;
        }
    }
    //check duplicate names in courses
    for (var i in trackCourseName) {
        for (var j in trackCourseName) {
             if ((trackCourseName[i] == trackCourseName[j]) && (i !== j)) {
                $('#messageBox5-3b').html("<b>WARNING</b>: You have duplicate course name in your Track section.")
            }
        }
    }
}

function trackValidation_Transfer() {
    /*
     *  + DISPLAYS:  a warning message if duplicate course names are found
     *               between the "track" and "transfer credit" section.
     *               .
     *  + DEPENDENCY:
     *      [] buildTrackUnits()
     *      [] buildTransferCredits()
     *      [] lowerAndSpaceless()
     */
    var track = buildTrackUnits();
    var trackCourseName = [];
    //exclude NULL values and rename it to none+i
    for (var i in track) {
        if (track[i].course == "") {
            var string = "mone"+String(i);
            trackCourseName[i] = string;
        } else {
            var trackTemp = track[i].course;
            trackTemp = lowerAndSpaceless(trackTemp);
            trackCourseName[i] = trackTemp;
        }
    }

    var transfer = buildTransferCredits().mClasses;
    var transferCourseName = [];
    //exclude NULL values and rename it to none+i
    for (var i in transfer) {
        if (transfer[i].course == "") {
            var string = "none"+String(i);
            transferCourseName[i] = string;
        } else {
            var transferTemp = transfer[i].course;
            transferTemp = lowerAndSpaceless(transferTemp);
            transferCourseName[i] = transferTemp;
        }
    }

    for (var i in transferCourseName) {
        for (var j in trackCourseName) {
            if ((transferCourseName[i] !== "") & ((trackCourseName[j] !== "")) & (transferCourseName[i] == trackCourseName[j])) {
                $("#messageBox5-3c").html("WARNING: You are not allowed to put TRANSFER CREDIT course here.");
            }
        }
     }
}

function trackValidation_Coen() {
    /*
     *  + DISPLAYS:  a warning message if duplicate course names are found
     *               between the "track" and "coen core" section.
     *               .
     *  + DEPENDENCY:
     *      [] buildTrackUnits()
     *      [] buildCoenCoreReqs()
     *      [] lowerAndSpaceless()
     */
    
    var track = buildTrackUnits();
    var trackCourseName = [];
    //exclude NULL values and rename it to none+i
    for (var i in track) {
        if (track[i].course == "") {
            var string = "mone"+String(i);
            trackCourseName[i] = string;
        } else {
            var trackTemp = track[i].course;
            trackTemp = lowerAndSpaceless(trackTemp);
            trackCourseName[i] = trackTemp;
        }
    }

    var coen = buildCoenCoreReqs();
    //check duplicate names appearing in CoenCore
    for (var index in coen) {
        for (var i in trackCourseName) {
            if (trackCourseName[i] == index) {
                $("#messageBox5-3d").html("WARNING: You are not allowed to put COEN CORE course here.");
            }
        }
    }
}

function trackValidation_Grad() {
    /*
     *  + DISPLAYS:  a warning message if duplicate course names are found
     *               between the "track" and "grad core" section.
     *               .
     *  + DEPENDENCY:
     *      [] buildTrackUnits()
     *      [] buildGradReqs()
     *      [] lowerAndSpaceless()
     */
    
    var track = buildTrackUnits();
    var trackCourseName = [];
    //exclude NULL values and rename it to none+i
    for (var i in track) {
        if (track[i].course == "") {
            var string = "mone"+String(i);
            trackCourseName[i] = string;
        } else {
            var trackTemp = track[i].course;
            trackTemp = lowerAndSpaceless(trackTemp);
            trackCourseName[i] = trackTemp;
        }
    }

    var grad = buildGradReqs();
    var gradCourseName = [];
    for (i in grad) {
        if (grad[i].course == "") {
            var string = "none"+String(i);
            gradCourseName[i] = string;
        } else {
            var gradTemp = grad[i].course;
            gradTemp = lowerAndSpaceless(gradTemp);
            gradCourseName[i] = gradTemp;
        }
    }

    for (var i in gradCourseName) {
        for (var j in trackCourseName) {
            if (trackCourseName[j] == gradCourseName[i]) {
                $("#messageBox5-3e").html("WARNING: You have the same course listed in GRAD CORE.");
            }
        }
    }
}


function totalValidation() {
    /* 
     *  + DISPLAY: a warning message if total overall units are under 45.
     *  + DEPENDENCY:
     *      [] totalUnitCount()
     */
    $("#messageBox6-3").html("");
    if (totalUnitCount() < 45) {
        $('#messageBox6-3').html("<b>WARNING</b>: You must have at least total of 45 units");
    }
}

/* -------------------------------------------------------------------------------- *
 *  FUNCTIONS:  OVERVIEW OF 'ANALYSIS'                                               *
 * -------------------------------------------------------------------------------- *
 *  1. transferCreditsAnalysis()
 *      + DISPLAY: summed units and warning messages on "transfer credit" section.
 *
 *  2. coenFoundationalAnalysis()
 *      + DISPLAY: summed units and warning messages on "coen foundational" section.
 *  
 *  3. coenCoreAnalysis()
 *      + DISPLAY: summed units on "coen core" section.
 *
 *  4. gradCoreAnalysis()
 *      + DISPLAY: summed units and warning messages on "grad core" section.
 *
 *  5. trackAnalysis()
 *      + DISPLAY: summed units and warning messages on "track" section.
 *
 *  6. totalUnitAnalysis()
 *      + DISPLAY: summed units and warning messages for "total" section.
 */

function transferCreditsAnalysis() {
    /*
     *  + DISPLAY: summed units and warning messages on "transfer credit" section.
     *  + dependency: 
     *      [] transferCreditsValidation() 
     *      [] transferCreditsUnitCount()
     */
    transferCreditsValidation();
    // appendInstitutionName();
    // $('#messageBox1-1').html("TOTAL UNITS = " + transferCreditsUnitCount());
    $('#messageBox1-2').html("TOTAL UNITS FOR TRANSFER CREDIT = " + transferCreditsUnitCount());
}

function coenFoundationalAnalysis() {
    /*
     *  + DISPLAY: summed units and warning messages on "coen foundational" section.
     *  + dependency: 
     *      [] coenFoundationalValidation() 
     *      [] coenFoundationalUnitCount()
     */

    coenFoundationalValidation();
    // $('#messageBox2-2').html("TOTAL UNITS FOR COEN FOUNDATOINAL = " + coenFoundationalUnitCount());
}

function coenCoreAnalysis() {
    /*
     *  + DISPLAY: summed units on "coen core" section.
     *  + dependency: 
     *      [] coenCoreUnitCount()
     */
    // $('#messageBox3-1').html("TOTAL UNITS = " + coenCoreUnitCount());
    $('#messageBox3-2').html("TOTAL UNITS FOR COEN CORE = " + coenCoreUnitCount());
}

function gradCoreAnalysis() {
    /*
     *  + DISPLAY: summed units and warning messages on "grad core" section.
     *  + dependency: 
     *      [] gradCoreValidation()
     *      [] gradCoreUnitCount()
     */

    gradCoreValidation();
    // $('#messageBox4-1').html("TOTAL UNITS = " + gradCoreUnitCount());
    $('#messageBox4-2').html("TOTAL UNITS FOR GRAD CORE = " + gradCoreUnitCount());
}

function trackAnalysis() {
    /*
     *  + DISPLAY: summed units and warning messages on "track" section.
     *  + dependency: 
     *      [] trackValidation()
     *      [] trackUnitCount_Coen()
     *      [] trackUnitCount()
     */

    trackValidation();
    // $('#messageBox5-1').html("TOTAL UNITS = " + trackUnitCount());
    $('#messageBox5-2a').html("TOTAL UNITS FOR COEN IN TRACK = " + trackUnitCount_Coen());
    $('#messageBox5-2b').html("TOTAL UNITS FOR TRACK = " + trackUnitCount());
}

function totalUnitAnalysis() {
    /*
     *  + DISPLAY: summed units and warning messages for "total" section.
     *  + dependency: 
     *      [] totalValidation()
     *      [] totalUnitCount());
     */
    totalValidation();
    $('#messageBox6-1').html("TOTAL OF TOTAL UNITS = " + totalUnitCount());
}



/*JQUERY FUNCTIONS*/
$(document).ready(function () {
    // White Space Removal Initialization
    omitSpaceKey();

    //ADD A FIRST ROW for 1st and 5th section.
    addRow_TransferCredits("", "", "", 0.0);
    addRow_TrackUnits("", 0.0);
    omitSpaceKey();

    // Tally Initialization
    transferCreditsAnalysis();
    coenFoundationalAnalysis();
    coenCoreAnalysis();
    totalUnitAnalysis();

    //EVENT HANDLER for text change
    $('input[type="text"]').on('input', function () {
        transferCreditsAnalysis(); /* section 1 */
        gradCoreAnalysis(); /* section 4 */
        trackAnalysis(); /* section 5 */
        totalUnitAnalysis(); /* section 6 */
        omitSpaceKey();
    });

    $('select').change(function() {
        coenFoundationalAnalysis();
        coenCoreAnalysis();
        totalUnitAnalysis();
        gradCoreAnalysis();
        trackAnalysis();
    });

    $('input[type="radio"]').change(function() {
        transferCreditsAnalysis();
        totalUnitAnalysis(); /* section 6 */
    });

    //EVENT HANDLER for selection  change
    $("input[name='req_society']").change(function () {
        transferCreditAnalysis();
        gradCoreAnalysis();
        trackAnalysis();
        totalUnitAnalysis();
        omitSpaceKey();
    });

    $("input[name='req_business']").change(function () {
        transferCreditAnalysis();
        gradCoreAnalysis();
        trackAnalysis();
        totalUnitAnalysis();
        omtiSpaceKey();
    });

    $("input[name='req_emerg']").change(function () {
        transferCreditAnalysis();
        gradCoreAnalysis();
        trackAnalysis();
        totalUnitAnalysis();
        omitSpaceKey();
    });


    //EVENT HANDLER for space-key restriction
    $('input[name="req_emerg"]').on("keydown", function (e) {
        return e.which !== 32;
    });
    $('input[name="req_business"]').on("keydown", function (e) {
        return e.which !== 32;
    });
    $('input[name="req_society"]').on("keydown", function (e) {
        return e.which !== 32;
    });

    /* 
     *  ##1  APPROVED TRANSFER CREDITS##
     */

    $('#add_row').click(function () {
        addRow_TransferCredits("", "", "", 0.0);
        omitSpaceKey();
        transferCreditsAnalysis();
        totalUnitAnalysis();
    });

    $('#remove_row').click(function () {
        removeRow_TransferCredits();
        omitSpaceKey();
        transferCreditsAnalysis();
        totalUnitAnalysis();
    });

    /* 
     *  ##2. buttons in FOUNDATIONAL COURSES ##
     */

    // "select all wavied" button 
    $('#select_all2').click(function () {
        $(".reqsel").val("0");
        coenFoundationalAnalysis();
        coenCoreAnalysis();
        totalUnitAnalysis();
    });

    // "deselect all" button
    $('#deselect_all2').click(function () {
        $(".reqsel").val("1");
        coenFoundationalAnalysis();
        coenCoreAnalysis();
        totalUnitAnalysis();
    });


    /* 
     *  ##3. buttons in CS AND ENGR CORE COURSES ##
     */

    // "select all waived" button 
    $('#select_all3').click(function () { // on click select all button
        $(".reqsel2").val("0");
        coenCoreAnalysis();
        totalUnitAnalysis();
    });

    // "deselect all" button
    $('#deselect_all3').click(function () { // on click select all button
        $(".reqsel2").val("1");
        coenCoreAnalysis();
        totalUnitAnalysis();
    });

    $('#transfer_all3').click(function () {
        $(".reqsel2").val("2");
        coenCoreAnalysis();
        totalUnitAnalysis();
    })

    /*
     *  ##4. buttons in SCU GRAD CORE COURSES ##
     */
    $('#reset').click(function () {
        $('#req_emerg>option:eq(0)').attr('selected', true);
        $('#req_bsns>option:eq(0)').attr('selected', true);
        $('#req_soc>option:eq(0)').attr('selected', true);
        gradCoreAnalysis();
    });


    /* 
     *  ## 5. buttons in TRACK ##
     */
    $('#add_row5').click(function () {
        addRow_TrackUnits("", 0.0);
        omitSpaceKey();
        trackAnalysis();
        totalUnitAnalysis();
    });

    $('#remove_row5').click(function () {
        removeRow_TrackUnits();
        omitSpaceKey();
        trackAnalysis();
        totalUnitAnalysis();
    });

}); /* END OF JQUERY FUNCTION */
