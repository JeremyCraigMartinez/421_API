###This is the API for the Senior Design Wearable Sensors Project

> IP Address: 104.236.169.12  
> Port: 5025

This server is SSL encrypted. Therefore, it is acceptable through HTTPS ONLY!!!!! 

Test it in your browser right now. Access our API [here](https://104.236.169.12:5025). 

For now, there is nothing guarding the information attainble through the API calls. However, when in development later on, There will be an API key and a proxy server. This proxy server will check that the GET/POST request contains the API key. It will ONLY accept POST request data through a JSON request. 

It will ```urlencode``` each request to avoid any injection attack. It will then look for the API key. If the user is authenticated, the proxy will route the clients request to API server. The API server will only accept request from the IP address that the proxy server is on. This is clearly for security.

###API GET Calls include:


|      | PATH              | RES                  |
|------|-------------------|----------------------|
| GET  | /                 | JSON - ERROR         |
| GET  | /patients         | JSON - patient info  |
| GET  | /list_of_patients | JSON - patients list |
| GET  | /patients/:id     | JSON - patient info  |
| GET  | /groups/          | ARRAY - groups       |
=======
|      | PATH          | RES                  |
|------|---------------|----------------------|
| GET  | /             | JSON - ERROR         |
| GET  | /patients     | JSON - patients list |
| GET  | /patients/:id | JSON - patient info  |
| GET  | /groups/      | ARRAY - groups       |
| GET  | /doctors/     | ARRAY - doctors      |
| GET  | /doctors/:id  | JSON - doctor info   |
>>>>>>> d27c76fafaff48bd1cd199d485026ced0687b1f8


###API POST Calls include:

> /patients 

    {
    	email:"email@example.com",
    	pass:"$ExamPLePasSworD$",
        group: ["WSU"],
        first_name: "jeremy",
        last_name: "martinez",
        age: "22",
        height: "72", //inches
        weight: "180", //pounds
        sex: "male"        
    }

> /groups 

    {
        _id: "cancer"
    }

> /doctors

    {
    	email	   : "example@test.com",
    	first_name : "example",
    	last_name  : "test",
    	specialty  : "specs",
    	hospital   : "hosp",
    	pass	   : "pass" 
    }

###API PUT Calls include:

> /patients/update_info - for everything BUT email and password

    #same as post for patient
    
> /patients/update_account - for email and password

    {
        email: "new@email.com",
        pass: "newpass"
    }
    
> /doctors/update_info - for everything BUT email and password

    #same as post for doctor
    
> /doctors/update_account - for email and password

    {
        email: "new@email.com",
        pass: "newpass"
    }
    
###API DELETE Calls include
All of these DELETE do not need data sent. Patients and Doctors removal deletes the user that authenticates to the api call

> /groups/remove/:groupid

> /patients/remove

> /doctors/remove
