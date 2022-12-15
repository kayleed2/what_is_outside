#!/usr/bin/python3
"""App.py application module"""
import pymysql
import json
from auth import Auth
from flask import Flask, render_template, jsonify, request, abort
from flask_cors import CORS
from flask_mysqldb import MySQL, MySQLdb
from flask_socketio import SocketIO


app = Flask(__name__, static_url_path='/templates')

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_DB'] = 'what_is_outside'

cors = CORS(app, resources={r"/*":{"origins":"*"}})
socketio = SocketIO(app)

mysql = MySQL(app)
AUTH = Auth()


@app.route('/home', methods=['GET', 'POST'])
def home():
    """Route for users"""
    return render_template('./anotha-home.html')

@app.route('/users', methods=['POST'])
def users():
    """Route for users"""
    email = request.form.get('email')
    pwd = request.form.get('password')
    try:
        AUTH.register_user(email, pwd)
        return jsonify({'email': email, 'message': 'user created'})
    except ValueError:
        if (AUTH.valid_login(email=email, password=pwd)):
            return jsonify({'message': 'email already registered'}), 400        


@app.route('/sessions', methods=['POST'])
def login():
    """User logs in"""
    email = request.form.get('email')
    pwd = request.form.get('password')

    if not email or not pwd:
        abort(401)
    if not (AUTH.valid_login(email=email, password=pwd)):
        abort(401)
    session_id = AUTH.create_session(email)
    response = jsonify({"email": email, "message": "logged in"})
    response.set_cookie("session_id", session_id)
    return response


@app.route("/filter", methods=['GET', 'POST', 'PUT'])
def filter():

    req = request.args.to_dict(flat=False)

# http://0.0.0.0:8000/filter?match=True&months=january&months=july&colors=Bright_Red&subjects=bushes

    monthQuery = ''
    months = None
    if req.get('months'):
        months = req.get('months')

    colorQuery = ''
    colors = None
    if req.get('colors'):
        colors = req.get('colors')

    subjectQuery = ''
    subjects = None
    if req.get('subjects'):
        subjects = req.get('subjects')

    match = "AND"
    if req.get('match'):
        if req.get('match')[0] == 'False':
            match = "OR"

    sql = "SELECT m.title, m.episode, m.date, m.img_src, m.youtube_src, c.colors"

    if subjects:
        for sub in subjects:
            sql += f', m.{sub}'
            subjectQuery += f' {match} m.{sub}=1'

    sql += " FROM main_data AS m JOIN color_elements AS c on title = c.painting_title"

    if subjects or months or colors:
        sql += " WHERE title IS NOT NULL"

    if colors:
        for color in colors:
            colorQuery += f" {match} m.{color}=1"

    if months:
        monthQuery = f" {match} m.date IN ("
        for i in range(len(months)):
            monthQuery += f"'{months[i]}'"
            if i != len(months) - 1:
                monthQuery += ", "
        monthQuery += ")"

    sql += f"{monthQuery} {colorQuery} {subjectQuery}"

    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute(sql)
    rows = cursor.fetchall()
    episodes = []
    content = {}
    for result in rows:
        content = {'episode': result['episode'], 'title': result['title'], 'date': result['date'],
                   'colors': result['colors'], 'img_src': result['img_src'], 'youtube_src': result['youtube_src']}
        episodes.append(content)
    return jsonify(episodes)

if __name__ == "__main__":
    socketio.run(app, host='localhost', port=8000)
    # app.run(host="0.0.0.0", port=8000, debug=True)
