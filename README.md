# povio

#### I have used "clean architecture" created by Robert "Uncle Bob" Martin.

#### Dependency direction
```
domain => usecase => interface => infrastructure
```
#### *server.js* is the starting file which contains all initialization and injection

### Steps:
```
- apply database scripts located in: workspace/database_scripts
- npm install
- npm test (for testing)
- npm start (for production, might need to create .env file similar to  .env.test)
```
###Endpoints
```
- /signup
  - method: POST
  - body params: username and password
  - no auth required
  ```
  ```
- /login
  - method: POST
  - body params: username and password
  - no auth required
  ```
  ```
- /me
  - method: GET
  - auth required
  ```
  ```
- /me/update-password
  - method: PUT
  - body params: password
  - auth required
  ```
  ```
- /user/:id
  - method: GET
  - req params: id (target user)
  - no auth required
  ```
  ```
- /user/:id/like
  - method: POST
  - req params: id (target user)
  - auth required
  ```
  ```
- /user/:id/unlike
  - method: DELETE
  - req params: id (target user)
  - auth 
  ```
  ```
- /most-liked
  - method: GET
  - no auth required
  ```
  
  
