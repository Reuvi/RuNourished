import os
from datetime import datetime
import re
from flask import Flask, flash, redirect, render_template, request, session, jsonify, make_response
from tempfile import mkdtemp
from datetime import date

def change_date_format(dt):
        return re.sub(r'(\d{4})-(\d{1,2})-(\d{1,2})', '\\3/\\2/\\1', dt)
        
# Configure application
app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Ensure responses aren't cached
@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

@app.route("/")
def index():
    a = 2 + 3
    return f"<p>2 + 3 is {a}</p>"

