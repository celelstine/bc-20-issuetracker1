//var utility = require('lib/utility.js');
$(document).ready(function(){ 

  
  $("#setAssign").submit(function(event) {
    /* stop form from submitting normally */
    event.preventDefault();
      //collect the issue id
    let uid = $('#uid').val();
    // set assignto in db
    let Useref = firebase.database().ref('ist/user').child(uid),
        name = $('#name').val(),
        email = $('#email').val(),
        phone = $('#phone').val();
        department = $('#department option:selected').html();
    Useref.once('value', function(snapshot) {
      if( snapshot.val() != null ) {
        console.log(snapshot.val());
        snapshot.ref.update({"name": name,"phone" :phone,"email" : email,"departments": department});
       // $('#result').text ="Your Profile has been updated";
        showresult("Your Profile has been updated");
      }
    });
  });

});
  
