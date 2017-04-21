$(document).ready(function(){ 
 	let uid= $('input#uid').val(),
 			Issueref = firebase.database().ref('ist/issue'),
 			curissue,
 			issuecount=0 ;
 	// using callback
		getdept(uid,function(department) {
			Issueref.orderByChild('department').equalTo(department).on("value", function(snapshot) {
		  //console.log(snapshot.val());
			  snapshot.forEach(function(data) {
			   	curissue = data.val();
			  	if (curissue.status != 'Closed') {
			  		displayIssue(data.key,curissue.priority,curissue.raisedby,curissue.subject,curissue.dateraised,curissue.description,
			        					curissue.department,curissue.status,curissue.lastupdate,curissue.assignto,curissue.assigneeName);
			       //let test = curissue.raisedby + '-' +curissue.subject+ '-' +curissue.dateraise+ '-' +curissue.description
			       // 							+ '-' +curissue.department+ '-' +curissue.status+ '-' +curissue.assigneeto;
			       //console.log(data.val());
			       issuecount += 1;
			  	}  	
			  });
			});
		});
		if(issuecount === 0) {
			showresult("There are no open ticket");
		}
 

 	// load assignee select
 	let userRef = firebase.database().ref('ist/user'),
 			curuser;
 	getdept(uid,function(department) { 
 		userRef.orderByChild('departments').equalTo(department).on("value", function(snapshot) {
		  snapshot.forEach(function(data) {
		   	curuser = data.val(); 	
		   	console.log(curuser);
		   	$('#assignee')
	         .append($("<option></option>")
	                    .attr("value",curuser.uid)
	                    .text(curuser.name)); 
		  });
		});
 	});
 	

 	//process assign form
 	$("#setAssign").submit(function(event) {
    /* stop form from submitting normally */
    event.preventDefault();
    	//collect the issue id 
		let issueid = $('#issueid').val();
    // set assignto in db
    let Issueref = firebase.database().ref('ist/issue').child(issueid),
    		assignee = $('#assignee').val();
    		assigneeName = $('#assignee option:selected').html();
	  Issueref.once('value', function(snapshot) {
			if( snapshot.val() != null ) {
				console.log(snapshot.val());
	      snapshot.ref.update({"assignto": assignee,"assigneeName" :assigneeName,"lastupdate" : gettimestamp(),"status": "Assigned"});
		  }
		});
		/** change button to label
	  $('#btn'+ issueid).hide();
	  $('#lbl'+ issueid).text(assigneeName)
	  $('#lbl'+ issueid).show();
	  **/
	  location.reload();
  });

 	//process comment form
 	$("#addcomment").submit(function(event) {
    /* stop form from submitting normally */
    event.preventDefault();
    	//collect the issue id 
		let key = $('#issueid').val(),
				comment = $('#comment').val();
    let Issueref = firebase.database().ref('ist/issue').child(key);
	  Issueref.once('value', function(snapshot) {
			if( snapshot.val() != null ) {
				console.log(snapshot.val());
	      snapshot.ref.update({"comment": comment});
		  }
		});
		location.reload();
		showresult("Your comment has been recorded");
  });

});

var displayIssue = function(key,priority,raisedBy,subject,dateraise,description,department,status,lastupdatedDate,assignto,assigneeName) {
		//build issue tag
		// using callback
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
	        '<td>' + status + '</td>' +
	        '<td>' + todate(dateraise) + '</td>' +
	        '<td> <button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#assign" ' +
	        'onclick=\'assign("'+key+ '")\' id="btn'+ key+'" >Assign</button> ' +
	        '<label id="lbl'+ key+'" >'+assigneeName+'</label>  </td>' +
	        '<td> <button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#description" onclick=\'viewdescription("'+description+ '")\'>View Description</button> </td>' +
	        '<td> <button type="button" class="btn btn-info btn-lg"  data-toggle="modal" data-target="#commenting" onclick=\'comment("'+key+ '")\'>comment</button> </td>' +
	        '<td> <button type="button" class="btn btn-info btn-lg"  onclick=\'closeissue("'+key+ '")\'>close issue</button> </td>' +
	        '</tr>';
	    // console.log(issuetag);
	     //$('#myTable > tbody:last-child').append(issuetag);
	    $('#issues tr:last').after(issuetag);
	    if(assignto) {
	    		$('#btn'+ key).hide();
	    } else {
	    		$('#lbl'+ key).hide();
	    }
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

var assign = function(issueid) {
	$('input[name="issueid"]').val(issueid);
	//localStorage.setItem("issueid",issueid);

	//window.location.href = '/manageissue';	
}

var viewdescription = function(description) {
	 document.getElementById("descvalue").innerHTML = description;
}

var closeissue = function(key) {
	//update issue	
	let Issueref = firebase.database().ref('ist/issue').child(key);
	  Issueref.once('value', function(snapshot) {
			if( snapshot.val() != null ) {
				console.log(snapshot.val());
	      snapshot.ref.update({"status": "Closed","lastupdate" : gettimestamp(),"timeclose": gettimestamp(),"isnotified":true});
	      $.post("/notify",{issueid: key},function(data, status){ 
	      	console.log(status); 
	      	if(data) {
	      		snapshot.ref.update({"isnotified":true});
	      		location.reload();
	      		showresult("The ticket hes been closed and the user has been notified ");
	      	}
	      });
		  }
		});
}

var comment = function(issueid) {
	$('input[name="issueid"]').val(issueid);	
}
