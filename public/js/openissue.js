$(document).ready(function(){ 
 	let uid= localStorage.getItem("uid"),
 			department =localStorage.getItem('department'),
 			Issueref = firebase.database().ref('ist/issue'),
 			curissue ;
 			console.log(department);
 	
 Issueref.orderByChild('department').equalTo(department).on("value", function(snapshot) {
  //console.log(snapshot.val());
	  snapshot.forEach(function(data) {
	   	curissue = data.val();
	  	if (curissue.status != 'Closed') {
	  		displayIssue(data.key,curissue.priority,curissue.raisedby,curissue.subject,curissue.dateraised,curissue.description,
	        					curissue.department,curissue.status,curissue.lastupdate,curissue.assignto,curissue.assigneeName);
	       let test = curissue.raisedby + '-' +curissue.subject+ '-' +curissue.dateraise+ '-' +curissue.description
	        							+ '-' +curissue.department+ '-' +curissue.status+ '-' +curissue.assigneeto;
	       console.log(data.val());
	  	}  	
	  });
	});

 	// load assignee select
 	let userRef = firebase.database().ref('ist/user'),
 			curuser;
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

 	//process assign form
 	$("#setAssign").submit(function(event) {
    /* stop form from submitting normally */
    event.preventDefault();
    	//collect the issue id
		let issueid = localStorage.getItem('issueid');
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
		// change button to label
	  $('#btn'+ issueid).hide();
	  $('#lbl'+ issueid).text(assigneeName)
	  $('#lbl'+ issueid).show();

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
	        '<td> <button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#closeissue" onclick=\'closeissue("'+key+ '")\'>close issue</button> </td>' +
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
		/** former code 

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
		let dateraiseValue = document.createTextNode(dateraise);
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
		let lastupdatedDateValue = document.createTextNode(lastupdatedDate);
		issuelastupdatedDate.appendChild(lastupdatedDateValue);
		issuefooter.appendChild(issuelastupdatedDate);
		});
		**/		
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
	localStorage.setItem("issueid",issueid);

	//window.location.href = '/manageissue';	
}

var viewdescription = function(description) {
	//localStorage.issueid =issueid;
	$('#descvalue').text=description;
	 document.getElementById("descvalue").innerHTML = description;id
	//window.location.href = '/manageissue';	
}

var closeissue = function(issueid) {
	alert('close' + issueid);
	localStorage.setItem("issueid",issueid);
	//window.location.href = '/manageissue';	
}