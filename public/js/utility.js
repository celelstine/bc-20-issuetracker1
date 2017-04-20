 
function gettimestamp() {
    // for IE
    if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
    }
    return Date.now();
}

function todate(timestamp1) {
    let newdate = new Date(timestamp1);
    newdate.setHours(newdate.getHours()+1);
    let dateString =newdate.toUTCString();
    return dateString.slice(0,dateString.indexOf('G'))
}
function scorePassword(pass) {
    var score = 0;
    if (!pass)
        return score;

    // award every unique letter until 3 repetitions
    var letters = {};
    for (var i=0; i<pass.length; i++) {
        letters[pass[i]] = (letters[pass[i]] || 0) + 1;
        score += 3.0 / letters[pass[i]];
        console.log(score);
    }

    // bonus points for mixing it up
    var variations = {
        digits: /\d/.test(pass),
        lower: /[a-z]/.test(pass),
        upper: /[A-Z]/.test(pass),
        nonWords: /\W/.test(pass),
    };

    variationCount = 0;
    for (var check in variations) {
        variationCount += (variations[check] === true) ? 1 : 0;
    }
    score += (variationCount - 1) * 10;
    
    return parseInt(score);
    
}