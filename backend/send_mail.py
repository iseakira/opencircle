import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.utils import formatdate

def send_auth_code(emailaddress, auth_code):
    #bodyがメールの本文。いい文章考えたらなおしとくれ。HTML形式でも可。
    body = "認証コード:{}".format(auth_code)
    msg = MIMEText(body, "plain", "utf-8")
    #送り元メールアドレスは後で変える(一旦今野の)。
    msg["From"] = "OpenCircleTUS@gmail.com"
    msg["To"] = emailaddress
    #タイトルもいいのあったら変えたいね。
    msg["Subject"] = "サークル情報サイトのアカウント作成に関するお知らせ"

    SMTP_SERVER = "smtp.gmail.com"
    SMTP_PORT = 587
    SENDER_EMAIL = "OpenCircleTUS@gmail.com"
    SENDER_PASSWORD = "bggr fcqj fote zmtz"
    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, emailaddress, msg.as_string())
        print("email sended")
    except Exception as e:
        print("mail failed error: {}".format(e))