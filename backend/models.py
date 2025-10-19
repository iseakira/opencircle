from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os

app = Flask(__name__)
base_dir = os.path.dirname(__file__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///"+os.path.join(base_dir,"project.db")
db = SQLAlchemy(app)

class Circle(db.Model):
  __tablename__="circles"
  circle_id = db.Column(db.Integer,primary_key=True)
  circle_name = db.Column(db.String(100),nullable=False)
  circle_description=db.Column(db.Text,nullable=False)
  circle_fee=db.Column(db.Integer,nullable=True)
  number_of_male = db.Column(db.Integer,nullable=False,default=0)
  number_of_female=db.Column(db.Integer,nullable=False,default=0)
  circle_icon_path=db.Column(db.String(255),nullable=True)

  tags = db.relationship('Tag', secondary=circle_tags, back_populates='circles', lazy='dynamic')
class User(db.Model):
  __tablename__ = "users"
  user_id = db.Column(db.Integer,primary_key=True)
  user_name = db.Column(db.String(80),nullable=False)
  mail_adress = db.Column(db.String(255),unique=True,nullable=False)
  password = db.Column(db.String(255), nullable=False)

  sessions = db.relationship('Session', backref='user', lazy=True)

  

class Tag(db.Model):
  __tablename__ = "tags"
  tag_id = db.Column(db.Integer,primary_key=True)
  tag_name = db.Column(db.String(50),unique=True,nullable=False)

  circles = db.relationship('Circle', secondary=circle_tags, back_populates='tags', lazy='dynamic')

class Session(db.Model):
  __tablename__ = "sessions"
  session_id = db.Column(db.Integer,primary_key=True)
  user_id = db.Column(db.Integer,db.ForeignKey('users.user_id'),nullable=False)
  session_create_time = db.Column(db.DateTime,nullable=False)
  session_last_access_time = db.Column(db.DateTime,nullable=False)


circle_tags = db.Table('circle_tags',
    db.Column('circle_id', db.Integer, db.ForeignKey('circles.circle_id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('tags.tag_id'), primary_key=True)
)


if __name__ == '__main__':
  with app.app_context():
    db.create_all()
    print('DB作ったよ')







