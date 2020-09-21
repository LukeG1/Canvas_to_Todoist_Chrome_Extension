chrome.storage.local.get(["auto_on","auto_interval"], function(fetchedData) {
    if(fetchedData.auto_on){
        setInterval(your_function, document.getElementById('time_interval').value * 60 * 60 * 1000)
    }else{
        setInterval(your_function, 1000000000 * 10000000000 * 60 * 60 * 1000)
    }
});

function myFunction(p1, p2) {
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
                    //document.getElementById("output_data").innerHTML="No New Tasks";
                }else if(JSON.parse(data)==1){
                    //document.getElementById("output_data").innerHTML="Check your Canvas credientials";
                }else if(JSON.parse(data)==2){
                    //document.getElementById("output_data").innerHTML="Check your Todoist credientials";
                }else if(JSON.parse(data)==3){
                    //document.getElementById("output_data").innerHTML="Ensure That you have incuded credientials to send";
                }else{
                    chrome.storage.local.set({"mykey": JSON.parse(data)[1]});
                    fileData = data;
                    //console.log(fileData)
                    chrome.storage.local.set({"temp": JSON.parse(data)[1]});
                    //document.getElementById("output_data").innerHTML="Tasks Succesfullly updated, Added " + JSON.parse(data)[0] + " tasks!";
                }
            });
        });  
    });
    chrome.storage.local.get("temp", function(fetchedData) {
        chrome.storage.local.set({"mykey": fetchedData.temp});
    });

};
