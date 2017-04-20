$(document).ready(function(){

  $("#signup").click(function() {
      window.location.href = '/signup';
  });

  $("#googlesignin").click(function() {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth()
   .signInWithPopup(provider)
   .then(function(result) {
      var token = result.credential.accessToken;
      var curuser = result.user;
      //console.log(result.user);
      console.log(curuser.displayName + '-' + curuser.email + '- ' + curuser.photoURL + '' +curuser.uid );
      //check if user exist in db
      let Userref = firebase.database().ref('ist/user');
      Userref.orderByChild("uid").equalTo(curuser.uid).once("value", function(snapshot) {
        var userData = snapshot.val();
        if (userData){
          snapshot.forEach(function(data) {
            console.log(data.val());
            if (data.val().role) {
             window.location.href = '/openissue';
            } else {
              window.location.href = '/issuelog';
            }
          });
          //set session 
          $.post("/setsession",{uid: curuser.uid},function(data, status){ console.log(status); });
        } else {
          // create new user
          var  newuser = {
            "name" : curuser.displayName,
            "departments" : "",
            "uid" : curuser.uid ,
            "email" : curuser.email,
            "phone" :"",
            "pic" : curuser.photoURL
          };
          //console.log(localStorage.uid);
          userRef.push(newuser).then(function(user) {
            //set session 
            $.post("/setsession",{uid: curuser.uid},function(data, status){ console.log(status); });
            // direct user to profile
            window.location.href = '/profile'
          }). catch(function(error) {
            $("#result").text = "Error occures, please try again";
            //console.error('Sign Out Error', error);
            
          });
        }
      });
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
     // res.redirect('/signup');
      console.log(error.code)
       console.log(error.message)
    }); 
  });
  
  $("#signin").submit(function(event) {
    /* stop form from submitting normally */
    event.preventDefault();
    firebase.auth().signInWithEmailAndPassword($('#email').val(), $('#password').val())
    .then(function(user) {
      let curuser = firebase.auth().currentUser;
      if (curuser) {
        saveUserID(user1.uid);
        /////////////////
        let Userref = firebase.database().ref('ist/user');
        Userref.orderByChild("uid").equalTo(curuser.uid).once("value", function(snapshot) {
          var userData = snapshot.val();
          if (userData){
            snapshot.forEach(function(data) {
              console.log(data.val());
              if (data.val().role) {
               window.location.href = '/openissue';
              } else {
                window.location.href = '/issuelog';
              }
            });
            //set session 
        $.post("/setsession",{uid: curuser.uid},function(data, status){ console.log(status); });


        ////////////
      } else {
        $("#result").text = "Wrong email or password";
      }
       
    })
    .catch(function(error) {
    // Handle Errors here.
      errorCode = error.code;
      errorMessage = error.message;
      console.log('errorCode = ' + errorCode + ', errorMessage= ' + errorMessage);
      $("#result").text = "Wrong email or password";
    });
  });

});