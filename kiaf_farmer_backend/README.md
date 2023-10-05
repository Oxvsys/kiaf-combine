# KIAF Backend Source Code

## Run this project on a local machine

* Clone this repository
  * `git clone <repository-url>`

## Commands
* pip install -r requirements.txt
* python build.py
* python manage.py makemigrations
* python manage.py migrate
* python manage.py createsuperuser
* python manage.py runserver
* python manage.py collectstatic
* python manage.py startapp <appname> (optional)

## Deploy at server
* ssh-agent bash -c 'ssh-add ~/.ssh/id_ed25519; git pull'