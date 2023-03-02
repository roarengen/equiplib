import sqlite3
from typing import Protocol
from data.user import User

class DatabaseTables:
    ROLES = "Roles"
    USERS = "Users"
    LOCATIONS = "Locations"
    RENTS = "Rents"
    EQUIPMENT = "Equipment"
    ORG = "Organization"

class DatabaseObject(Protocol):
    def serialize(self):
        ...

    @staticmethod
    def deserialize(data:dict):
        ... 

class DatabaseManager:
    def __init__(self, path: str = ":memory:") -> None:
        self.connection = sqlite3.connect(path, check_same_thread=False)

    def initalize(self):
        cur = self.connection.cursor()

        cur = cur.execute(f"""CREATE TABLE IF NOT EXISTS {DatabaseTables.ROLES} (
        roleid integer PRIMARY KEY AUTOINCREMENT,
        roleName text not null,
        isActive int not null
        );
        """)

        cur.execute(f"""CREATE TABLE IF NOT EXISTS {DatabaseTables.USERS}(
                    userid integer PRIMARY KEY AUTOINCREMENT,
                    username text not null,
                    roleid int not null,
                    FOREIGN KEY (roleid) REFERENCES Roles(roleid)
                    );
                    """
                    )
        cur.close()

    def insert_into(self, table: DatabaseTables , object : DatabaseObject):
        cur = self.connection.cursor()
        data = object.serialize()
        values:str = "".join(["?, " for _ in data])[:-2]
        cur.execute(f"INSERT INTO {table} (roleid, username) VALUES({values})", data)
        cur.close()

    def query(self, table: DatabaseTables, expected_type: DatabaseObject) -> list[DatabaseObject]:
        cur = self.connection.cursor()
        cur.execute(f"SELECT * from {table}")
        raw_list_of_entities = cur.fetchall()
        cur.close()
        list_of_entities: expected_type = [expected_type.deserialize(y) for y in raw_list_of_entities]
        return list_of_entities
        

