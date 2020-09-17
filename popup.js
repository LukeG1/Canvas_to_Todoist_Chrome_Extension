let changeColor = document.getElementById('changeColor');
changeColor.onclick = function() {

    console.log('Running!');
    var email = document.getElementById('email').value;
    if(email.length > 0){
        chrome.storage.local.set({"email": email});
    }
    var password = document.getElementById('password').value;
    if(password.length > 0){
        chrome.storage.local.set({"password": password});
    }
    var api_key = document.getElementById('canurl').value;
    if(api_key.length > 0){
        chrome.storage.local.set({"api_key": api_key});
    }
    var api_url = document.getElementById('canapi').value;
    if(api_url.length > 0){
        chrome.storage.local.set({"api_url": api_url});
    }
    fileData = [];
    chrome.storage.local.get("mykey", function(fetchedData) {
        fileData = fetchedData.mykey
        if (fileData === undefined){
            fileData = []
        }          
        chrome.storage.local.get("email", function(fetchedData1) {
            chrome.storage.local.get("password", function(fetchedData2) {
                chrome.storage.local.get("api_url", function(fetchedData3) {
                    chrome.storage.local.get("api_key", function(fetchedData4) {
                        email = fetchedData1.email;
                        password = fetchedData2.password;
                        api_url = fetchedData3.api_url;
                        api_key = fetchedData4.api_key;
                        // console.log(email)
                        // console.log(password)
                        // console.log(api_url)
                        // console.log(api_key)
                        var url = 'https://lukegabel.pythonanywhere.com';
                        var payload = {
                            "todoist_email":email, 
                            "todoist_password":password, 
                            "canvas_url":api_url, 
                            "canvas_api_key":api_key,
                            "data":JSON.stringify(fileData)
                            };
                        //console.log(payload);
                        var output = []
                        $.post(url, data=JSON.stringify(payload), function(data, status){
                            //console.log(JSON.parse(data));
                            chrome.storage.local.set({"mykey": JSON.parse(data)});
                            fileData = data;
                            console.log(fileData)
                            chrome.storage.local.set({"mykey": JSON.parse(data)});
                        });
                    });
                });
            });
        });  
    });
    chrome.storage.local.get("mykey", function(fetchedData) {
        console.log(fetchedData.mykey)
    });
};

let cBox = document.getElementById('data_vis');
cBox.onclick = function() {
    chrome.storage.local.set({"cBox": document.getElementById('data_vis').checked});
    if(document.getElementById('data_vis').checked){
        document.getElementById('emergency').hidden = false;
        document.getElementById('email').hidden = false;
        document.getElementById('password').hidden = false;
        document.getElementById('canurl').hidden = false;
        document.getElementById('canapi').hidden = false;
    }else{
        document.getElementById('emergency').hidden = true;
        document.getElementById('email').hidden = true;
        document.getElementById('password').hidden = true;
        document.getElementById('canurl').hidden = true;
        document.getElementById('canapi').hidden = true;
    }
};

let emergency = document.getElementById('emergency');
emergency.onclick = function() {
    chrome.storage.local.set({"mykey": []});
};