from __future__ import annotations

class User:
    def __init__(self, username:str, password:str, email:str, *args) -> None:
        self.id = 1
        self.username = username
        self.password = password
        self.email = email
        self.role = 1

    @staticmethod
    def deserialize(data:dict[str, any] | tuple[any]) -> User:
        new_user = User("", "", "")
        if type(data) == dict:
            # from web
            for attr in data:
                setattr(new_user, attr, data[attr])

        elif type(data) == tuple:
            # from db
            setattr(new_user, 'id', data[0])
            setattr(new_user, 'username', data[1])
            setattr(new_user, 'role', data[2])
        
        return new_user
    
    def to_dict(self):
        return {
            "id" : self.id,
            "username" : self.username,
            "role" : self.role,
        }

    def serialize(self) -> list[any]:
       return [self.role, self.username] 

    def hash_password(self):
        ...

    def __str__(self):
        return str(self.username)
