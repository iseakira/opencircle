from smtplib import SMTP
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.utils import formatdate

def send_auth_code(mailaddress, auth_code):
    #bodyがメールの本文。いい文章考えたらなおしとくれ。HTML形式でも可。
    body = "認証コード:{}".format(auth_code)
    msg = MIMEText(body, "plain", "utf-8")
    #送り元メールアドレスは後で変える(一旦今野の)。
    msg["From"] = "6323044@ed.tus.ac.jp"
    msg["To"] = mailaddress
    #タイトルもいいのあったら変えたいね。
    msg["Subject"] = "サークル情報サイトのアカウント作成に関するお知らせ"

    