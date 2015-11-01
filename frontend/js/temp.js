function myFunction() {
    var student, stdid, email;

    // Get the value of the input fields
    var student = document.getElementById("name").value;
    var stdid = document.getElementById("stdid").value;
    var email = document.getElementById("email ").value;

    // Find a <table> element with id="myTable":
    var table = document.getElementById("myTable");

    // Create an empty <tr> element and add it to the 1st position of the table:
    var row = table.insertRow(0);

    // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);


    document.getElementById("demo").innerHTML = stdid;
    document.getElementById("demo").innerHTML = student;
    document.getElementById("demo").innerHTML = email;

}

// The function that submits the form
function submitForm() {
    if (document.myform.onsubmit && !document.myform.onsubmit()) {
        return;
    }
    document.myform.submit();
}