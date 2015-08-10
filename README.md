###This is the API for the Senior Design Wearable Sensors Project

> IP Address: 104.236.169.12  
> Port: 5025

This server is SSL encrypted. Therefore, it is acceptable through HTTPS ONLY!!!!! 

Test it in your browser right now. Access our API [here](https://104.236.169.12:5025). 

For now, there is nothing guarding the information attainble through the API calls. However, when in development later on, There will be an API key and a proxy server. This proxy server will check that the GET/POST request contains the API key. It will ONLY accept POST request data through a JSON request. 

It will ```urlencode``` each request to avoid any injection attack. It will then look for the API key. If the user is authenticated, the proxy will route the clients request to API server. The API server will only accept request from the IP address that the proxy server is on. This is clearly for security.

##API Calls include:

###Admin API Calls
> These API calls are only accepted from an admin user (admin doctor). An admin must be manually added by the DB admin

|      | PATH                                    | DESC                                        | auth   |
|------|-----------------------------------------|---------------------------------------------|--------|
| GET  | /admin/patients                         | all patients                                | admin  |
| PUT  | /admin/doctors/update_account/:doctor   | update email/pass for doctor                | admin  |
| PUT  | /admin/doctors/update_info/:doctor      | update all other fields for doctor          | admin  |
| PUT  | /admin/patients/update_account/:patient | update email/pass for patient               | admin  |
| PUT  | /admin/patients/update_info/:patient    | update all other fields for patient         | admin  |
| DEL  | /admin/doctors/remove/:doctor           | delete doctor account                       | admin  |
| DEL  | /admin/patients/remove/:patient         | delete patient account                      | admin  |
| DEL  | /admin/diet/remove/:patient/:timestamp  | delete single diet entry                    | admin  |
| GET  | /admin/diet/:patient_email              | get all diet entries for specified patient  | admin  |
| GET  | /admin/diet/:patient_email/:timestamp   | get single diet entry for specified patient | admin  |

###Doctor API Calls

|      | PATH                    | DESC                                | auth |
|------|-------------------------|-------------------------------------|------|
| GET  | /doctors                | all doctors                         | no   |
| GET  | /doctors/:doctor_email  | get info for specified doctor       | no   |
| POST | /doctors                | create doctor account               | no   |
| PUT  | /doctors/update_account | update email/pass for doctor*       | doc  |
| PUT  | /doctors/update_info    | update all other fields for doctor* | doc  |
| DEL  | /doctors/remove         | delete doctor account*              | doc  |

###Patient API Calls

|      | PATH                     | DESC                                                     | auth |
|------|--------------------------|----------------------------------------------------------|------|
| GET  | /patients                | find information on patient*                             | pat  |
| GET  | /list_of_patients        | get all patients pertaining to autheneticated doctor     | doc  |
| GET  | /patients/:patient_email | get info for specified patient - must be patients doctor | doc  |
| POST | /patients                | create patient account                                   | no   |
| PUT  | /patients/update_account | update email/pass for patient*                           | pat  |
| PUT  | /patients/update_info    | update all other fields for patient*                     | pat  |
| DEL  | /patients/remove         | delete patient account*                                  | pat  |

###Group API Calls

|      | PATH                    | DESC         | auth  |
|------|-------------------------|--------------|-------|
| GET  | /groups                 | all groups   | no    |
| POST | /groups                 | create group | admin |
| DEL  | /groups/remove/:groupid | delete group | admin |

###Diet API Calls

|      | PATH                                   | DESC                                           | auth |
|------|----------------------------------------|------------------------------------------------|------|
| GET  | /diet                                  | all diet entries*                              | pat  |
| GET  | /diet/:timestamp                       | get specific diet entry*                       | pat  |
| POST | /diet                                  | create diet entry*                             | pat  |
| PUT  | /diet/:timestamp                       | modify diet entry*                             | pat   |
| DEL  | /diet/:timestamp                       | delete diety entry*                            | pat  |
| GET  | /diet/doctor/:patient_email            | get all diet entries for specified patient     | doc  |
| GET  | /diet/doctor/:patient_email/:timestamp | get specific diet entry for specified patient  | doc  |

*these api calls pertain to a specific user (patient or doctor). The login in the API call will process the information based on the user of the request; meaning that whoever authenticates to make the api call will be the user that this logic is carried out on. Ex: GET - /patients; the description says find information on patient, but which patient? It will find information on the patient that authenticates in order to make the API call.

###API POST Calls include:

> /patients 

    {
    	email:"email@example.com",
    	pass:"$ExamPLePasSworD$",
        group: ["WSU"], //array can be any length from 0-
        first_name: "jeremy",
        last_name: "martinez",
        age: 22,
        height: 72, //inches
        weight: 180, //pounds
        sex: "male"        
    }

> /groups 

    {
        _id: "diabetes"
    }

> /doctors

    {
        email      : "example@test.com",
        first_name : "example",
        last_name  : "test",
        specialty  : "specs",
        hospital   : "hosp",
        pass       : "pass" 
    }

> /diet

    {
      email : "patient@test.com",
      created : "23:06-06-16-2015",
      foodID : "01011"
    }


###API PUT Calls include:

> /admin/doctors/update_account/:doctor**
> /admin/patients/update_account/:patient**
> /doctors/update_account**
> /patients/update_account**

    {
      "email" : "new_example@test.com",
      "pass" : "new_pass"
    }
    
> /admin/doctors/update_info/:doctor**
> /doctors/update_info**

    {
        "first_name": "Doctor",
        "last_name": "Lipschitz",
        "specialty": "rugrats",
        "hospital": "some hospital",
    }

> /admin/patients/update_info/:patient**
> /patients/update_info**
    
    {
        "first_name" : "new_patient",
        "last_name" : "new_test",
        "group" : "test",
        "doctor" : "doctor@test.com",
        "age" :  99 ,
        "height" :  99 ,
        "weight" :  99 ,
        "sex" : "male" 
    }

> /diet/:timestamp**

    {
      "created" : "16:06-07-16-2015",
      "foodID" : "01011"
    }

**In order to update an entry, you only have to send the fields that you want to update. So any number of the fields in the JSON of the PUT API call can be sent. All that are sent will be updated. So only send the fields that the user wants to change.