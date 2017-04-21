$(document).ready(function(){ 
 	let uid= $('#uid').val(),
 			Issueref = firebase.database().ref('ist/issue'),
 			curissue,
 			issuecount=0 ;
 	Issueref.orderByChild('raisedby').equalTo(uid).on("value", function(snapshot) {
    snapshot.forEach(function(data) {
     	curissue = data.val();
     	//console.log(curissue);
     displayIssue(data.key,curissue.priority,curissue.raisedby,curissue.subject,curissue.dateraised,curissue.description,
    							curissue.department,curissue.status,curissue.lastupdate);
     //	let test = curissue.raisedby + '-' +curissue.subject+ '-' +curissue.dateraise+ '-' +curissue.description
     	//						+ '-' +curissue.department+ '-' +curissue.status+ '-' +curissue.lastupdate;
     	//console.log(data.val());
     	issuecount += 1;
     });
  });

 });
 if (issuecount === 0) {
 	showresult("There is ticket on your log");
 }

var displayIssue = function(key,priority,raisedBy,subject,dateraise,description,department,status,lastupdatedDate) {
		getUsername(raisedBy,function(username) {
			let issuetag = '<tr id ="' +key + '" class="';
			if (priority == 'Critical') {
				issuetag += 'danger"';
			}else if (priority == 'High') {
				issuetag += 'warning"';
			}else if (priority == 'Medium') {
				issuetag += 'info"';
			}else if (priority == 'Low') {
				issuetag += 'active"';
			}
			issuetag += '>' +
	        '<td>' + username + '</td>' +
	        '<td>' + department + '</td>' +
	        '<td>' + subject + '</td>' +
	        '<td>' + priority + '</td>' +
	        '<td>' + todate(dateraise) + '</td>' +
	        '<td>' + status + '</td>' +
	        '<td>' + todate(lastupdatedDate) + '</td>' +
	        '<td> <button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#description" onclick=\'viewdescription("'+description+ '")\'>View Description</button> </td>' +
	        '</tr>';
	    $('#issues tr:last').after(issuetag);
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

var viewdescription = function(description) {
	$('#descvalue').text=description;
	 document.getElementById("descvalue").innerHTML = description;
}
