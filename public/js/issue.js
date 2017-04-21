//var utility = require('lib/utility.js');
$(document).ready(function(){ 
  $("#notifymeans").change(function () {
     let valueSelected  = $("#notifymeans").val(),
         Userref = firebase.database().ref('ist/user'),
         usercontact,
         uid=$('input#uid').val();
      console.log(valueSelected);
      Userref.orderByChild('uid').equalTo(uid).on("value", function(snapshot) {
        //console.log(snapshot.val());
        snapshot.forEach(function(data) {
          if (valueSelected === "phone") {
            usercontact = data.val().phone;
          } else if (valueSelected === "email") {
            usercontact = data.val().email;
          }
        });
      $("#notifyvalue").val(usercontact);
      });
  });

  $("#issue").submit(function(event) {
    /* stop form from submitting normally */
    event.preventDefault();
    let Issueref = firebase.database().ref('ist/issue'),
       newissue = {
        "assigneeID" : "",
        "assigneeName" : "",
        "raisedby" : $('#uid').val(),
        "dateraised" : gettimestamp(),
        "status" : "Initiated",
        "description" :$('#description').val() ,
        "department" : $('#department').val(),
        "subject" : $('#subject').val(),
        "comment" : {
        },
        "lastupdate" : gettimestamp(),
        "timeclose" : "",
        "sendernotificationmeans"  : $("#notifymeans").val(),
        "notificationvalue" : $("#notifyvalue").val(),
        "isnotified" : false,
        "fixernote" : "",
        "priority" : $("#priority").val()
      };
  console.log(newissue);
  Issueref.push(newissue).then(function(issue) {
    window.location.href ='/myreport';
  }). catch(function(error) {
    //console.error('Sign Out Error', error);
    showresult("Error occures, please try again");
  });
  });
});
  
