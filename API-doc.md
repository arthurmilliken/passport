FORMAT: 1A
HOST: auth.pick.media

# Auth Server

This API provides authorization services

# Group Token


# Group Application

Endpoints for managing client applications. Currently, only "superuser" scope is permitted to perform these operations.

## Application Collection [/api/applications]

Client applications which can consume this API

### List application ids [GET]

+ Request
  + Headers
    Authorization: Bearer {jwt}
+ Response 200 [application/json]
  [
    {
      "id": "21232f297a57a5a743894a0e4a801fc3",
      "name": "admin",
      "location": "/api/applications/21232f297a57a5a743894a0e4a801fc3"
    },
    {
      "id": "0aa7c02afb2118bf6c103c79876c7808",
      "name": "api.example.com",
      "location": "/api/applications/0aa7c02afb2118bf6c103c79876c7808"
    }
  ]

### Create Application [POST]

+ name (string) - the name of the application. (required) (unique)
+ scopes (array[string]) - what authorization scopes are available to this application.
+ tokenTTL - the time-to-live for tokens granted to this application (default: 600).

+ Request (application/json)
  + Headers
    Authorization: Bearer {jwt}
  + Body
    {
      "name": "api.example.com",
      "scopes": [ "superuser" ],
      "tokenTTL": 600
    }

+ Response 201 (application/json)
  + Headers
    Location: /api/applications/0aa7c02afb2118bf6c103c79876c7808
  + Body
    {
      "id": "0aa7c02afb2118bf6c103c79876c7808",
      "name": "api.example.com",
      "secret": "60bced61-9916-4449-9110-924a4b8753b6",
      "scopes": [ "superuser" ],
      "tokenTTL": 600
    }

## Application [/api/appplications/{id}]
+ Parameters
  + id (string) - the client id of the application

### [GET]
+ Request
  + Headers
    Authorization: Bearer {jwt}
+ Response 200 (application/json)
    {
      "id": "0aa7c02afb2118bf6c103c79876c7808",
      "name": "api.example.com",
      "secret": "60bced61-9916-4449-9110-924a4b8753b6",
      "scopes": [ "superuser" ],
      "tokenTTL": 84600
    }

### [PUT]
+ Request (application/json)
  + Headers
    Authorization: Bearer {jwt}
  + Body
    {
      "id": "0aa7c02afb2118bf6c103c79876c7808",
      "name": "api.example.com",
      "secret": "60bced61-9916-4449-9110-924a4b8753b6",
      "scopes": [ "superuser" ],
      "tokenTTL": 84600
    }
+ Response 204

### [DELETE]
+ Response 204

## Application Metadata [/api/appplications/{id}/meta]

### [GET]
+ Request (application/json)
  + Headers
    Authorization: Bearer {jwt}
+ Response 200 (application/json)
    {
      "id": "0aa7c02afb2118bf6c103c79876c7808",
      "created", "2017-02-07T22:11:52+00:00",
      "modified", "2017-02-07T22:11:52+00:00",
      "json": "{\"id\":\"0aa7c02afb2118bf6c103c79876c7808\",\"name\":\"api.example.com\",\"secret\":\"60bced61-9916-4449-9110-924a4b8753b6\",\"scopes\": [\"superuser\" ],\"tokenTTL\":84600}"
    }

    
