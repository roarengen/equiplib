curl -H 'Content-Type: application/json'\
	-d '{ "name" : "test", "password": 1234, "email" : "test@testy.com" }' \
	-X POST http://localhost:8888/api/
