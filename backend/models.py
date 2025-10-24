from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os

db = SQLAlchemy()

## circlesとtagsの多対多の関係を定義する中間テーブル
circle_tag_table = db.Table('circle_tag',
  db.Column('circle_id',db.Integer,db.ForeignKey('circles.circle_id'),primary_key=True),
  db.Column('tag_id',db.Integer,db.ForeignKey('tags.tag_id'),primary_key=True)
)




class Circle(db.Model):
  __tablename__="circles"
  circle_id = db.Column(db.Integer,primary_key=True,autoincrement=True)
  circle_name = db.Column(db.String(100),nullable=False)
  circle_description=db.Column(db.Text,nullable=False)
  circle_fee=db.Column(db.Integer,nullable=True)
  number_of_male = db.Column(db.Integer,nullable=True,default=0)
  number_of_female=db.Column(db.Integer,nullable=True,default=0)
  circle_icon_path=db.Column(db.String(255),nullable=True)

  ## TagモデルとCircleモデルの多対多のリレーションシップ
  tags = db.relationship('Tag', secondary='circle_tag', backref=db.backref('circles', lazy=True))

class User(db.Model):
  __tablename__ = "users"
  user_id = db.Column(db.Integer,primary_key=True)
  user_name = db.Column(db.String(80),nullable=False)
  mail_adress = db.Column(db.String(255),unique=True,nullable=False)
  password = db.Column(db.String(255), nullable=False)


class Tag(db.Model):
  __tablename__ = "tags"
  tag_id = db.Column(db.Integer,primary_key=True)
  tag_name = db.Column(db.String(50),unique=True,nullable=False)

  ## CircleモデルとTagモデルの多対多のリレーションシップ
  circles = db.relationship('Circle', secondary='circle_tag', backref=db.backref('tags', lazy=True))


class AccountCreate(db.Model):
  __tablename__ = "account_creates"
  tmp_id = db.Column(db.Integer,primary_key=True)
  auth_code = db.Column(db.String(100),nullable=False)
  account_expire_time = db.Column(db.DateTime,nullable=False)
  account_create_time = db.Column(db.DateTime,nullable=False)
  attempt_count = db.Column(db.Integer,nullable=False,default=0)

 
class Session(db.Model):
  __tablename__ = "sessions"
  session_id = db.Column(db.Integer,primary_key=True)
  user_id = db.Column(db.Integer,db.ForeignKey('users.user_id'),nullable=False)
  session_create_time = db.Column(db.DateTime,nullable=False)
  session_last_access_time = db.Column(db.DateTime,nullable=False)

  ## Userモデルとセッションのリレーションシップ
  user = db.relationship('User', backref=db.backref('sessions', lazy=True))
  sessions = db.relationship('Session', backref='user', lazy=True)

class EditAuthorization(db.Model):
    __tablename__ = "edit_authorizations"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)
    circle_id = db.Column(db.Integer, db.ForeignKey("circles.circle_id"), nullable=False)
    role = db.Column(db.String(50), nullable=True)
    user = db.relationship("User", backref="edit_authorizations")
    circle = db.relationship("Circle", backref="edit_authorizations")




# if __name__ == '__main__':
#   with app.app_context():
#     db.create_all()
#      print('DB作ったよ')







