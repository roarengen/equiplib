import sqlite3
from typing import Protocol
from user import User

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

sqlite3.connect(":memory:") # RUNS IN MEMORY DURING PROTOPYING

class DatabaseManager:
    def __init__(self, path: str = ":memory:") -> None:
        self.connection = sqlite3.connect(path)

    def initalize(self):
        cur = self.connection.cursor()

        cur = cur.execute(f"""CREATE TABLE IF NOT EXISTS {DatabaseTables.ROLES} (
        roleid integer PRIMARY KEY NOT NULL,
        roleName text not null,
        isActive integer not null
        );
        """)

        cur.execute(f"""CREATE TABLE IF NOT EXISTS {DatabaseTables.USERS}(
                    userid int PRIMARY KEY not null,
                    roleid int roleid not null,
                    username text not null,
                    FOREIGN KEY (roleid) REFERENCES Roles(roleid)
                    );
                    """
                    )
        cur.close()

    def insert_into(self, table: DatabaseTables , object : DatabaseObject):
        cur = self.connection.cursor()
        data = object.serialize()
        values:str = "".join(["?, " for _ in data])[:-2]
        cur.execute(f"INSERT INTO {table} VALUES({values})", data)
        cur.close()

    def query(self, table: DatabaseTables, expected_type: DatabaseObject) -> list[DatabaseObject]:
        cur = self.connection.cursor()
        cur.execute(f"SELECT * from {table}")
        raw_list_of_entities = cur.fetchall()
        cur.close()
        list_of_entities: expected_type = [expected_type.deserialize(y) for y in raw_list_of_entities]
        return list_of_entities
        

dbm = DatabaseManager()
dbm.initalize()

new_user = User("kjell", "235", "test@test.com")

dbm.insert_into(DatabaseTables.USERS, new_user)
entities = dbm.query(DatabaseTables.USERS, User)
print([str(entity) for entity in entities])