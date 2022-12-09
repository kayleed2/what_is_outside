#!/usr/bin/python3
"""App.py application module"""
import pymysql
import json
from auth import Auth
from flask import Flask, render_template, jsonify, request
from flask_mysqldb import MySQL, MySQLdb

app = Flask(__name__)
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_DB'] = 'what_is_outside'

mysql = MySQL(app)
AUTH = Auth()


@app.route("/", methods=['GET', 'POST', 'PUT'])
def home():
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT episode, title FROM main_data")
    rows = cursor.fetchall()
    episodes = []
    content = {}
    for result in rows:
        content = {'episode': result['episode'], 'title': result['title']}
        episodes.append(content)
    if episodes == []:
        episodes = {'Error': "No episodes"}
    return jsonify(episodes)

@app.route("/month=<month>", methods=['GET', 'POST', 'PUT'])
def month(month):
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT episode, title FROM main_data where date = %s", [month])
    rows = cursor.fetchall()
    episodes = []
    content = {}
    for result in rows:
        content = {'episode': result['episode'], 'title': result['title']}
        episodes.append(content)
    if episodes == []:
        episodes = {'Error': "No episode made in {}".format(month)}
    return jsonify(episodes)


@app.route("/filter", methods=['GET', 'POST', 'PUT'])
def filter():

    req = request.args.to_dict(flat=False)
    print(req)

# http://0.0.0.0:8000/filter?match=True&months=january&months=july&colors=Bright_Red&subjects=bushes

    monthQuery = ''
    if req.get('months'):
        months = req.get('months')

    colorQuery = ''
    if req.get('colors'):
        colors = req.get('colors')

    subjectQuery = ''
    if req.get('subjects'):
        subjects = req.get('subjects')

    match = "AND"
    if req.get('match'):
        if req.get('match') == False:
            match = "OR"

    sql = "SELECT title, episode, date, colors"

    if subjects:
        for sub in subjects:
            sql += f', {sub}'
            subjectQuery += f' {match} {sub}=1'

    sql += " FROM main_data"

    if subjects or months or colors:
        sql += " WHERE title IS NOT NULL"

    if colors:
        for color in colors:
            colorQuery += f" {match} {color}=1"

    if months:
        monthQuery = " AND month IN ("
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
        content = {'episode': result['episode'], 'title': result['title'], 'date': result['date']}
        episodes.append(content)
    if episodes == []:
        episodes = {'Error': "No episode made in {}".format(month)}
    return jsonify(episodes)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
