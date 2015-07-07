from flask import Blueprint, render_template, abort
from flask import  session, redirect, url_for, request, flash
from wtforms import PasswordField, validators
from jinja2 import TemplateNotFound
from models.user import User
from models.userform import UserForm, UserFormUpdate
from models.database import db_session


users = Blueprint('users', __name__, template_folder='application/templates')

@users.route('/users', methods=['GET'])
def index():
    check_session()

    users = User.query.filter(User.status <> 0)

    try:
        return render_template('users/index.html', users=users)
    except TemplateNotFound:
        abort(404)

@users.route('/users/add', methods=['GET','POST'])
def add():
    check_session()

    form = UserForm(request.form)
    if request.method == "POST":
        if form.validate():
            u = User(form.username.data, form.password.data, form.email.data, form.firstname.data, form.lastname.data)
            db_session.add(u)
            db_session.commit()
            flash('Add user success')
            return redirect(url_for('users.index'))
        else:
            return render_template('users/add.html', form=form)
    else:
        try:
            return render_template('users/add.html', form=form)
        except TemplateNotFound:
            abort(404)

@users.route('/users/update/<id>', methods=['GET','POST'])
def update(id):
    check_session()

    if request.method == "POST":
        form = UserFormUpdate(request.form)

        if form.validate():
            user = User.query.filter_by(iduser=id).first()
            user.username = form.username.data
            user.firstname = form.firstname.data
            user.lastname = form.lastname.data
            user.email = form.email.data
            user.role = form.role.data
            user.status = form.status.data

            if form.password.data <> "":
                user.hash_password(form.password.data)

            db_session.commit()
            flash('Update user success')
            return redirect(url_for('users.index'))
        else:
            return render_template('users/update.html', form=form)
    else:
        user = User.query.filter_by(iduser=id).first()
        form = UserForm()
        form.iduser.data = user.iduser
        form.username.data = user.username
        form.firstname.data = user.firstname
        form.lastname.data = user.lastname
        form.email.data = user.email
        form.password.data = ""
        form.role.data = user.role
        form.status.data = user.status

        try:
            return render_template('users/update.html', form=form)
        except TemplateNotFound:
            abort(404)


@users.route('/users/delete/<id>', methods=['GET'])
def delete(id):
    check_session()

    user = User.query.filter_by(iduser=id).first()
    user.status = 0
    db_session.commit()
    return redirect(url_for('users.index'))

def check_session():
    if 'username' not in session:
        return redirect(url_for('auth.index'))
    user = User.query.filter_by(username=session["username"]).first()
    if user.role <> 1:
        abort(401)