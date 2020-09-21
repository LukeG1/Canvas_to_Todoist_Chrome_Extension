chrome.storage.local.get(["auto_on","auto_interval"], function(fetchedData) {
    document.getElementById('auto_sync').checked = fetchedData.auto_on;
    document.getElementById('time_selected').hidden=false;
    document.getElementById('time_interval').hidden=false;
    document.getElementById('t_label').hidden=false;
    if(fetchedData.auto_on){
        if(fetchedData.auto_interval === undefined){
            document.getElementById('time_interval').value = 6
            document.getElementById('time_selected').innerHTML=6 + " Hours";
        }else{
            document.getElementById('time_interval').value = fetchedData.auto_interval
            document.getElementById('time_selected').innerHTML=fetchedData.auto_interval + " Hours";
        }
    }else{
        document.getElementById('time_selected').hidden=true;
        document.getElementById('time_interval').hidden=true;
        document.getElementById('t_label').hidden=true;
    }
});

let submit = document.getElementById('submit');
submit.onclick = function() {

    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var api_url = document.getElementById('canurl').value;
    var api_key = document.getElementById('canapi').value;

    if(email.length > 0){
        chrome.storage.local.set({"email": email});
    }
    if(password.length > 0){
        chrome.storage.local.set({"password": password});
    }
    if(api_key.length > 0){
        chrome.storage.local.set({"api_key": api_key});
    }
    if(api_url.length > 0){
        chrome.storage.local.set({"api_url": api_url});
    }

    document.getElementById('data_vis').checked = false;
    document.getElementById('showhide').hidden = true;
    document.getElementById('changeColor').hidden = false;
};


let changeColor = document.getElementById('changeColor');
changeColor.onclick = function() {

    document.getElementById('details').hidden = true;
    document.getElementById('data_vis').hidden = true;
    document.getElementById('changeColor').hidden = true;
    document.getElementById('loading').hidden = false;

    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var api_url = document.getElementById('canurl').value;
    var api_key = document.getElementById('canapi').value;

    if(email.length > 0){
        chrome.storage.local.set({"email": email});
    }
    if(password.length > 0){
        chrome.storage.local.set({"password": password});
    }
    if(api_key.length > 0){
        chrome.storage.local.set({"api_key": api_key});
    }
    if(api_url.length > 0){
        chrome.storage.local.set({"api_url": api_url});
    }


    fileData = [];
    chrome.storage.local.get("mykey", function(fetchedData) {
        fileData = fetchedData.mykey
        if (fileData === undefined){
            fileData = []
        }else{
            console.log(fileData)
            console.log("Got Data")
        }          
        chrome.storage.local.get(["email","password","api_url","api_key"], function(fetchedData) {
            var today = new Date();
            var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+' '+today.getHours()+':'+today.getMinutes()+':'+today.getSeconds();
            var url = 'https://lukegabel.pythonanywhere.com';
            var payload = {
                "todoist_email":fetchedData.email, 
                "todoist_password":fetchedData.password, 
                "canvas_url":fetchedData.api_url, 
                "canvas_api_key":fetchedData.api_key,
                "system_time":date,
                "data":JSON.stringify(fileData)
                };
            var output = []
            $.post(url, data=JSON.stringify(payload), function(data, status){
                //console.log(JSON.parse(data));
                document.getElementById('loading').hidden = true;
                document.getElementById('output').hidden = false;
                if(JSON.parse(data)==0){ 
                    document.getElementById("output_data").innerHTML="No New Tasks";
                    //document.write("No New Tasks");
                }else if(JSON.parse(data)==1){
                    document.getElementById("output_data").innerHTML="Check your Canvas credientials";
                   // document.write("Check your Canvas credientials");
                }else if(JSON.parse(data)==2){
                    document.getElementById("output_data").innerHTML="Check your Todoist credientials";
                    //document.write("Check your Todoist credientials");
                }else if(JSON.parse(data)==3){
                    document.getElementById("output_data").innerHTML="Ensure That you have incuded credientials to send";
                    //document.write("Ensure That you have incuded credientials to send");
                }else{
                    chrome.storage.local.set({"mykey": JSON.parse(data)[1]});
                    fileData = data;
                    console.log(fileData)
                    chrome.storage.local.set({"temp": JSON.parse(data)[1]});
                    document.getElementById("output_data").innerHTML="Tasks Succesfullly updated, Added " + JSON.parse(data)[0] + " tasks!";
                    //document.write("Tasks Succesfullly updated, Added " + JSON.parse(data)[0] + " tasks!");
                }
            });
        });  
    });
    chrome.storage.local.get("temp", function(fetchedData) {
        chrome.storage.local.set({"mykey": fetchedData.temp});
    });

};

let cBox = document.getElementById('data_vis');
cBox.onclick = function() {
    chrome.storage.local.set({"cBox": document.getElementById('data_vis').checked});
    if(document.getElementById('data_vis').checked){
        document.getElementById('showhide').hidden = false;
        document.getElementById('changeColor').hidden = true;
    }else{
        document.getElementById('showhide').hidden = true;
        document.getElementById('changeColor').hidden = false;
    }
};

let emergency = document.getElementById('emergency');
emergency.onclick = function() {
    chrome.storage.local.set({"mykey": []});


    chrome.storage.local.get("mykey", function(fetchedData) {
        console.log(fetchedData.mykey)
    });

};


let auto = document.getElementById('auto_sync');
auto.onclick = function() {
    if(document.getElementById('auto_sync').checked==true){
        document.getElementById('time_selected').hidden=false;
        document.getElementById('time_interval').hidden=false;
        document.getElementById('t_label').hidden=false;
        chrome.storage.local.set({"auto_on": true});
    }else{
        document.getElementById('time_selected').hidden=true;
        document.getElementById('time_interval').hidden=true;
        document.getElementById('t_label').hidden=true;
        chrome.storage.local.set({"auto_on": false});
    }
};

let interval = document.getElementById('time_interval');
interval.onchange = function() {
    document.getElementById('time_selected').innerHTML=document.getElementById('time_interval').value + " Hours";
    chrome.storage.local.set({"auto_interval": document.getElementById('time_interval').value});
};
