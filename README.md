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
| readme
```

## Backend Stack
* Python
* Flask
* SQLalchemy
* flask-SQLalchemy

### Style guide
Follow the [PEP-8](https://peps.python.org/pep-0008/) style guide

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
