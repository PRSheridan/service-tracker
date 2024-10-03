#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session, make_response, send_from_directory
from flask_restful import Resource

# Local imports
#https://medium.com/@brodiea19/flask-sqlalchemy-how-to-upload-photos-and-render-them-to-your-webpage-84aa549ab39e
import imghdr, uuid
from config import app, db, api, os
from models import User, Ticket, Comment, Queue, Tag
# Add your model imports


# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

def validate_image(stream):
    header = stream.read(512)
    stream.seek(0)
    format = imghdr.what(None, header)
    if not format:
        return None
    return "." + (format if format != "jpeg" else "jpg")

class CheckSession(Resource):
    def get(self):
        if session['user_id']:
            user = User.query.filter(User.id == session['user_id']).first().to_dict()
            return user, 200
        return {'error': '401 Unauthorized Request'}, 401
    

if __name__ == '__main__':
    app.run(port=5555, debug=True)

