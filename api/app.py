#!/usr/bin/python3
"""App.py application module"""
import pymysql
import json
from flask import Flask, render_template, jsonify
from flask_mysqldb import MySQL, MySQLdb

app = Flask(__name__)
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'joy_of_painting'

mysql = MySQL(app)


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

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
