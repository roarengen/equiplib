from __future__ import annotations
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, relationship, mapped_column
from database import Base
from schemas.organization import Organization
from schemas.location import Location
from schemas.serializer import Serializable

class TagEquipmentRelationship(Base):
    __tablename__ = "tag_equipment_relationship"

    equipment_id = Column(ForeignKey("equpiment.id"), primary_key=True)
    tag_id = Column(ForeignKey("tag.id"), primary_key=True)

class Equipment(Base, Serializable):
    __tablename__ = "equpiment"

    id = mapped_column(Integer, primary_key=True)
    organizationid = Column(Integer, ForeignKey(Organization.id), nullable=False)
    name = Column(String(80), nullable=False)
    model = Column(String(80))
    description = Column(String(80))
    type = Column(String(80))
    serialnumber = Column(String(80))
    brand = Column(String(80))
    other1 = Column(String(80))
    other2 = Column(String(80))
    other3 = Column(String(80))
    comment = Column(Text)
    locationid = Column(Integer, ForeignKey(Location.id), nullable=False)
    active = Column(Boolean, nullable=False)
    tags: Mapped[list[Tag]] = relationship(secondary="tag_equipment_relationship", back_populates="equipments")

    def __repr__(self):
        return '<Equipment %r>' % self.name

class Tag(Base, Serializable):
    __tablename__ = "tag"

    id = mapped_column(Integer, primary_key=True)
    name = Column(String(80), nullable=False)
    color = Column(String(80))
    active = Column(Boolean, nullable=False, default=True)
    organizationid = Column(Integer, ForeignKey(Organization.id), nullable=True)
    equipments: Mapped[list[Equipment]] = relationship(secondary="tag_equipment_relationship", back_populates="tags")

    def __repr__(self):
        return '<Tag %r>' % self.name
