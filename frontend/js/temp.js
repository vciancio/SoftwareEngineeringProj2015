/* JQUERY FUNCTIONS */
        $(document).ready(function () {
            var safe = true;
            var tally = 0;
            var arr = [];
            /* 
             *  ##1  APPROVED TRANSFER CREDITS 
             */
            var c = 1; // row count
            var arr1 = [];
            var tally1tmp = 0;

            $('#add_row').click(function () {
                var table = document.getElementById("transferTable");
                var tableRow = $("<div class='table-row row" + (c + 1) + "'>");
                var input = $("<input type='text' class='coursename' name='course' id=course" + (c + 1) + " />");
                $("<div class='table-cell'>").append(input).appendTo(tableRow);
                var input = $("<input type='text' name='inst' id=inst" + (c + 1) + " />");
                $("<div class='table-cell'>").append(input).appendTo(tableRow);
                var input = $("<input type='text' name='grade' id=grade" + (c + 1) + " />");
                $("<div class='table-cell'>").append(input).appendTo(tableRow);
                var input = $("<input type='text' name='qunit' id=qunit" + (c + 1) + " value=0.0 />");
                $("<div class='table-cell'>").append(input).appendTo(tableRow);
                tableRow.appendTo(table);
                c++;

            });

            $('#remove_row').click(function () {
                if (c > 1) {
                    $(".row" + c).remove();
                    c--;
                }
            });

            $('#analysis1').click(function () {
                var arrtmp = [];
                for (i = 0; i < c; i++) {
                    arrtmp.push({
                        course: $("#course" + (i + 1)).val(),
                        inst: $("#inst" + (i + 1)).val(),
                        grade: $("#grade" + (i + 1)).val(),
                        qunit: Number($("#qunit" + (i + 1)).val())
                    });
                }

                jQuery.each(arrtmp, function () {
                    console.log("course: " + this.course);
                    console.log("inst: " + this.inst);
                    console.log("grade: " + this.grade);
                    console.log("qunit: " + this.qunit);
                    console.log(" ");
                });
                arr1 = arrtmp;
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
                $(".classlist2").prop('checked', false);
            });

            // "check valid" button
            $('#check_valid2').click(function () { // on click check valid button
                var val = [];
                $('.classlist2:checked').each(function (i) { // loop through classlist 
                    val[i] = $(this).val();
                });
                //console.log(val);

                if (jQuery.inArray("coen20", val) == -1 || jQuery.inArray("coen21", val) == -1 || jQuery.inArray("coen12", val) == -1 || jQuery.inArray("coen19", val) == -1 || jQuery.inArray("amth210", val) == -1) { //check if all the courses are selected
                    safe = false;
                    document.getElementById("messageBox2-3").innerHTML =
                        "WARNING: You have not checked all the checkboxes. <br> Make sure to do so to move onto the next section.";
                } else {
                    safe = true;
                    document.getElementById("messageBox2-3").innerHTML = ""
                }

            });


            /* 
             *  ##3. CS AND ENGR CORE COURSES## 
             */
            var arr3 = [];
            var tally3tmp = 0;
            //var tally;

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
            var ct = 1; //count track courses
            var arr5 = [];
            var tally5tmp = 0;

            $('#add_row5').click(function () {
                var table = document.getElementById("transferTable2");
                var tableRow = $("<div class='table-row row" + (ct + 1) + "'>");

                var input = $("<input type='text' name='course' class='lowercase' id=course" + (ct + 1) + " />");
                $("<div class='table-cell'>").append(input).appendTo(tableRow);
                var input = $("<input type='text' name='units' id=units" + (ct + 1) + " />");
                $("<div class='table-cell'>").append(input).appendTo(tableRow);
                tableRow.appendTo(table);
                ct++;

            });

            $('#remove_row5').click(function () {
                if (ct > 1) {
                    $(".row" + ct).remove();
                    ct--;
                }
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
                tally5tmp = tally5
            });

            /* 
             *  ## 6. UNIT
             */
            $('#analysis6').click(function () {
                jQuery.merge(arr, arr1);
                jQuery.merge(arr, arr3);
                jQuery.merge(arr, arr4);
                jQuery.merge(arr, arr5);
                console.log(arr);

                jQuery.each(arr, function () {
                    console.log("course: " + this.course);
                    console.log("inst: " + this.inst);
                    console.log("qunit: " + this.qunit);
                    console.log(" ");
                });
            });


            $('#tally6').click(function () {
                tally = tally1tmp + tally3tmp + tally4tmp + tally5tmp;
                document.getElementById('messageBox6-2').innerHTML = "TOTAL UNITS = " + tally;
                if (tally < 45) {
                    safe = false;
                    document.getElementById('messageBox6-3').innerHTML =
                        "WARNING: Your total amount of quarter units. Make sure it's not more than 45 units."
                } else {
                    safe = true;
                    document.getElementById('messageBox6-3').innerHTML = "";
                }
            });



        }); /* END OF JQUERY FUNCTION */