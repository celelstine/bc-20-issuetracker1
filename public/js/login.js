function saveUserID(uid) {
   localStorage.setItem("uid",uid);
  let Userref = firebase.database().ref('ist/user');
    Userref.orderByChild('uid').equalTo(uid).on("value", function(snapshot) {
      console.log(snapshot.val());
      snapshot.forEach(function(data) {
        localStorage.setItem("username",data.val().name);
        console.log(data.val());
        if (data.val().role) {
         localStorage.setItem("department",data.val().departments);
         window.location.href = '/openissue';
        } else {
          window.location.href = '/issuelog';
        }
      });
    });

}
$(document).ready(function(){

  $("#signup").click(function() {
      window.location.href = '/signup';
  });

	$("#googlesignin").click(function() {
	var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth()
   .signInWithPopup(provider).then(function(result) {
      var token = result.credential.accessToken;
      var user = result.user.uid;
      //console.log(token)
      console.log(user);
      saveUserID(user);
      $.post("/setsession",
      {
        uid: user,
      },
      function(data, status){
          alert("Data: " + data + "\nStatus: " + status);
      });
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
     // res.redirect('/signup');
      console.log(error.code)
       console.log(error.message)
    }); 
	});

  $("#facebooksignin").click(function() {
    
    var provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth()
     .signInWithPopup(provider).then(function(result) {
        var token = result.credential.accessToken;
        var user = result.user.uid;
        saveUserID(user);
      $.post("/setsession",
      {
        uid: user,
      },
      function(data, status){
          alert("Data: " + data + "\nStatus: " + status);
      });        
        //console.log(token)
        console.log(user)

      }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
       // res.redirect('/signup');
        console.log(error.code)
         console.log(error.message)
      }); 
  });

  $("#twittersigin").click(function() {
    
    var provider = new firebase.auth.TwitterAuthProvider();
    firebase.auth()
     .signInWithPopup(provider).then(function(result) {
        var token = result.credential.accessToken;
        var secret = result.credential.secret;
        // The signed-in user info.
        var user = result.user.uid; 
        saveUserID(user);
        $.post("/setsession",
        {
          uid: user,
        },
        function(data, status){
            alert("Data: " + data + "\nStatus: " + status);
        });       
        //console.log(token)
        console.log(user)

      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
       // res.redirect('/signup');
          console.log(error.code)
         console.log(error.message)
      }); 
  });

  $("#gitsignin").click(function() {
    
    var provider = new firebase.auth.GithubAuthProvider();
    firebase.auth()
     .signInWithPopup(provider).then(function(result) {
        var token = result.credential.accessToken;
        var secret = result.credential.secret;
        // The signed-in user info.
        var user = result.user.uid; 
        saveUserID(user);
        $.post("/setsession",
        {
          uid: user,
        },
        function(data, status){
            alert("Data: " + data + "\nStatus: " + status);
        });       
        //console.log(token)
        console.log(user)

      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
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
      let user1 = firebase.auth().currentUser;
      if (user1) {
        saveUserID(user1.uid);
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