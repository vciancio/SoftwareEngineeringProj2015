/*JQUERY FUNCTIONS*/
var c = 0;
var ct = 0;

function addRow_TransferCredit(course, institution, grade, unit) {
    var table = document.getElementById("transferTable");
    var tableRow = $("<div id='tCredit_row' class='table-row row" + (c + 1) + "'>");
    var input = $("<input type='text' class='coursename' name='course' id='course" + (c + 1) + "' value='" + course + "' />");
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

    var input = $("<input type='text' name='course' class='lowercase' id='course" + (ct + 1) + "' value='" + course + "' />");
    $("<div class='table-cell'>").append(input).appendTo(tableRow);
    var input = $("<input type='text' name='units' id='units" + (ct + 1) + "' value='" + units + "' />");
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
    }
}



function transferCreditAnalysis() {
        /*
         * tally    
         */
        var tallytmp = 0;
        var objtmp = buildTransferCredits();
        for (i = 0; i < objtmp.length; i++) {
            tallytmp += Number(objtmp[i].credits);
        }
        $('#messageBox1-2').html("TOTAL UNITS = " + tallytmp);
        return tallytmp;
}

function coenFoundationalAnalysis() {
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

function gradCoreAnalysis() {
    /*
     *  tally
     */
     $('#messageBox4-2').html("TOTAL UNITS = " + gradCoreUnitCount());
     return gradCoreUnitCount();
}


function trackUnitAnalysis() {
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

function  gradCoreUnitCount() {
    var total = 0;
    var core = buildGradReqs();
    total += core.req_emerg != "none" ?4:0;
    total += core.req_business != "none" ?4:0;
    total += core.req_society != "none" ?4:0;
    return total;
}

function TrackValidation() {
    var status;
    var grad = buildGradReqs();
    var track = buildTrackUnits();
    jQuery.each(function() {

    });

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

$(document).ready(function () {
    var safe = true;
    var tally = 0;
    var arr = [];

    addRow_TransferCredit("", "", "", 0.0);
    addRow_TrackUnits("", 0.0);

    

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

    $('input[type=text]').on('input', function(){
        transferCreditAnalysis();
        trackUnitAnalysis();
    });
    $('input[type="checkbox"]').on('change', function() {
        coenCoreAnalysis();
        coenFoundationalAnalysis();
    });
    
    $("select[name='req_society']").change(function (){
        gradCoreAnalysis();
    });
    $("select[name='req_business']").change(function (){
        gradCoreAnalysis();
    });
    $("select[name='req_emerg']").change(function (){
        gradCoreAnalysis();
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
     *  ##2. FOUNDATIONAL COURSES 
     */
    // "select all" button 
    $('#select_all2').click(function () {
        $(".classlist2").prop('checked', true);
    });

    // "deselect all" button
    $('#deselect_all2').click(function () {
        x
    });


    /* 
     *  ##3. CS AND ENGR CORE COURSES## 
     */
    // "select all" button 
    $('#select_all3').click(function () { // on click select all button
        $(".classlist3").prop('checked', true);
    });

    // "deselect all" button
    $('#deselect_all3').click(function () { // on click select all button
        $(".classlist3").prop('checked', false);
    });

    $('#check_valid3').click(function () { // on click check valid button
        var val = [];
        var arrtmp = [];
        $('.classlist3:checked').each(function (i) { // loop through classlist 
            val[i] = $(this).val();
            arrtmp.push({
                course: $(this).val(),
                inst: "Santa Clara University",
                qunit: 4.0
            });
        });
        console.log(val);
        console.log(arrtmp);

        if (val.length == 0) {
            document.getElementById("messageBox3-1").innerHTML = "none";
        } else {
            document.getElementById("messageBox3-1").innerHTML = val.join(", ");
        }
        arr3 = arrtmp;
        //console.log(arr);
    });

    $('#tally3').click(function () {
        var tally3 = 0;
        jQuery.each(arr3, function () {
            tally3 += this.qunit;
        });
        document.getElementById("messageBox3-2").innerHTML = "TOTAL UNITS = " + tally3;
        tally3tmp = tally3;
    });




    /* 
     *  ##4. SCU Graduate Core Requirements
     */
    var arr4 = [];
    var tally4tmp = 0;

    $('#reset').click(function () {
        $('#req_emrg>option:eq(0)').attr('selected', true);
        $('#req_bsns>option:eq(0)').attr('selected', true);
        $('#req_soc>option:eq(0)').attr('selected', true);
    });

    $('#check_valid4').click(function () {
        var arrtmp = [];
        var valtmp = [];
        var valflt = [];
        req_emrg = $('#req_emrg option:selected').val();
        req_bsns = $('#req_bsns option:selected').val();
        req_soc = $('#req_soc option:selected').val();

        if (req_emrg !== "") valtmp.push(req_emrg);
        if (req_bsns !== "") valtmp.push(req_bsns);
        if (req_soc !== "") valtmp.push(req_soc);

        // remove duplicate & 
        $.each(valtmp, function (i, el) {
            if ($.inArray(el, valflt) === -1) {
                valflt.push(el);
                arrtmp.push({
                    course: el,
                    inst: "Santa Clara University",
                    qunit: 4.0
                });
            }
        });

        console.log(valflt);
        arr4 = arrtmp;
        console.log(arr4);

        if (valflt.length == 0) {
            document.getElementById("messageBox4-1").innerHTML = "none";
        } else {
            document.getElementById("messageBox4-1").innerHTML = valflt.join(", ");
        }
    });

    $('#tally4').click(function () {
        var tally4 = 0;
        jQuery.each(arr4, function () {
            tally4 += this.qunit;
        });
        document.getElementById("messageBox4-2").innerHTML = "TOTAL UNITS = " + tally4;
        if (tally4 < 6) {
            safe = false;
            document.getElementById('messageBox4-3').innerHTML =
                "WARNING: the total amount of quarter units is less than 6. <br> Make sure the sum is more than 6 units.";
        } else {
            safe = true;
            document.getElementById('messageBox4-3').innerHTML = "";
        }
        tally4tmp = tally4;
    });



    /* 
     *  ## 5. TRACK 
     */
    var arr5 = [];
    var tally5tmp = 0;

    $('#add_row5').click(function () {
        addRow_TrackUnits("", 0.0);
    });

    $('#remove_row5').click(function () {
        removeRow_TrackUnits();
    });

    $('#analysis5').click(function () {
        var arrtmp = [];
        for (i = 0; i < ct; i++) {
            arrtmp.push({
                course: $("#course" + (i + 1)).val(),
                inst: 'Santa Clara University',
                qunit: Number($("#units" + (i + 1)).val())
            });
        }
        console.log(arrtmp);

        jQuery.each(arrtmp, function () {
            console.log("course: " + this.course);
            console.log("inst: " + this.inst);
            console.log("qunit: " + this.qunit);
            console.log(" ");
        });
        arr5 = arrtmp;
    });

    $('#tally5').click(function () {
        var tally5 = 0;
        jQuery.each(arr5, function () {
            tally5 += this.qunit;
        });
        document.getElementById('messageBox5-2').innerHTML = "TOTAL UNITS = " + tally5;
        if (tally5 < 8) {
            safe = false;
            document.getElementById('messageBox5-3').innerHTML =
                "WARNING: Your total amount of quarter units. Make sure it's not more than 9 units."
        } else {
            safe = true;
            document.getElementById('messageBox5-3').innerHTML = "";
        }
        tally5tmp = tally5;
    });

    /* 
     *  ## 6. UNIT
     */
    
    $('#tally6').click(function () {
        document.getElementById('messageBox6-2').innerHTML = "TOTAL UNITS = " + totalUnitCount();
    });



}); /* END OF JQUERY FUNCTION */