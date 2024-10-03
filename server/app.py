#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import make_response, request, session
from flask_restful import Resource

# Local imports
from config import app, db, api
from models import User, Ticket, Comment, Queue, Tag
# Add your model imports


# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'


class CheckSession(Resource):
    def get(self):
        if session['user_id']:
            user = User.query.filter(User.id == session['user_id']).first().to_dict()
            return user, 200
        return {'error': '401 Unauthorized Request'}, 401
    

if __name__ == '__main__':
    app.run(port=5555, debug=True)

