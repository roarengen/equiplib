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
    def serialize(self) -> list:
        ...

    @staticmethod
    def deserialize(data:dict):
        ... 

class DatabaseManager:
    def __init__(self, path: str = ":memory:") -> None:
        self.connection = sqlite3.connect(path, check_same_thread=False)

    def _find_highest_id(self, table: DatabaseTables) -> int:
        cur = self.connection.cursor()
        cur.execute(f"""SELECT * FROM {table} order by id desc
        """)
        entity = cur.fetchone()
        cur.close()
        if not entity:
            return 0
        return entity[0]

    def initalize(self):
        cur = self.connection.cursor()

        cur.execute(f"""CREATE TABLE IF NOT EXISTS {DatabaseTables.ORG} (
                id integer PRIMARY KEY,
                organizationNumber text not null,
                organizationName text not null,
                email text,
                phone text,
                street text,
                city text,
                postalCode text,
                otherId text,
                other1 text,
                other2 text,
                organizationOtherIdLabel text,
                organizationOther1Label text,
                organizationOther2Label text,
                userOtherIdLabel text,
                userOther1Label text,
                userOther2Label text
            );""")

        cur.execute(f"""CREATE TABLE IF NOT EXISTS {DatabaseTables.ROLES} (
        id integer PRIMARY KEY,
        roleName text not null,
        isActive int not null
        );
        """)

        cur.execute(f"""CREATE TABLE IF NOT EXISTS {DatabaseTables.USERS}(
                    id integer PRIMARY KEY,
                    roleid integer not null,
                    username text not null,
                    password text not null,
                    name text not null,
                    email text not null,
                    phone text,
                    membershipid text,
                    otherId text,
                    city text,
                    postalcode text,
                    dateOfBirth text,
                    comment text,
                    other1 text,
                    other2 text,
                    activeFromDate text,
                    activeToDate text,
                    organizationId int not null,
                    FOREIGN KEY (organizationId) REFERENCES Organizations(id)
                    FOREIGN KEY (roleid) REFERENCES Roles(id)
                    );
                    """
                    )
        cur.close()

    def insert_into(self, table: DatabaseTables, object : DatabaseObject):
        cur = self.connection.cursor()
        id = self._find_highest_id(table)
        data = object.serialize()
        data['id'] = id + 1
        data = [point for point in data.values()]
        values: str = "".join(["?, " for _ in data])[:-2]
        cur.execute(f"INSERT INTO {table} VALUES({values})", data)
        cur.close()

    def query(self, table: DatabaseTables, expected_type: DatabaseObject) -> list[DatabaseObject]:
        cur = self.connection.cursor()
        cur.execute(f"SELECT * from {table}")
        raw_list_of_entities = cur.fetchall()
        instance = expected_type()
        keys = list(instance.serialize().keys())
        
        data = []
        for entity in raw_list_of_entities:
            dict = {}
            for i in range(len(entity)):
                dict[keys[i]] = entity[i]
                
            data.append(dict)
            
        cur.close()
        list_of_entities: expected_type = [expected_type.deserialize(entity) for entity in data]
        return list_of_entities
        

