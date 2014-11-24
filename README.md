node-mongo-server
=================

A basic mongoDB web service that allows CRUD operations by using REST API.

## Getting Started

To start _node-mongo-server_, navigate to the root of this folder and run the following command:

        node index.js

To insert new document, do a HTTP **POST** to the following URL (e.g. http://localhost:9002/html):

        http://<serverhost>:<serverport>/<collection name>

To find an existing document by ID, do a HTTP **GET** to the following URL (e.g. http://localhost:9002/html/01):

        http://<serverhost>:<serverport>/<collection name>/<_id>
    
To view all documents in a collection, visit the following URL (e.g. http://localhost:9002/html)

        http://<serverhost>:<serverport>/<collection name>

To update an existing document by ID, do a HTTP **PUT** to the following URL (e.g. http://localhost:9002/html/01):

        http://<serverhost>:<serverport>/<collection name>/<_id>
    
To update an existing document by ID, do a HTTP **DELETE** to the following URL (e.g. http://localhost:9002/html/01):

        http://<serverhost>:<serverport>/<collection name>/<_id>
