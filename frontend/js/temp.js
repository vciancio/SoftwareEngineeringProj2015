function myFunction() {
    var student, stdid, email;

    // Get the value of the input fields
    student = document.getElementById("name").value;
    stdid = document.getElementById("stdid").value;
    email = document.getElementById("email ").value;

    document.getElementById("demo").innerHTML = stdid;
    document.getElementById("demo").innerHTML = stdent;
    document.getElementById("demo").innerHTML = email;
    
    document.getElementById("myForm").submit();
    
}

// The function that submits the form
function submitForm () {
    if(document.myform.onsubmit && !document.myform.onsubmit()) {
        return;
    }
    document.myform.submit();
}