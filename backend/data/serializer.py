from sqlalchemy.inspection import inspect

class Serializable:

    def serialize(self):
        return {c: getattr(self, c) for c in inspect(self).attrs.keys() if "password" not in c}

    @staticmethod
    def serialize_list(list):
        return [model.serialize() for model in list]
