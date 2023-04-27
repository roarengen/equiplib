import smtplib, ssl

tls_port = 587
port = 465
password = ""
email_address = ""
smtp_server = "smtp.gmail.com"

context = ssl.create_default_context()


def send_email(email: str, subject:str, content: str = "") -> None:
    with smtplib.SMTP_SSL(smtp_server, port, context=context) as server:
        server.login(email_address, password)
        server.sendmail(
            email_address,
            email,
            f"Subject: {subject} \n" + content
        )

if __name__ == "__main__":
    send_email("", "Hey!", "how you?")

