$(document).ready(function(){ 
 	let uid= localStorage.getItem("uid"),
 			Issueref = firebase.database().ref('ist/issue'),
 			curissue ;
 			Issueref.orderByChild('assignto').equalTo(uid).on("value", function(snapshot) {
        //console.log(snapshot.val());
        snapshot.forEach(function(data) {
        	curissue = data.val();
        	if (curissue.status != 'Closed') {
        		displayIssue(data.key,curissue.raisedby,curissue.subject,curissue.dateraised,curissue.description,
        							curissue.department,curissue.status,curissue.lastupdate);
	        	let test = curissue.raisedby + '-' +curissue.subject+ '-' +curissue.dateraise+ '-' +curissue.description
	        							+ '-' +curissue.department+ '-' +curissue.status+ '-' +curissue.lastupdate;
	        	//console.log(data.val());
        	}
        	
      	});
   		});

  $(".fixed").click(function() {
  		alert('test');
  	/**
  	let issuerid= this.id,
  			Issueref = firebase.database().ref('ist/issue').child(issueref);
  
  	
  	Issueref.once('value', function(snapshot) {
	    if( snapshot.val() != null ) {
        snapshot.ref().update({"fixernote": "Fixed"});
	    }
		});
  **/
  });

 });

var displayIssue = function(key,raisedBy,subject,dateraise,description,department,status,lastupdatedDate) {
		getUsername(raisedBy,function(username) {
		let content = document.getElementById("content")
		//create and append issue 
		let curissue = document.createElement('div');
		curissue.className = "issue";
		curissue.id = "issue" + key;
		content.appendChild(curissue);

		//create and append issueheader
		let issueheader = document.createElement('div');
		issueheader.className = "issueheader";
		curissue.appendChild(issueheader);

		// create and append issue owner
		let userName = document.createElement('p');
		userName.className ='raisedBy';
		let usernameValue = document.createTextNode(username);
		userName.appendChild(usernameValue);
		issueheader.appendChild(userName);

		// create and append issue subject
		let issuesubject = document.createElement('p');
		issuesubject.className ='subject';
		let subjectValue = document.createTextNode(subject);
		issuesubject.appendChild(subjectValue);
		issueheader.appendChild(issuesubject);

		// create and append issue subject
		let issuedateraise = document.createElement('p');
		issuedateraise.className ='raisedDate';
		let dateraiseValue = document.createTextNode(todate(dateraise));
		issuedateraise.appendChild(dateraiseValue);
		issueheader.appendChild(issuedateraise);

		// create and append issue description
		let issuedescription = document.createElement('p');
		issuedescription.className ='description';
		let descriptionValue = document.createTextNode(description);
		issuedescription.appendChild(descriptionValue);
		curissue.appendChild(issuedescription);

		//create and append issueheader
		let issuefooter = document.createElement('div');
		issuefooter.className = "issuefooter";
		curissue.appendChild(issuefooter);

		// create and append issue owner
		let issuedepartment = document.createElement('p');
		issuedepartment.className ='raisedBy';
		let departmentValue = document.createTextNode(department);
		issuedepartment.appendChild(departmentValue);
		issuefooter.appendChild(issuedepartment);

		// create and append issue subject
		let issuestatus = document.createElement('p');
		issuestatus.className ='subject';
		issuestatus.id = key;
		let statusValue = document.createTextNode(status);
		issuestatus.appendChild(statusValue);
		issuefooter.appendChild(issuestatus);

		//create and append fixed button
		let btnfixed = document.createElement("BUTTON");
		btnfixed.className = 'fixed';
		btnfixed.id = 'fixed' + key;
		let btnfixedText = document.createTextNode("Fixed");
		btnfixed.appendChild(btnfixedText);
		btnfixed.type = "button";
		btnfixed.onclick = function(){fixed(key.toString());};
		issuestatus.appendChild(btnfixed);
		//create and append comment
		let btncomment = document.createElement("BUTTON");
		btncomment.className = 'fixed';
		btncomment.id = 'comment' + key;
		let btncommentText = document.createTextNode("Comment");
		btncomment.appendChild(btncommentText);
		btncomment.type = "button";
		issuestatus.appendChild(btncomment);

		// create and append issue subject
		let issuelastupdatedDate = document.createElement('p');
		issuelastupdatedDate.className ='raisedDate';
		let lastupdatedDateValue = document.createTextNode(todate(lastupdatedDate));
		issuelastupdatedDate.appendChild(lastupdatedDateValue);
		issuefooter.appendChild(issuelastupdatedDate);
		});
		
}

var getUsername = function(uid,cb) {
	let Userref = firebase.database().ref('ist/user'),
			user;
   Userref.orderByChild('uid').equalTo(uid).on("value", function(snapshot) {
      snapshot.forEach(function(data) {
      	user = data.val().name;
        console.log(user);
        cb(user);
      });
    });
}

var fixed = function(fixedid) {
	/**
	let btnid= uid,
			key = str.substring(str.indexOf("d")+1,str.lenght),
	**/
	let Issueref = firebase.database().ref('ist/issue').child(fixedid);
  Issueref.once('value', function(snapshot) {
		if( snapshot.val() != null ) {
			console.log(snapshot.val());
      snapshot.ref.update({"fixernote": "Fixed","lastupdate" : gettimestamp(),"status": "Fixed but not approved"});
	  }
	});
}

var comment = function(fixedid) {
	/**
	let btnid= uid,
			key = str.substring(str.indexOf("d")+1,str.lenght),
	**/
	alert(fixedid);
	let Issueref = firebase.database().ref('ist/issue').child(fixedid);
  Issueref.once('value', function(snapshot) {
		if( snapshot.val() != null ) {
			console.log(snapshot.val());
      snapshot.ref.update({"fixernote": "Fixed","lastupdate" : gettimestamp(),"status": "Fixed but not approved"});
	  }
	});
}
 