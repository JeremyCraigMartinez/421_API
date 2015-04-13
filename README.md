###This is the API for the Senior Design Wearable Sensors Project

> IP Address: 104.236.169.12  
> Port: 5024

This server is SSL encrypted. Therefore, it is acceptable through HTTPS ONLY!!!!! 

Test it in your browser right now. Access our API [here](https://104.236.169.12:5024). 

For now, there is nothing guarding the information attainble through the API calls. However, when in development later on, There will be an API key and a proxy server. This proxy server will check that the GET/POST request contains the API key. It will ONLY accept POST request data through a JSON request. 

It will ```urlencode``` each request to avoid any injection attack. It will then look for the API key. If the user is authenticated, the proxy will route the clients request to API server. The API server will only accept request from the IP address that the proxy server is on. This is clearly for security.

###API GET Calls include:

|      | PATH       | RES               |
|------|------------|-------------------|
| GET  | /          | JSON - ERROR      |
| GET  | /user      | JSON - users list |
| GET  | /user/:id  | JSON - user info  |


###API POST Calls include:

> /user/create  

    {
    	email:"email@example.com",
    	pass:"$ExamPLePasSworD$"
    }
> /user/:email/info  

    {
    	group: "WSU",
    	first_name: "jeremy",
    	last_name: "martinez",
    	age: "22",
    	height: "72", //inches
    	weight: "180", //pounds
    	sex: "male"
    }