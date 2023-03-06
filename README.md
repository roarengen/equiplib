# equiplib

system structure
----
```bash
root*
| backend
| | requirements.txt 
| | main.py				# the entry point for flask app / wsgi application
| | blueprints/
| | | api.py 
| | data/				# stores the datamodels
| | | user.py
| | | rent.py
| | extensions.py		# global instances like database instance
| frontend
| | client 
| | app.routing.module.ts # Sets Urls for the different types of components. Note that components can have nested children components.
| | app.module.ts # 
| | | |features/   # home to all the components.
| | | |helpers/   # different types of helper functions, for f.ex auth.gard.
| | | |models/    # stores datamodels
| | | |assets/    # storage for unstructured files, such as .pngs.
| | | |services/    # Provides stateless functions, mainly to link with the backend.
| | | |environments/    # Set the current environment parameters for prod / dev.
| | | |styles/    # Global style palettes and layout for all components.
| | || models/    # stores datamodels, mapped in services.
| readme
```

## Backend Stack
* Python
* Flask
* SQLalchemy
* flask-SQLalchemy

### Style guide
Follow the [PEP-8](https://peps.python.org/pep-0008/) style guide.
Always use type hints if possible.
(if you're struggling with type hints: [annotations](https://docs.python.org/3/howto/annotations.html), [Protocols](https://peps.python.org/pep-0544/))

### How to:

To interact with the database while it is on disk;
we can cd into backend directory and start python from shell
```python
import main
from extensions import db

db.create_all() #  creates all tables for models defined
db.drop_all() # drops all tables
# not that in order to update a table, we need to drop it and re-create it

# to make an new user
from data.user import User
new_user = User(params=params)
db.session.add(new_user)
db.session.commit()
```
ref: [flask-sqlalchemy doc](https://flask-sqlalchemy.palletsprojects.com/en/2.x/quickstart/)

----

To start the flask instance:

```bash
cd backend
python main.py
```
## Frontend Stack
* Angular.js
* Ionic Framework
* SCSS
* Materials 3

### Style guide
* Will implement Stylelint for scss-based code control.
* Will implement Eslint for scss-based code control.
### How to:

To install the necessary node modules use:

npm install in the /client directory.

To run the client use:

ng serve --open

----
