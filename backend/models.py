from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
base_dir = os.path.dirname(__file__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///"+os.path.join(base_dir,"project.db")
db = SQLAlchemy(app)

class Circle(db.Model):
  __tablename__="circles"
  circle_id = db.Column(db.String,primary_key=True)
  circle_name = db.Column(db.String,nullable=False)
  circle_description=db.Column(db.Text,nullable=False)
  circle_fee=db.Column(db.Integer)
  number_of_male = db.Column(db.Integer,nullable=False)
  number_of_female=db.Column(db.Integer,nullable=False)
  circle_icon_path=db.Column(db.String,nullable=False)

  def __init__(self,circle_id,circle_name,circle_description,circle_fee,number_of_male,number_of_female,circle_icon_path):
    self.circle_id = circle_id
    self.circle_name = circle_name
    self.circle_description = circle_description
    self.circle_fee = circle_fee
    self.number_of_female = number_of_female
    self.number_of_male = number_of_male


class User(db.Model):
  __tablename__ = "users"
  user_id = db.Column(db.Integer,primary_key=True)
  user_name = db.Column(db.String,nullable=False)
  mainadress = db.Column(db.String,nullable=False)



