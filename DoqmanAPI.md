FORMAT: 1A
HOST: https://doqman.herokuapp.com/

# Doqman
Provides services for the Doqman Document Management System

# Group Users
Resources related to users account access and creation

## User Login [/users/login]

### Logs A User In [POST]

+ Request (application/json)
    
    {
        "email": "femi@mail.com",
        "password": "password"
    }

+ Response 200 (application/json)
    
    {
        "message": "You have successfully logged in",
        "token": "eyJ1c2VySWQiOjEsImlhdCI6MTQ4ODkwOTA0OCwiZXhwIjoxNDg5NTEzODQ4fQ.YKsL2EfuLDmhHDySTQjWHA5qbkN77m76-DpLtFKFF-8",
        "user": {
            "userId": 2,
            "userName": "Phemi",
            "firstName": "Oluwafemi",
            "lastName": "Akinwa",
            "email": "kaiser@mail.com"
        }
    }

## User Logout [/users/logout]

### Logs A User Out [POST]

+ Request
    
    Authentication: Basic AbCdefGH

+ Response 200 (application/json)
    
    {
        "message": "You have successfully logged out"
    }

## Create User [/users/]

### Creates a New User [POST]

+ Request (application/json)
    
    {
        "userName": "Phemi",
        "firstName": "Oluwafemi",
        "lastName": "Akinwa",
        "email": "kaiser@mail.com",
        "password": "password"
    }

+ Response 201 (application/json)
    
    {
        "message": "Your account has been created successfully",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTQ4ODkwNTg3OCwiZXhwIjoxNDg5NTEwNjc4fQ.3",
        "user": {
            "userId": 6,
            "userName": "Phemi",
            "firstName": "Oluwafemi",
            "lastName": "Akinwa",
            "email": "kaiser@mail.com",
            "roleId": 2,
            "createdAt": "2017-05-04T00:00:53.528Z",
            "updatedAt": "2017-05-06T00:00:53.528Z"
        }
    }

## Instances of User [/users/]

### Find Matching Instances of User [GET]
+ Request
    + Headers

        Authentication: Admin AbcDEXyz

+ Response 200 (application/json)
    
    {
        "message": "You have successfully retrived all users",
        "users": {
            "rows": [
                {
                    "userId": 2,
                    "userName": "egun",
                    "firstName": "Ara",
                    "lastName": "Mbada",
                    "email": "shenujeje@gmail.com",
                    "createdAt": "2017-05-04T00:00:53.528Z"
                },
                {
                    "userId": 1,
                    "userName": "olori",
                    "firstName": "Eyan",
                    "lastName": "Mayweather",
                    "email": "badoo@gmail.com",
                    "createdAt": "2017-06-04T00:00:53.528Z"
                }
            ]
        }   
    }

## Users Pagination [/users/?limit={integer}&offset={integer}]

### Pagination For Users [GET]

+ Response 200
    {

    }

## Find User [/users/{user_id}]

### Finds A User With The Specified ID [GET]
+ Parameters
    + user_id (number) -ID of the user in the form of an integer

+ Request
    + Headers

        Authorization: Basic AbcDEXyz

+ Response 200 (application/json)
    
    {
        "message": "You have successfully retrived this user",
        "user": {
            "userId": 4,
            "userName": "Kaiser",
            "firstName": "Kaiser",
            "lastName": "Phemi",
            "email": "femi@mail.com"
        }
    }

## Update User [/users/{user_id}]

### Updates A User's Attributes [PUT]
+ Parameters
    + user_id (number) -ID of the user in the form of an integer

+ Request (application/json)
    + Headers
    
        Authentication: Basic AbcDEXyz
    
    {
        "firstName": "Kaiser",
        "lastName": "Phemi"
    }

+ Response 200 (application/json)
    
    {
        "message": "Your profile has been updated",
        "updatedUser": {
            "userId": 4,
            "userName": "Kaiser",
            "firstName": "Kaiser",
            "lastName": "Phemi",
            "email": "femi@mail.com"   
        }
    }

## Delete User [/users/{user_id}]

### Deletes A User [DELETE]
+ Parameters
    + user_id (number) -ID of the user in the form of an integer

+ Request
    + Headers
    
        Authentication: Admin KlmNOpq

+ Response 200 (application/json)

    {
        "message": "This account has been successfully deleted"
    }

# Group Documents
Resources related to documents attached to users accounts

## Create Document [/documents/]

### Creates A New Document Instance [POST]

+ Response 200 
    {

    }

## Get Document [/documents/]

### Find Matching Instances Of Document [GET]

+ Response 200 
    {

    }

## Document Pagination [/documents/?limit={integer}&offset={integer}]

### Pagination For Document List [GET]

+ Response 200 
    {

    }

## Find Document [/documents/{document_id}]

### Finds A Document [GET]

+ Response 200
    {

    }

## Update Document Attributes [/documents/{document_id}]

### Updates A Document's Attribute [PUT]

+ Response 200 
    {

    }

## Delete Document [/documents/{document_id}]

### Deletes A Document [DELETE]

+ Response 204

## Find All Documents For User [/users/{user_id}/documents]

### Find All Documents Belonging To A User [GET]
+ Parameters
    + user_id (number) -ID of the user in the form of an integer

+Request
    +Headers

        Authentication: Basic XyZAbcd

+ Response 200 (application/json)
    
    {
        "message": "This user's documents was successfully retrieved",
        "userDocuments": {
            "user": {
                "userID": 7,
                "userName": "Kaiser",
                "firstName": "Kaiser",
                "lastName": "Phemi",
                "email": "femi@mail.com"
            },
            "documents": {
                "count": 1,
                "rows": {
                    "documentId": 3,
                    "title": "Manifest",
                    
                }
            }
        }
    }

# Group Search

## Search For A User [/search/users/?q={username}]

### Search For A User [GET]

+ Response 200 (application/json)
    {

    }

## Search For A Document [/search/documents/?q={doctitle}]

### Search For A Document [GET]



