function saveUserID(uid) {
   localStorage.setItem("uid",uid);
   let Userref = firebase.database().ref('ist/user')
    Userref.orderByChild('uid').equalTo(uid).on("value", function(snapshot) {
      console.log(snapshot.val());
      snapshot.forEach(function(data) {
        localStorage.setItem("username",data.val().name);
      });
    });
}

$(document).ready(function(){ 
  //password strength
  $("#password").keypress(function() {
   // alert($("#password").val());
  });

  $("#registration").submit(function(event) {

    /* stop form from submitting normally */
    event.preventDefault();
      /** using back end
      // get the action attribute from the <form action=""> element 
      var $form = $( this ),
        url = $form.attr( 'action' );
      var posting = $.post( url, { name: $('#name').val(), email: $('#email').val(), department: $('#department').val()} );

      //posting.done(function( data ) {
       // $("#result").text(data);

      //});$('#password').val()
      **/
  //create user 
  firebase.auth().createUserWithEmailAndPassword($('#email').val(), $('#password').val())
  .then(function(user){
    var currentUser = firebase.auth().currentUser;
    if(currentUser) {
       saveUserID(currentUser.uid);
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
    "uid" : localStorage.getItem("uid"),
    "email" : $('#email').val(),
    "phone" :$('#phone').val()
  };
  //console.log(localStorage.uid);
  userRef.push(newuser).then(function(user) {
    window.location.href = '/'
  }). catch(function(error) {
    $("#result").text = "Error occures, please try again";
    //console.error('Sign Out Error', error);
    
  });
    });
});
  
