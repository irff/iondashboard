from wtforms import Form, IntegerField, StringField, PasswordField, validators

class UserForm(Form):
    username = StringField('Username', [validators.Length(min=4, max=25)])
    email = StringField('Email Address', [validators.Length(min=6, max=50)])
    firstname = StringField('First Name', [validators.Length(min=2, max=50)])
    lastname = StringField('Last Name', [validators.Length(min=2, max=50)])
    role = IntegerField('Role')
    status = IntegerField('Status')
    iduser = IntegerField('ID')
    password = PasswordField('New Password', [
        validators.required(),
        validators.EqualTo('repeat_password', message='Passwords must match')
    ])
    repeat_password = PasswordField('Repeat Password')


class UserFormUpdate(Form):
    username = StringField('Username', [validators.Length(min=4, max=25)])
    email = StringField('Email Address', [validators.Length(min=6, max=50)])
    firstname = StringField('First Name', [validators.Length(min=2, max=50)])
    lastname = StringField('Last Name', [validators.Length(min=2, max=50)])
    role = IntegerField('Role')
    status = IntegerField('Status')
    iduser = IntegerField('ID')
    password = PasswordField('New Password', [
        validators.EqualTo('repeat_password', message='Passwords must match')
    ])
    repeat_password = PasswordField('Repeat Password')