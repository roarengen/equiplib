# equiplib

system structure
----
```bash
root*
| backend
| | requirements.txt 
| | main.py				# the entry point for fastapi app / asgi application
| | routes/
| | | __int__.py        # contains all the different blueprints. Can behave as a "feature toggle"
| | | user.py
| | | rent.py
| | | etc...
| | schemas/			# stores the datamodels for DB interaction
| | | user.py
| | | rent.py
| | | etc...
| | models/			    # models for interacting, and transfering data through api (dto's)
| | | user.py
| | | rent.py
| | | etc...
| | tests/				# unit tests
| | | conftest.py
| | | test_user.py
| | | rent.py
| | | etc...
| | extensions.py		# global instances like database instance
| | equiplib.py		    # production asgi app instance
| | database.py		    # database interaction
| | main.py		        # dev asgi app instance
| | log.log             # log file
| | nginx.conf          
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
* FastAPI
* SQLalchemy
* Pydantic

### Style guide
Follow the [PEP-8](https://peps.python.org/pep-0008/) style guide.
Always use type hints if possible.
(if you're struggling with type hints: [annotations](https://docs.python.org/3/howto/annotations.html), [Protocols](https://peps.python.org/pep-0544/))

# Development
To start the fastAPI dev instance:

## windows
```bash
cd backend
python -m venv venv
venv/Scripts/activate.bat
python -m pip install -r requirements.txt
python main.py
```

## linux
```bash
cd backend
python -m venv venv
source venv/bin/activate
python -m pip install -r requirements.txt
python main.py
```

# Deployment
NGINX reverse-proxy pointing to the Uvicorn ASGI instances.
systemd service

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

ionic serve for dev.

----
