from __future__ import annotations

class User:
    def __init__(self, name:str, password:str, email:str, *args) -> None:
        self.name = name
        self.password = password
        self.email = email
        self.role = 1

    @staticmethod
    def deserialize(data:dict) -> User:
        try:
            name = data['name']
            password = data['password']
            email = data['email']
        except:
            raise ValueError("unable to deserialize data to produce a user. \ndata.", data)

        return User(name, password, email)

    def save(self):
        ...

    def hash_password(self):
        ...

    def __str__(self):
        return self.email
