$(document).ready(function(){ 
 	let uid= $('#uid').val(),
 			Issueref = firebase.database().ref('ist/issue'),
 			curissue,
 			issuecount =0 ;
 	Issueref.orderByChild('assignto').equalTo(uid).on("value", function(snapshot) {
    snapshot.forEach(function(data) {
     	curissue = data.val();
     	console.log(curissue);
     	if (curissue.status != 'Closed') {
     		displayIssue(data.key,curissue.priority,curissue.raisedby,curissue.subject,curissue.dateraised,curissue.description,
    							curissue.department,curissue.status,curissue.lastupdate);
     		issuecount += 1;
     	}
    });
  });

 });
if (issuecount === 0) {
	showresult("There is ticket on your todo list");
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
	        '<td> <button type="button" style="font-size:12px" data-toggle="modal" data-target="#description" onclick=\'viewdescription("'+description+ '"")\'>View Description</button> ' +
	        '<button type="button" style="font-size:12px;margin:2px"   id="todolist" onclick=\'fixed("'+key+ '")\'>fixed </button>'+
	        '<button type="button" style="font-size:12px;margin:2px"   id="todolist1" onclick=\'comment("'+key+ '")\'>comment </button>'
	        '</td></tr>';
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
	 document.getElementById("descvalue").innerHTML = description;
}
var fixed = function(key) {
	let Issueref = firebase.database().ref('ist/issue').child(key);
  Issueref.once('value', function(snapshot) {
		if( snapshot.val() != null ) {
			console.log(snapshot.val());
      snapshot.ref.update({"fixernote": "Fixed","lastupdate" : gettimestamp(),"status": "Fixed but not approved"});
       location.reload();
       showresult("Your submission has been recorded");
	  }
	});

}
var comment = function(key) {

	 document.getElementById("descvalue").innerHTML = description;
}

