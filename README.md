# rave-backend
Backend for Rave

## Setup/Requirements 

Run `npm install` or `yarn install` 

If there are any issues try manually installing the required packages:
```agsl
npm install express sequelize mysql2 cors --save
```

## Server 

Run the server with: 
```agsl
node server.js
```

## Database 

For testing the database in development, you will need to have mysql installed
and running, a database created by the root mysql user called "testdb" with no password.

When you run the server you should see output along these lines:
```agsl
Executing (default): DROP TABLE IF EXISTS `Users`;
Executing (default): CREATE TABLE IF NOT EXISTS `Users` (`id` INTEGER NOT NULL auto_increment , `email` VARCHAR(255) NOT NULL UNIQUE, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;
Executing (default): SHOW INDEX FROM `Users`
Server is running on port 8080.
```

The line `await sequelize.sync({ force: true });` in server.js will examine all of the sequelize models that have been
defined and synchronize the database by creating the required tables.  Note that `{force: true}` is on
for testing purposes, and will cause sequelize to reset the database completely and resync it
every time the server is restarted in order to pick up any changes to the underlying data model. 
This is a destructive action (meaning that any data in the db before the reset is lost).  If you are not making any
changes to existing models in the database, remove the `force: true` to suppress this behavior. 

## Structure of the db API

### Models

Sequelize is used to define models which will correspond to tables in the database.  The models
will create the appropriate tables, and allow for CRUD actions on that table via interaction through a model object.
For Example:
```agsl
import sequelize from "./index.js";
import {DataTypes} from "sequelize";

const User = sequelize.define("User", {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
})

export default User;
```

Here we define a sequelize model called "User" which has one column: email.  Email is of type string (VARCHAR(255)),
is required to be present to create a new user, and must be unique from any other User email stored in the db. 

For more info on sequelize models: https://sequelize.org/docs/v6/core-concepts/model-basics/

### "Controllers"

Here our controllers are really just a series of callback functions that are added to specific end points of a router. This router's 
routes/callbacks will then be added to a base route specific to their associated model.
For example in `user-controller.js`:
```agsl
const userRouter = express.Router();

userRouter.post("/", (req, res) => {
    // Validate request
    if (!req.body.email) {
        res.status(400).send({
            message: "Email can not be empty!"
        });
        return;
    }

    // Create a new user
    const user = {
        email: req.body.email
    };

    // Save User in the database
    User.create(user)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the User."
            });
        });
});

...

export default userRouter;
```

Here we create an endpoint for the Users at "/", and when hit with a post request that includes
json in the body with an email, it will use the sequelize user model to create a new record in the database
using the provided email using `User.create`. `req` is the request received by the server. `res` is used to send a
response to the request via `res.send()`. 

Note: in this example, the response is being sent directly using the result
of the sequelize query, but this is not required.  You can capture the data from the query and manipulate it or add to it
(for example if you need data from the spotify API also), before sending the response. 

In `server.js` the line: 
```agsl
import userRouter from "./db/controllers/user-controller.js";

...

app.use('/users', userRouter);

...
```

Grabs the routes from our user "controller" and adds them to the `/users` base url. So our example action above for 
creating users can be reached by sending a POST request to "localhost:8080/users"

If you need a new/specific type of data from the backend about a particular model that cannot be retreived
with the current api, add an endpoint/callback action to that models controller and update the API documentation. 


### Testing the API 

You can use Postman to test sending requests to the sever and examine the responses.  You'll need to install the 
desktop agent in order to send requests to your localhost.  (Postman does require an account but it is free to create 
and use). 

For example, a post request to create a user like in our example described above would look like this:
![post_example.PNG](images%2Fpost_example.PNG)

And if everything worked the response should look like this, indicating the id of the record in the database, email used
create, and some created at/updated at timestamps: 
![post_response_example.PNG](images%2Fpost_response_example.PNG)


# API Docs 

## Users 

### Create 

Creates a user with a given email.  NOTE: If a user with the provided email already exists, the 
response will indicate a validation error. 

- Endpoint: `/users/`
- Request Type: `POST`
- Content Type: `JSON`
- Required Fields `email`

Example body:
```agsl
{
 "email": "test@test.com"
}
```

Example Response: 
```agsl
{
    "id": 1,
    "email": "newUser@test.com",
    "updatedAt": "2023-03-16T12:40:57.434Z",
    "createdAt": "2023-03-16T12:40:57.434Z"
}
```

### Lookup

Retrieves a User record from the database that matches the given email. 

- Endpoint: `/users/lookup`
- Request Type: `GET`
- Content Type: `JSON`
- Required Fields `email`

Example body:
```agsl
{
 "email": "test@test.com"
}
```

Example Response: 
```agsl
[
    {
        "id": 1,
        "email": "newUser@test.com",
        "createdAt": "2023-03-16T12:40:57.000Z",
        "updatedAt": "2023-03-16T12:40:57.000Z"
    }
]
```

Note that the response returns and array of records.  If no User with the given email exists this array would be empty. 
