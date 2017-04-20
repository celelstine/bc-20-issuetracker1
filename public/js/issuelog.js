$(document).ready(function(){ 

 	let uid= localStorage.getItem("uid"),
 			Issueref = firebase.database().ref('ist/issue'),
 			curissue ;
 			Issueref.orderByChild('raisedby').equalTo(uid).on("value", function(snapshot) {
        //console.log(snapshot.val());
        snapshot.forEach(function(data) {
        	curissue = data.val();
        	displayIssue(curissue.raisedby,curissue.subject,curissue.dateraised,curissue.description,
        							curissue.department,curissue.status,curissue.lastupdate);
        	let test = curissue.raisedby + '-' +curissue.subject+ '-' +curissue.dateraise+ '-' +curissue.description
        							+ '-' +curissue.department+ '-' +curissue.status+ '-' +curissue.lastupdate;
        	//console.log(data.val());
        });
      });

 });

var displayIssue = function(raisedBy,subject,dateraise,description,department,status,lastupdatedDate) {
		getUsername(raisedBy,function(username) {
		let content = document.getElementById("content")
		//create and append issue 
		let curissue = document.createElement('div');
		curissue.className = "issue";
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
		let statusValue = document.createTextNode(status);
		issuestatus.appendChild(statusValue);
		issuefooter.appendChild(issuestatus);

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
       // console.log(user);
        cb(user);
      });
    });
}
