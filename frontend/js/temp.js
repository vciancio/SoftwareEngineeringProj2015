var c = 0;
var ct = 0;
var maxtransfer = 9;
var unit
var classes = [ {'course': 'amth308', 'unit': 2},    {'course': 'amth351', 'unit': 2}, 
                {'course': 'amth367', 'unit': 4},    {'course': 'amth387', 'unit': 4},
                {'course': 'bioe256', 'unit': 2},    {'course': 'ceng208', 'unit': 3},
                {'course': 'ceng219', 'unit': 4},    {'course': 'coen287', 'unit': 2},
                {'course': 'coen331', 'unit': 4},    {'course': 'coen389', 'unit': 2},
                {'course': 'elen280', 'unit': 2},    {'course': 'engr260', 'unit': 2},
                {'course': 'engr262', 'unit': 2},    {'course': 'engr273', 'unit': 2},    
                {'course': 'engr302', 'unit': 2},    {'course': 'engr304', 'unit': 2},
                {'course': 'engr336', 'unit': 2},    {'course': 'engr337', 'unit': 2}, 
                {'course': 'engr338', 'unit': 2},    {'course': 'mech371', 'unit': 4},
                {'course': 'mech372', 'unit': 4},    {'course': 'mech234', 'unit': 2},
                {'course': 'mech268', 'unit': 2},    {'course': 'mech295', 'unit': 2}
];
var classesTrack = [];

function addRow_TransferCredits(course, institution, grade, unit) {
    var table = document.getElementById("transferTable");
    var tableRow = $("<div class='table-row container-fluid' id='row-transfer-credit" + (c + 1) + "'>");
    var input = $("<input type='text' class='lowercase' name='course-for-tc' id='course" + (c + 1) + "' value='" + course + "' placeholder='coen12'/>");
    input = input.on("keydown", function (e) {
        return e.which !== 32;
    }); // restriction on typing space 
    $("<div class='table-cell'>").append(input).appendTo(tableRow);
    var input = $("<input type='text' name='inst-for-tc' id='inst" + (c + 1) + "' value='" + institution + "' />");
    $("<div class='table-cell'>").append(input).appendTo(tableRow);
    var input = $("<input type='text' name='grade-for-tc' id='grade" + (c + 1) + "' value='" + grade + "' />");
    $("<div class='table-cell'>").append(input).appendTo(tableRow);
    var input = $("<input type='text' name='units-for-tc' id='qunit" + (c + 1) + "' value='" + unit + "' />");
    $("<div class='table-cell'>").on('input', function () {
        transferCreditsAnalysis();
    }).append(input).appendTo(tableRow);
    tableRow.appendTo(table);
    c++;
}

function removeRow_TransferCredits() {
    if (c > 0) {
        $("#row-transfer-credit" + c).remove();
        c--;
        transferCreditsAnalysis();
    }
}


function addRow_TrackUnits(course, units) {
    var table = document.getElementById("transferTable2");
    var tableRow = $("<div class='table-row container-fluid' id='row-for-track" + (ct + 1) + "''>");
    var input = $("<input type='text' name='course-for-track' class='lowercase' id='course" + (ct + 1) + "' value='" + course + "' />");
    input = input.on("keydown", function (e) {
        return e.which !== 32;
    });
    $("<div class='table-cell'>").on('input', function () {
        trackAnalysis();
        totalUnitAnalysis();
    }).append(input).appendTo(tableRow);
    var input = $("<input type='text' name='units-for-track' id='units" + (ct + 1) + "' value=" + units + " />");
    $("<div class='table-cell'>").on('input', function () {
        trackAnalysis();
        totalUnitAnalysis();
    }).append(input).appendTo(tableRow);
    tableRow.appendTo(table);
    trackAnalysis()
    ct++;
}


function removeRow_TrackUnits() {
    if (ct > 0) {
        $("#row-for-track" + ct).remove();
        ct--;
        trackAnalysis();
    }
}




/* -------------------------------------------------------------------------------- *
 *  FUNCTIONS:    OVERVIEW OF 'UNIT COUNT'                                               *
 * -------------------------------------------------------------------------------- *
 *  - transferCreditsUnitCount()
 *      + RETURNS:  number of units for listed in 1st section.
 *
 *  - coenFoundationalUnitCount()
 *      + RETURNS:  number of units for checked item(s), listed in 2nd section.
 *  
 *  - coenCoreUnitCount()
 *      + RETURNS:  number of units for checked item(s), listed in 3rd section.
 *
 *  - gradCoreUnitCount()
 *      + RETURN:  number of units for selected item(s), listed in 4th section.
 *
 *  - trackUnitCount()
 *      + RETURNS:  number of units for listed item(s), listed in 5th section.
 *
 *  - totalUnitCount()
 *      + RETURNS:  number of units for 1-5 sections, in 6th section.
 */

function transferCreditsUnitCount() {
    /*
     *  + RETURNS:  number of units for listed in 1st section.
     *  + DEPENDENCY:
     *      [] buildTransferCredits():
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
//      *  + RETURNS:  number of units for checked item(s), listed in 2nd section.
//      *  + DEPENDENCY:
//      *      [] buildFoundationalCourses():
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
     *  + RETURNS:  number of units for checked item(s), listed in 3rd section.
     *  + DEPENDENCY:
     *      [] buildCoenCoreReqs():
     *   
     *   NOTE: 2 --> transfered; 1 --> waived; 0 --> required
     */
    var total = 0;
    var core = buildCoenCoreReqs();
    total += core.coen210 > 0? 0 : 4;
    total += core.coen279 > 0? 0 : 4;
    total += core.coen283 > 0? 0 : 4;
    return total;
}

function gradCoreUnitCount() {
    /*
     *  + RETURN:  number of units for selected item(s), listed in 4th section.
     *  + DEPENDENCY:
     *      [] buildGradReqs():
     */
    var total = 0;
    var core = buildGradReqs();
    for (var index in classes){
        if (classes[index].course == core.req_emerg)
            total += classes[index].unit;
        if (classes[index].course == core.req_business)
            total += classes[index].unit;
        if (classes[index].course == core.req_society)
            total += classes[index].unit;
    }
    return total;
}

function trackUnitCount() {
    /*
     *  + RETURNS:  number of units for listed item(s), listed in 5th section.
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

function totalUnitCount() {
    /*
     *  + RETURNS: number of units for 1-5 sections, in 6th section.
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
 *  1. transferCreditsValidation()
 *      + DISPLAY: a warning message of violation for 1st section.
 *
 *  2. coenFoundationalValidation()
 *      + DISPLAY: a warning message of violation for 2nd section.
 *
 *  3. coenCoreValidation()
 *      + DISPLAY: a warning message of violation for 3rd section.
 *
 *  4. gradCoreValidation()
 *      + DISPLAY: a warning message of violation for 4th section.
 *
 *  5. trackValidation()
 *      + DISPLAY: a warning message of violation for 5th section.
 *
 *  6. totalUnitValidation()
 *      + DISPLAY: a warning message of violation for 6th section.
 */

function isSCU() {
    /* read institution value
     * verify if its SCU or Santa Clara University
     * then maximum unit capacity increases to 16
     * else maximum unit capacity stays to 9. */

    var where = $('input[name="where"]:checked').val();
    if (where == 'undergraduate') {
        maxtransfer = 16;
    } else if (where == 'accelerated') {
        maxtransfer = 20;
    } else if (where == 'transfer')  {
        maxtransfer = 9;
    }
    return maxtransfer;
}

function transferCreditsValidation() {
    /* 
     *  + DISPLAY: a warning message of violation for 1st section.
     *  + DEPENDENCY:
     *      [] buildTransferCredits():
     *      [] transferCreditsUnitCount():
     */

    $("#messageBox1-3").html("");
    var transfer = buildTransferCredits().mClasses;
    if (transferCreditsUnitCount() > isSCU()) {
        $("#messageBox1-3").html("WARNING: The number has exceeded the maximum unit allowed.");
    }
    for (i=0; i<transfer.length; i++) {
        if ($('input[name="where"]:checked').val() == "transfer") {
            $('input[name="inst-for-tc"]').val("");
        } if ($('input[name="where"]:checked').val() == "undergraduate") {
            $('input[name="inst-for-tc"]').val("SCU Undergraduate");
        } if ($('input[name="where"]:checked').val() == "accelerated") {
            $('input[name="inst-for-tc"]').val("SCU Accelerated Master");
        }
    }
}

// function coenFoundationalValidation() {
     
//      *  + DISPLAY: a warning message of violation for 2nd section.
//      *  + DEPENDENCY:
//      *      [] buildFoundationalCourses():
     
//     var fail = false;
//     var foundational = buildFoundationalCourses();
// }

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
     *  + DISPLAY: a warning message of violation for 4th section.
     *  + DEPENDENCY:
     *      [] buildGradReqs();
     */
    $("#messageBox4-3a").html("");
    $("#messageBox4-3b").html("");
    if (gradCoreUnitCount() < 6) {
        $("#messageBox4-3a").html("WARNING: Your minimum unit is not met.");
    }
    var fail = false;
    var grad = buildGradReqs();
    /* temporary variables set to specify non-input */
    grad_em = grad.req_emerg !== "" ? grad.req_emerg:"none1";
    grad_bs = grad.req_business !== "" ? grad.req_business:"none2";
    grad_sc = grad.req_society !== "" ? grad.req_society:"none3";
    if (grad_em == grad_bs) {
        fail = true;
    } else if (grad_em == grad_sc) {
        fail = true;
    } else if (grad_bs == grad_sc) {
        fail = true;
    }
    if (fail) {
        $("#messageBox4-3b").html("WARNING: You included the same course twice");
    }
}

function trackValidation() {
    /* 
     *  + DISPLAY: a warning message of violation for 5th section.
     *  + DEPENDENCY:
     *      [] trackValidation_Unit():
     *      [] trackValidation_Grad():
     *      [] trackValidation_Core():
     */
    $("#messageBox5-3a").html("");
    $("#messageBox5-3b").html("");
    $("#messageBox5-3c").html("");

    trackValidation_Unit();
    trackValidation_Grad();
    trackValidation_Core();
}

function trackValidation_Unit() {
    /* 
     *  + DISPLAY: a warning message of violation for 5th section, with regards to units.
     *  + DEPENDENCY:
     *      [] trackUnitCount():
     */
    
    if (trackUnitCount() < 8) {
        $("#messageBox5-3a").html("WARNING: Your minimum unit is not met.");
    }
    if (trackUnitCount() > 45) {
        $("#messageBox5-3a").html("WARNING: The number has exceeded the maximum unit allowed.")
    }
}

function trackValidation_Grad() {
    /* 
     *  + DISPLAY:  a warning message of violation for 5th section, 
     *              with regards to duplicate name (appearing in GRAD CORE).
     *  + DEPENDENCY:
     *      [] buildGradReqs():
     *      [] buildTrackUnits():
     */
    var fail = false;
    var grad = buildGradReqs();
    var track = buildTrackUnits();
    /* temporary variables set to specify non-input */
    grad_em = grad.req_emerg !== "" ? grad.req_emerg:"none1";
    grad_bs = grad.req_business !== "" ? grad.req_business:"none2";
    grad_sc = grad.req_society !== "" ? grad.req_society:"none3";

    for (var i = 0; i < track.length; i++) {
        if ((track[i].course == grad_em) ||
            (track[i].course == grad_bs) ||
            (track[i].course == grad_sc)) {
            fail = true;
        }
    }
    if (fail) {
        $("#messageBox5-3b").html("WARNING: You included the same GRAD CORE course twice");
    }
}

function trackValidation_Core() {
    /* 
     *  + DISPLAY:  a warning message of violation for 5th section, 
     *              with regards to duplicate name (appearing in GRAD CORE).
     *  + DEPENDENCY:
     *      [] buildCoenCoreReqs():
     *      [] buildTrackUnits():
     */

    var fail = false;
    var core = buildCoenCoreReqs();
    var track = buildTrackUnits();
    var coreClasses = Object.keys(core);

    
    for (var j = 0; j < coreClasses.length; j++) {
        for (var i = 0; i < track.length; i++) {
            if (track[i].course == coreClasses[j]){
                fail = true;
            }
        }
    }
    if (fail) {
        $("#messageBox5-3c").html("WARNING: You are not allowed to put COEN CORE course here");
    }
}


/* -------------------------------------------------------------------------------- *
 *  FUNCTIONS:  OVERVIEW OF 'ANALYSIS'                                               *
 * -------------------------------------------------------------------------------- *
 *  1. transferCreditsAnalysis()
 *      + DISPLAY: number of units for Transfer Credit listed in 1st section.
 *
 *  2. coenFoundationalAnalysis()
 *      + DISPLAY: display number of units summed for checked item(s), listed in 2nd section.
 *  
 *  3. coenCoreAnalysis()
 *      + DISPLAY: display number of units for checked item(s), listed in 3rd section.
 *
 *  4. gradCoreAnalysis()
 *      + DISPLAY: total number of units for selected item(s), listed in 4th section.
 *
 *  5. trackAnalysis()
 *      + DISPLAY: total number of units for listed item(s), listed in 5th section.
 *
 *  6. totalUnitAnalysis()
 *      + DISPLAY: total number of units for listed item(s), listed in 6th section.
 */

function transferCreditsAnalysis() {
    /*
     *  + DISPLAY: number of units for Transfer Credit listed in 1st section.
     *  + dependency: 
     *      [] buildTransferCredits(): 
     */
    transferCreditsValidation();
    $('#messageBox1-2').html("TOTAL UNITS FOR TRANSFER CREDIT = " + transferCreditsUnitCount());
}

// function coenFoundationalAnalysis() {
    /*
     *  + DISPLAY: number of units summed for checked item(s), listed in 2nd section.
     *  + DEPENDENCY: 
     *      [] coenFoundationalUnitCount()
     */

    // coenFoundationalValidation();
    // $('#messageBox2-2').html("TOTAL UNITS FOR COEN FOUNDATOINAL = " + coenFoundationalUnitCount());
// }

function coenCoreAnalysis() {
    /*
     *  + DISPLAY: number of units for checked item(s), listed in 3rd section.
     *  + DEPENDENCY:
     *      []  coenCoreUnitCount():
     */

    $('#messageBox3-2').html("TOTAL UNITS FOR COEN CORE = " + coenCoreUnitCount());
}

function gradCoreAnalysis() {
    /*
     *  + DISPLAY: total number of units for selected item(s), listed in 4th section.
     *  + DEPENDENCY:
     *      []  gradCoreUnitCount():
     */
    gradCoreValidation();
    $('#messageBox4-2').html("TOTAL UNITS FOR GRAD CORE = " + gradCoreUnitCount());
}

function trackAnalysis() {
    /* 
     *  + DISPLAY: number of units for listed item(s), listed in 5th section.
     *  + DEPENDENCY:
     *      []  trackUnitCount():
     *      []  trackValidation():
     */
    trackValidation();
    $('#messageBox5-2').html("TOTAL UNITS FOR TRACK = " + trackUnitCount());
}

function totalUnitAnalysis() {
    /*
     *  + DISPLAY: total number of units for listed item(s), listed in 6th section.
     *  + DEPENDENCY:
     *      []  totalUnitCount():
     */
    $('#messageBox6-2').html("TOTAL OF TOTAL UNITS = " + totalUnitCount());
}



/*JQUERY FUNCTIONS*/
$(document).ready(function () {
    //ADD A FIRST ROW for 1st and 5th section.
    addRow_TransferCredits("", "", "", 0.0);
    addRow_TrackUnits("", 0.0);

    //EVENT HANDLER for text change
    $('input[type="text"]').on('input', function () {
        transferCreditsAnalysis(); /* section 1 */
        gradCoreAnalysis(); /* section 4 */
        trackAnalysis(); /* section 5 */
        totalUnitAnalysis(); /* section 6 */
    });

    //EVENT HANDLER for checkbox change
    $('input[type="checkbox"]').change(function () {
        // coenFoundationalAnalysis(); /* section 2 */
        coenCoreAnalysis(); /* section 3 */
        totalUnitAnalysis(); /* sectoin 6 */
    });

    //EVENT HANDLER for selection  change
    $("select[name='req_society']").change(function () {
        gradCoreAnalysis();
        trackAnalysis();
        totalUnitAnalysis();
    });

    $("select[name='req_business']").change(function () {
        gradCoreAnalysis();
        trackAnalysis();
        totalUnitAnalysis();
    });

    $("select[name='req_emerg']").change(function () {
        trackAnalysis();
        gradCoreAnalysis();
        totalUnitAnalysis();
    });

    /* 
     *  ##1  APPROVED TRANSFER CREDITS##
     */

    $('#add_row').click(function () {
        addRow_TransferCredits("", "", "", 0.0);
        transferCreditsAnalysis();
    });

    $('#remove_row').click(function () {
        removeRow_TransferCredits();
        transferCreditsAnalysis();
    });

    /* 
     *  ##2. buttons in FOUNDATIONAL COURSES ##
     */

    // "select all wavied" button 
    $('#select_all2').click(function () {
        $(".reqsel").val("required");
        coenCoreAnalysis();
    });

    // "deselect all" button
    $('#deselect_all2').click(function () {
        $(".reqsel").val("waived");
        coenCoreAnalysis();
    });


    /* 
     *  ##3. buttons in CS AND ENGR CORE COURSES ##
     */

    // "select all waived" button 
    $('#select_all3').click(function () { // on click select all button
        $(".reqsel2").val("0");
        coenCoreAnalysis();
    });

    // "deselect all" button
    $('#deselect_all3').click(function () { // on click select all button
        $(".reqsel2").val("1");
        coenCoreAnalysis();
    });

    $('#transfer_all3').click(function () {
        $(".reqsel2").val("2");
        coenCoreAnalysis();
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
        trackAnalysis();
    });

    $('#remove_row5').click(function () {
        removeRow_TrackUnits();
        trackAnalysis();
    });

}); /* END OF JQUERY FUNCTION */