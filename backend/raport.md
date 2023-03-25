The project has been through various different architectural changes throughout it's development cycle. We initially started developing the backend application with [Django](https://www.djangoproject.com/), and [Django-restfamework](https://www.django-rest-framework.org/).
There where immediate issues with this solution such as creating alot of different ORM-objects and serializers for the api. These issues made this solution not viable for our specific usecase of this api.

### Second iteration!
I made an excecutive decision to migrate our api framework from Django-restframework to [Flask](https://flask.palletsprojects.com/en/2.2.x/). 

The flask API architecture looked like this, with a api endpoint controlling all feature-endpoints. And a model directory controlling all database schemas and custom functionality.

initialy we decided on a simple custom sqlite3 database with pythons built-in wrapper for sqlite3 and used it for early prototyping but I was realising that I would need to build a propper ORM for the majority of my logic and decided to migrate to an orm anyway.

We used [SQLAlchemy](https://www.sqlalchemy.org/) with a sqlite database for **now, with the possiblity of connecting to a postgreSQL database later.**

### limitations
Flask api requires alot of decorators on the endpoint handlers which I think is creating alot of forced code smells and there was no way to really prevent it.

The ORM was having major problems with the multithreaded nature of a WSGI application. *(Which I am sure there is a solution to but I didn't consider it worth the investment)*

The database session required a session to be ended which endorses dependancy injection, but flask is not very supported with dependancy injection and it would produce confusion and unorthodox usage of their api.

Flask doesn't have alot of middleware solutions out of the box, generally lacks tools like auto-documentation *(even just openapi documentation by default)* and the lack of supported strong typing is creating obfuscated code and inherintly ambiguous endpoint documentation.
The lack of middleware makes it complex to add things like authentication and CORS policies.

Flask also doesn't support automatic json serializiable objects to be return as a Http response, so I would need to make a custom serializable mixing class that the other ORM objects would inherit from.
```python
from sqlalchemy.inspection import inspect

class Serializable:

	def serialize(self):
		return {c: getattr(self, c) for c in inspect(self).attrs.keys() if "password" not in c}

	@staticmethod
	def serialize_list(list):
		return [model.serialize() for model in list]
```
this serializer would also then not serialize the password field for the user object, for obvious reason.

### Third (and final) iteration!! 
After comming across this new and fancy api called FastAPI, I was immediately intreaged by the wast array of features that it had out of the box:
- strong typing
- pydantic datatypes
- DI
- middlewear out of the box
- explicit async
- automatic doc generation (redoc, and swagger)

And that's why [this branch](https://github.com/roarengen/equiplib/pull/65) was made!
It's evident that Fastapi is more powerful than Flask out of the box, but the migration was not as painful as one might think.

### Database
The biggest difference was how fastapi doesnt do any implicit database handling, which puts the database handling into your hands instead, this is likely also something that I would recommend to do for Flask as opposed to what they document and suggest, which is [using their own wrapper](https://flask-sqlalchemy.palletsprojects.com/en/2.x/quickstart/). 

In our flask API we now take a database session as a dependancy which gets constructed and deconstructed each time an endpoint is requested, this might seem like a redundancy but it is much more safe as it deconstructs the session upon the requests end of scope.

```python 
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

Due to this change in design for how we manage the database session and also how we expect json-objects to be passed as data *(more on this later)*. It makes sense to introduce a service that handles all database interaction with respect to each model / table.   And so that's precisely what I made! 

I made a services directory that contains a service to each respective model, this abstraction helps the logic in the endpoint staying clean and removed all the code smells from the flask application in the former iteratin.

### Pseudo-strong typing
While python **IS** a dynamically typed language I can not emphasize enough how powerful type hints are, it is also very evident that the python community and development team are focusing on this as well, they keep improving typing natively in python such as, **Unions** are now buit into python with the "|" character instead. Before 3.9 :
```python
from typing import Union, List

class SomeClass:
	def __init__(self, x: Union[int, None], x_list: List[int]) -> None:
		self.x = x
		self.x_list = x_list
```
Now! (after 3.9)
```python
class SomeClass:
	def __init__(self, x: int | None, x_list: list[int]) -> None:
		self.x = x
		self.x_list = x_list
```
This is just one of the many examples of improvements they do specifically to improve type hinting in python.

The reason why this is important is because FastAPI uses your typehinting to build the automatic documentation:
```python
@api.get("/", response_model=list[User])
def get_users(db: Session = Depends(get_db)):
    users = userservice.get_users(db=db)
    return users

@api.post("/", response_model=User)
def post_user(user: UserCreate, db: Session = Depends(get_db)):
    return userservice.create_user(db=db, user=user)
```
This is a very simplified example of how I design my endpoints, the `response_model` parameter tells fastapi to build documentation with this object's fields.

### Pydantic
FastAPI uses Pydantic objects to produce these automatic documentation, but also to do automatic validation!
This is our user models:
```python
from pydantic import BaseModel
from datetime import datetime

class UserBase(BaseModel):
    roleid : int
    username : str
    lastname : str
    firstname : str
    email : str
    phone : str| None = None
    membershipid: str| None = None
    city: str| None = None
    dateOfBirth: datetime | None = None
    otherid : str| None = None
    other1 : str| None = None
    other2 : str| None = None
    activeFromDate : datetime | None = None
    activeToDate : datetime | None = None
    organizationid: int

class UserPatch(UserBase):
    roleid : int | None = None
    username : str | None = None
    lastname : str | None = None
    firstname : str | None = None
    email : str | None = None
    organizationid: int | None = None

class UserCreate(UserBase):
    password : str

class User(UserBase):
    id : int

    class Config:
        orm_mode = True

class LoginRequest(BaseModel):
    password: str
    username: str

class LoginResponse(BaseModel):
    user: User
    token: str
```

While it might be a little long and intimidating, it's clear what each of the models do and exist for. There is a UserBase that is the fields on an abstract user, in other words. Any user objects would always have those fields, and those validations. 

Upon user creation we use a new object that takes a password, *note how at no other time are we dealing with a user with a password.*

We have LoginRequest that is the request that we send when trying to login and a response with the user's information and their authentication token.

Using these objects in our endpoint documention severely de-obfuscates the endpoints and potential errors. It also gives specific and detail validation errors in the response if a api request uses invalid data. Upon entering a request **which fails validation** you will recieve this response:
```json
{
  "detail": [
    {
      "loc": [
        "string",
        0
      ],
      "msg": "string",
      "type": "string"
    }
  ]
}
```
It will let you know which field, and was wrongfully entered and what validation was failed, such as missing a field, or other [custom validations](https://docs.pydantic.dev/usage/validators/) you might create using the Pydantic module.

Getting this automatic documentaion, validation and feedback is a gamechanger when trying to use the api.
### Authorization
We have a table representing roles, which we currently represent using a numeric enum. We might move away from this in the future, as roles might become more complex, and the backend has been designed with respect to that in the future, but for now the roles are entirely hierachical, and so we can get away with treating them as such.

We are using Basic authentication which the user will use for all endpoints (as all endpoints require authenticaion **except login**).

```python
def get_user_from_token(db: Session, username: str,password:str) -> User:
    user = services.userservice.get_user_by_username(db, username)
    if not user or not user.verify_password(password):
        raise HTTPException(401)
    return user

def require_user(cred: HTTPBasicCredentials = Depends(HTTPBasic()), db: Session = Depends(get_db)) -> User: 
    user = get_user_from_token(db, cred.username, cred.password)
    if user.roleid < ROLES.USER:
        raise HTTPException(403)
    return user
```
This is an example of how I authenticate the token and with respect to the users roles.

We will always know if a person is trying to access and endpoint **without** a token representing any user, and this will produce a 401.

If the user has insufficient access it will return a 403.

We can then dependency inject these into our endpoint functions to automatically filter away unauthorized requests based on the user's roles.
```python
@api.get("/{id}", response_model=Rent, dependencies=[Depends(require_user)])
def get_rent(id: int, db: Session = Depends(get_db)):
	rent = crud.get_rent(db, id)
	if not rent:
		return HTTPException(status_code=404, detail="rent not found")
	return rent
```
This is a simplified version of one of our endpoints which depends on the `require_user` mentioned above.

### Dynamic Endpoints
If you payed close attention to the authentication code, we notice we can use them to return the user which is currently logged in. This can help us reduce our code and always know which user is logged in and return information dynamically from specific endpoints.

```python
# 
@api.get("/me", response_model=User)
def get_my_user(user : User = Depends(require_user)):
	return user
```

```python
# dynamically gets rents for currently logged in users
@api.get("/me", response_model=list[Rent])
def get_my_rents(db: Session = Depends(get_db), user : User = Depends(require_user)):
    return crud.get_rents_by_userid(db, user.id)
```

### Logging
I implemented logging quite early on as I wanted to deploy an instance as quick as possible to allow for front-end development to start with an actual backend as quick as possible.

And logging is somewhat essential when having an instance you can't easily monitor. I looked into various logging services but landed on [Papertrail](https://papertrail.com/).
Made a custom logger so that we can log our events and just hooked it up to papertrail.

I actually implemented this already in the Flask application but it does not change much, as we're not really using the same instance logger from FastAPI anyways as I believe it would be alot of redundancy and would prefer logging specific events that will provde much higher level value, although this might be changed in the future!

This is an example usecase where we use our logger:
```python
from fastapi.logger import logger

@api.post("/", response_model=User, dependencies=[Depends(require_admin)]) 
def post_user(user: UserCreate, db: Session = Depends(get_db)):
    if userservice.get_user_by_email(db=db, email=user.email):
        logger.debug(f"new user tried to create with email duplicate: {user.email}")
        raise HTTPException(status_code=400, detail="email already registered")

    if userservice.get_user_by_username(db=db, username=user.username):
        logger.debug(f"new user tried to create with username duplicate: {user.username}")
        raise HTTPException(status_code=400, detail="username already exists")

    logger.info(f"new user made: {user.username}")
    return userservice.create_user(db=db, user=user)
```

### Deployment
We have a Ubuntu server from [Linode](https://linode.com).

I added this to my ssh config and I recommend everyone else working on this project does the same:
```json
Host equiplib
	HostName 172.105.74.176
	user <username>
```

I made an account for all the developers on the team and added us to a group called `devs`.
The file directory is in `/opt/equiplib`. Everyone in the `devs` group will have apropriate authority to do anything they need within this directory.

I made a daemon service using systemd:
```yaml
[Unit]
Description=REST-API for equiplib
After=network.target

[Service]
Type=simple
Restart=always
WorkingDirectory=/opt/equiplib/backend
RestartSec=1
ExecStart=/usr/local/bin/uvicorn equiplib:app

[Install]
WantedBy=multi-user.target
```

This is located in `/etc/systemd/system/equiplibapi.service`.
This is the primary web instance for our application, and then we [Nginx](https://nginx.com) as a reverse proxy to this asgi app uvicorn is hosting.

We have our nginx configuration in the repository, although there is **no continuous deployment** at the moment, I consider it important to version control, as well as it will be easy to make a continous deployment solution with this in mind.
> the reason for this is because the sites-enabled reference nginx uses is (as per their documentation) just a soft symbiolic link so we will just have to copy the file to /etc/nginx/sites-available directory and run systemctl reload nginx.

Our nginx.conf file looks like this:
```yaml
server {
	listen 80;
	server_name 172.105.74.176;
	return 301 https://$server_name$request_uri;

}

server {
	listen 443 ssl;
	server_name 172.105.74.176;

	access_log  /var/log/nginx/equiplib.log;
	ssl_certificate /etc/nginx/ssl/equiplib.crt;
	ssl_certificate_key /etc/nginx/ssl/equiplib.key;

	location /api {
		proxy_pass http://127.0.0.1:8000;
		proxy_set_header Host $host;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	}

	location / {
		try_files $uri $uri/ = 404;
	}
}
```

We redirect all trafic from http over to https, and requests at /api will be redirected to our asgi instance served by uvicorn.

---
What I do to pull and apply new changes to the deployed instance:
```bash
ssh equiplib
cd /opt/euqiplib
git pull && sudo systemctl restart equiplibapi.service
```
And ofcourse, if I have done changes to the nginx.conf that needs to be deployed:
```bash
cp backend/nginx.conf /etc/nginx/sites-available/equiplib
sudo systemctl reload nginx
```

### Testing and CI
We have a CI pipeline that uses Pytest as the testing framework, we have a rule where you are not allowed to merge a branch to master if you have code that  changes the backend logic and fails the tests.

The tests get dependancy injected with a testclient and runs a appinsatnce that runs on a different backend engine. The test engine runs just in memory.
```python
@pytest.fixture()
def app():
    Base.metadata.create_all(bind=testengine)

    app = create_app(LaunchArg.TEST)
    app.dependency_overrides[get_db] = override_get_db
    yield app

    Base.metadata.drop_all(bind=testengine)

@pytest.fixture()
def client(app: FastAPI) -> TestClient:
    return TestClient(app)
```

In order to make a test you need to provide the testClient as an argument and the Pytest Fixture will dependency inject our custom one
```python
def test_users(client: TestClient) -> None:
    response = client.get("api/users/")
    assert response.status_code == 200
```
# Important commit history
- [initial django commit](https://github.com/roarengen/equiplib/commit/0a87f9a4a4cc234eb346ca53b27fcc3a08cb22b6)
- [migration to flask](https://github.com/roarengen/equiplib/commit/1250888d894c80825aa40a0af62dc67686026e06)
