from __future__ import annotations
class Role:
    def __init__(self) -> None:
        self.id = 0
        self.role_name = ""
        self.is_active = 0
    
    def serialize(self) -> dict:
        return {
            "id" : self.id,
            "roleName" : self.role_name,
            "isActive" : self.is_active,
        }

    @staticmethod
    def deserialize(data:dict) -> Role:
        new_role = Role()
        for attr in data:
            setattr(new_role, attr, data[attr])
        return new_role