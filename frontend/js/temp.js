var c = 0;
var ct = 0;
var maxtrans = 9;

function addRow_TransferCredit(course, institution, grade, unit) {
    var table = document.getElementById("transferTable");
    var tableRow = $("<div id='tCredit_row' class='table-row row" + (c + 1) + "'>");
    var input = $("<input type='text' class='coursename' name='course' id='course" + (c + 1) + "' value='" + course + "' />");
    input = input.on("keydown", function (e) {return e.which !== 32;}); //no space
    $("<div class='table-cell'>").append(input).appendTo(tableRow);
    var input = $("<input type='text' name='inst' id='inst" + (c + 1) + "' value='" + institution + "' />");
    $("<div class='table-cell'>").append(input).appendTo(tableRow);
    var input = $("<input type='text' name='grade' id='grade" + (c + 1) + "' value='" + grade + "' />");
    $("<div class='table-cell'>").append(input).appendTo(tableRow);
    var input = $("<input type='text' name='qunit' id='qunit" + (c + 1) + "'' value='" + unit + "' />");
    $("<div class='table-cell'>").on('input', function(){
        transferCreditAnalysis();
    }).append(input).appendTo(tableRow);
    tableRow.appendTo(table);
    c++;
}

function addRow_TrackUnits(course, units) {
    var table = document.getElementById("transferTable2");
    var tableRow = $("<div id='unitTrack_row' class='table-row row" + (ct + 1) + "'>");
    var input = $("<input type='text' name='course' class='lowercase' id='course" + (ct + 1) + "' value='" + course + "' />").on("keydown", function (e) {return e.which !== 32;})
    input = input.on('input', function() {
        trackValidation_Grad();
        trackValidation_Core();
    });
    $("<div class='table-cell'>").append(input).appendTo(tableRow);
    var input = $("<input type='text' name='units' id='units" + (ct + 1) + "' value=" + units + " />");
    $("<div class='table-cell'>").on('input', function() { 
        trackUnitAnalysis();
    }).append(input).appendTo(tableRow);
    tableRow.appendTo(table);
    ct++;
}

function removeRow_TransferCredit() {
    if (c > 0) {
        $(".row" + c).remove();
        c--;
        transferCreditAnalysis();
    }
}

function removeRow_TrackUnits() {
    if (ct > 0) {
        $(".row" + ct).remove();
        ct--;
        trackUnitAnalysis();
        trackValidation_Grad();
        trackValidation_Core();
    }
}


function isSCU() {
    /* read institution value
     * verify if its SCU or Santa Clara University
     * then maximum unit capacity increases to 16
     * else maximum unit capacity stays to 9. */
     var read = $("input[name='inst']").val();
     read = toString(read.toLowerCase());
     if (read == "scu" || read == "santa clara university") {
        maxtrans = 16;
     } else {
        maxtrans = 9;
     }
     return maxtrans;
}


function  transferCreditAnalysis() {
        /*
         * tally    
         */
        var tallytmp = 0;
        var objtmp = buildTransferCredits();
        for (i = 0; i < objtmp.length; i++) {
            tallytmp += Number(objtmp[i].credits);
        }
        $('#messageBox1-2').html("TOTAL UNITS = " + tallytmp);
        if(tallytmp > isSCU()) {
            $("#messageBox1-3").html("WARNING: Your maximum unit has exceeded.");
        } else {
            $("#messageBox1-3").html("");
        }
        return tallytmp;
}

function  coenFoundationalAnalysis() {
    /*
     *  tally
     */ 
     $('#messageBox2-2').html("TOTAL UNITS = " + coenFoundationalUnitCount());
     return coenFoundationalUnitCount();
}

function  coenCoreAnalysis() {
    /*
     *  tally
     */
     $('#messageBox3-2').html("TOTAL UNITS = " + coenCoreUnitCount());
     return coenCoreUnitCount();
}

function  gradCoreAnalysis() {
    /*
     *  tally
     */
     $('#messageBox4-2').html("TOTAL UNITS = " + gradCoreUnitCount());
     return gradCoreUnitCount();
}


function  trackUnitAnalysis() {
    /* 
     *  tally
     */
     var tallytmp = 0;
     var objtmp = buildTrackUnits();
     for (i=0; i<objtmp.length; i++) {
        tallytmp += Number(objtmp[i].credits);
     }
     $('#messageBox5-2').html("TOTAL UNITS = " + tallytmp);
     return tallytmp;
}

function totalUnitAnalysis() {
    /*
     * tally
     */
     $('#messageBox6-2').html("TOTAL OF TOTAL UNITS = " + totalUnitCount());
     return totalUnitCount();
}

function coenFoundationalUnitCount() {
    var total = 0;
    var foundational = buildFoundationalCourses();
    total += foundational.coen20?4:0;
    total += foundational.coen21?4:0;
    total += foundational.coen12?4:0;
    total += foundational.coen19?4:0;
    total += foundational.amth210?4:0;
    return total;
}

function coenCoreUnitCount(){
    var total = 0;
    var core = buildCoenCoreReqs();
    total += core.coen210?4:0;
    total += core.coen279?4:0;
    total += core.coen283?4:0;
    return total;
}

function gradCoreUnitCount() {
    var total = 0;
    var core = buildGradReqs();
    total += core.req_emerg != "none1" ?4:0;
    total += core.req_business != "none2" ?4:0;
    total += core.req_society != "none3" ?4:0;
    return total;
}

function gradCoreValidation() {
    var fail = false;
    var grad = buildGradReqs();
    if (grad.req_emerg == grad.req_business || 
        grad.req_emerg == grad.req_society || 
        grad.req_business == grad.req_society) {
            fail = true;
    }
    if (fail) {
        $("#messageBox4-3").html("WARNING: You included the same course twice");
    } else {
        $("#messageBox4-3").html("");
    } 
    return fail;
}

function trackValidation_Grad() {
    var fail = false;
    var grad = buildGradReqs();
    var track = buildTrackUnits();
    
    for(var i=0; i<track.length; i++) {
        if ((track[i].course == grad.req_emerg)|| 
            (track[i].course == grad.req_business) ||
            (track[i].course == grad.req_society)) {
            fail = true;
            $("#messageBox5-3").html("WARNING: You included the same GRAD CORE course twice");
        } else {
            fail = false;
            $("#messageBox5-3").html("");
        }
    }
}

function trackValidation_Core() {
    var fail = false;
    var track = buildTrackUnits();
    var core = buildCoenCoreReqs();
    var coreClasses = Object.keys(core);
    for(var i=0; i<track.length; i++) {
        for(var j=0; j<coreClasses.length; j++) {
            if(track[i].course == coreClasses[j]) fail = true;
        }
    }
    if (fail) {
        $("#messageBox5-3").html("WARNING: You included the same COEN CORE course twice");
    } else {
        $("#messageBox5-3").html("");
    }
    return fail;    
}

function totalUnitCount() {
    var total = 0; 
    total += transferCreditAnalysis();
    total += coenFoundationalUnitCount();
    total += coenCoreUnitCount();
    total += gradCoreUnitCount();
    total += trackUnitAnalysis();
    return total;
}


/*JQUERY FUNCTIONS*/
$(document).ready(function () {
    var safe = true;
    var tally = 0;
    var arr = [];

    addRow_TransferCredit("", "", "", 0.0);
    addRow_TrackUnits("", 0.0);


    $('input[type="text"]').on('input', function(){
        isSCU();
        gradCoreValidation();
        transferCreditAnalysis();
        trackUnitAnalysis();
        totalUnitAnalysis();
        trackValidation_Grad();

    });

    $('input[type="checkbox"]').change(function() {
        coenCoreAnalysis();
        coenFoundationalAnalysis();
        totalUnitAnalysis();
        trackValidation_Grad();
    });
    
    $("select[name='req_society']").change(function (){
        gradCoreAnalysis();
        totalUnitAnalysis();
        trackValidation_Grad();
        gradCoreValidation();
    });
    $("select[name='req_business']").change(function (){
        gradCoreAnalysis();
        totalUnitAnalysis();
        trackValidation_Grad();
        gradCoreValidation();
    });
    $("select[name='req_emerg']").change(function (){
        gradCoreAnalysis();
        totalUnitAnalysis();
        trackValidation_Grad();
        gradCoreValidation();
    });

    /* 
     *  ##1  APPROVED TRANSFER CREDITS 
     */
    var arr1 = [];
    var tally1tmp = 0;

    $('#add_row').click(function () {
        addRow_TransferCredit("", "", "", 0.0);
    });

    $('#remove_row').click(function () {
        removeRow_TransferCredit();
    });


    $('#tally1').click(function () {
        var tally1 = 0;
        jQuery.each(arr1, function () {
            tally1 += this.qunit;
        });
        document.getElementById('messageBox1-2').innerHTML = "TOTAL UNITS = " + tally1;
        if (tally1 > 9) {
            safe = false;
            document.getElementById('messageBox1-3').innerHTML =
                "WARNING: Your total amount of quarter units. Make sure it's not more than 9 units."
        } else {
            safe = true;
            document.getElementById('messageBox1-3').innerHTML = "";
        }
        tally1tmp = tally1;
    });



    /* 
     *  ##2. buttons in FOUNDATIONAL COURSES 
     */
    // "select all" button 
    $('#select_all2').click(function () {
        $(".classlist2").prop('checked', true);
        coenFoundationalAnalysis();
    });

    // "deselect all" button
    $('#deselect_all2').click(function () {
        $(".classlist2").prop('checked', false);
        coenFoundationalAnalysis();
    });


    /* 
     *  ##3. buttons in CS AND ENGR CORE COURSES
     */
    // "select all" button 
    $('#select_all3').click(function () { // on click select all button
        $(".classlist3").prop('checked', true);
        coenCoreAnalysis();
    });

    // "deselect all" button
    $('#deselect_all3').click(function () { // on click select all button
        $(".classlist3").prop('checked', false);
        coenCoreAnalysis();
    });

    /*
     *  ##4. buttons in SCU GRAD CORE COURSES
     */ 
     $('#reset').click(function() {
        $('#req_emrg>option:eq(0)').attr('selected', true);
        $('#req_bsns>option:eq(0)').attr('selected', true);
        $('#req_soc>option:eq(0)').attr('selected', true);
        gradCoreAnalysis();
    });

    /* 
     *  ## 5. buttons in TRACK 
     */
    $('#add_row5').click(function () {
        addRow_TrackUnits("", 0.0);
    });

    $('#remove_row5').click(function () {
        removeRow_TrackUnits();
    });

}); /* END OF JQUERY FUNCTION */