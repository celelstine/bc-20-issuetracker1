
$(document).ready(function(){ 
  //password strength
  $("#password").keypress(function() {
   // alert($("#password").val());
  });

  $("#registration").submit(function(event) {

    /* stop form from submitting normally */
    event.preventDefault();
  //create user 
  let  currentUser;
  firebase.auth().createUserWithEmailAndPassword($('#email').val(), $('#password').val())
  .then(function(user){
   currentUser = firebase.auth().currentUser;
    if(currentUser) {
       $.post("/setsession",{uid: currentUser.uid},function(data, status){ console.log(status); });
    }

  })
  .catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
  });
  userRef = firebase.database().ref('ist/user');

  var  newuser = {
    "name" : $('#name').val(),
    "departments" : $('#department').val(),
    "uid" : currentUser.uid,
    "email" : $('#email').val(),
    "phone" :$('#phone').val()
  };
  userRef.push(newuser).then(function(user) {
    window.location.href = '/myreport';
  }). catch(function(error) {
    showresult("Error occured, please try again");
   // $("#result").text = "Error occures, please try again";
    //console.error('Sign Out Error', error);
    
  });
    });
});
  
