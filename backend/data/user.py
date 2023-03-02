from __future__ import annotations

class User:
    def __init__(self) -> None:
        self.id = 1
        self.roleid = 1
        self.username = ""
        self.password = ""
        self.name = ""
        self.email = ""
        self.phone = ""
        self.membershipid = ""
        self.otherid = ""
        self.city = ""
        self.postalcode = ""
        self.dateofbirth = ""
        self.comment = ""
        self.other1 = ""
        self.other2 = ""
        self.activefromdate = ""
        self.activetodate = ""
        self.organizationid = 1


    @staticmethod
    def deserialize(data:dict[str, any] | tuple[any]) -> User:
        new_user = User()
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
    
    def serialize(self):
        return {
        "id" : self.id,
        "roleid" : self.roleid,
        "username" : self.username,
        "password" : self.password,
        "name" : self.name,
        "email" : self.email,
        "phone" : self.phone,
        "membershipid" : self.membershipid,
        "otherid" : self.otherid,
        "city" : self.city,
        "postalcode" : self.postalcode,
        "dateofbirth   " : self.dateofbirth,
        "comment" : self.comment,
        "other1" : self.other1,
        "other2" : self.other2,
        "activefromdate" : self.activefromdate,
        "activetodate" : self.activetodate,
        "organizationid" : self.organizationid,
        }

    def hash_password(self):
        ...

    def __str__(self):
        return str(self.username)
