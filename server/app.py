#!/usr/bin/env python3
import imghdr, uuid, os
from flask import request, session, make_response, send_from_directory
from flask_restful import Resource
from werkzeug.utils import secure_filename

# Local imports
#https://medium.com/@brodiea19/flask-sqlalchemy-how-to-upload-photos-and-render-them-to-your-webpage-84aa549ab39e
#https://www.w3schools.com/react/react_usecontext.asp

from config import app, db, api
from models import User, Ticket, Comment, Queue, Tag

@app.route('/')
def index():
    return '<h1>service-tracker-server</h1>'

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

class Signup(Resource):
    def post(self):
        json = request.get_json()
        username = json.get('username')
        password = json.get('password')
        passwordConfirm = json.get('passwordConfirm')

        if password != passwordConfirm:
            return {'error': '401 Passwords do not match'}, 401

        try:
            user = User(username = username)
            user.password_hash = password

            db.session.add(user)
            db.session.commit()
            session['user_id'] = user.id
            return user.to_dict(), 201
        
        except Exception as e:
            return {'error': str(e)}, 402
        
class Login(Resource):
    def post(self):
        json = request.get_json()
        username = json.get('username')
        password = json.get('password')
        user = User.query.filter(User.username == username).first()

        if user and user.authenticate(password):
            session['user_id'] = user.id
            return make_response(user.to_dict(), 200)
        
        return {'error': '401 Unauthorized login'}, 401
    
# User : post
class User(Resource):
    def post(self):
        data = request.get_json()

        try:
            new_user = User(username=data['username'], role=data['role'])
            new_user.password_hash = data['password']
            db.session.add(new_user)
            db.session.commit()
            return new_user.to_dict(), 201
        
        except Exception as e:
            return {'error': str(e)}, 400

# UserByID : get, post, delete
class UserByID(Resource):
    def get(self, user_id):
        user = User.query.filter(User.id == user_id).one_or_none()
        if user is None:
            return {'error': 'User not found'}, 404
        
        return user.to_dict(), 200

    def post(self, user_id):
        user = User.query.filter(User.id == user_id).one_or_none()
        if user is None:
            return {'error': 'User not found'}, 404
        data = request.get_json()

        try:
            user.username = data.get('username', user.username)
            user.role = data.get('role', user.role)
            if 'password' in data:
                user.password_hash = data['password']
            db.session.commit()
            return user.to_dict(), 200
        
        except Exception as e:
            return {'error': str(e)}, 400

    def delete(self, user_id):
        user = User.query.filter(User.id == user_id).one_or_none()
        if user is None:
            return {'error': 'User not found'}, 404
        
        db.session.delete(user)
        db.session.commit()

        return '', 204

# Ticket : get, post
class Ticket(Resource):
    def get(self):
        tickets = Ticket.query.all()
        return [ticket.to_dict() for ticket in tickets], 200

    def post(self):
        data = request.get_json()

        try:
            new_ticket = Ticket(
                requestor_id=data['requestor_id'],
                queue_id=data['queue_id'],
                email=data['email'],
                phone=data.get('phone'),
                title=data['title'],
                description=data['description'],
                priority=data['priority'],
                status=data['status']
            )
            db.session.add(new_ticket)
            db.session.commit()
            return new_ticket.to_dict(), 201
        
        except Exception as e:
            return {'error': str(e)}, 400

# TicketByID : get, post, delete
class TicketByID(Resource):
    def get(self, ticket_id):
        ticket = Ticket.query.filter(Ticket.id == ticket_id).one_or_none()
        if ticket is None:
            return {'error': 'Ticket not found'}, 404
        
        return ticket.to_dict(), 200

    def post(self, ticket_id):
        ticket = Ticket.query.filter(Ticket.id == ticket_id).one_or_none()
        if ticket is None:
            return {'error': 'Ticket not found'}, 404
        data = request.get_json()

        try:
            ticket.queue_id = data.get('queue_id', ticket.queue_id)
            ticket.email = data.get('email', ticket.email)
            ticket.phone = data.get('phone', ticket.phone)
            ticket.title = data.get('title', ticket.title)
            ticket.description = data.get('description', ticket.description)
            ticket.priority = data.get('priority', ticket.priority)
            ticket.status = data.get('status', ticket.status)
            db.session.commit()
            return ticket.to_dict(), 200
        
        except Exception as e:
            return {'error': str(e)}, 400

    def delete(self, ticket_id):
        ticket = Ticket.query.filter(Ticket.id == ticket_id).one_or_none()
        if ticket is None:
            return {'error': 'Ticket not found'}, 404
        
        db.session.delete(ticket)
        db.session.commit()
        return '', 204

# CommentByID : post, delete
class CommentByID(Resource):
    def post(self, comment_id):
        comment = Comment.query.filter(Comment.id == comment_id).one_or_none()
        if comment is None:
            return {'error': 'Comment not found'}, 404
        data = request.get_json()

        try:
            comment.content = data.get('content', comment.content)
            db.session.commit()
            return comment.to_dict(), 200
        
        except Exception as e:
            return {'error': str(e)}, 400

    def delete(self, comment_id):
        comment = Comment.query.filter(Comment.id == comment_id).one_or_none()
        if comment is None:
            return {'error': 'Comment not found'}, 404
        
        db.session.delete(comment)
        db.session.commit()
        return '', 204

# Queue : get, post
class Queue(Resource):
    def get(self):
        queues = Queue.query.all()
        return [queue.to_dict() for queue in queues], 200

    def post(self):
        data = request.get_json()
        try:
            new_queue = Queue(name=data['name'])
            db.session.add(new_queue)
            db.session.commit()
            return new_queue.to_dict(), 201
        
        except Exception as e:
            return {'error': str(e)}, 400

# QueueByID : get, post, delete
class QueueByID(Resource):
    def get(self, queue_id):
        queue = Queue.query.filter(Queue.id == queue_id).one_or_none()
        if queue is None:
            return {'error': 'Queue not found'}, 404
        
        return queue.to_dict(), 200

    def post(self, queue_id):
        queue = Queue.query.filter(Queue.id == queue_id).one_or_none()
        if queue is None:
            return {'error': 'Queue not found'}, 404
        data = request.get_json()

        try:
            queue.name = data.get('name', queue.name)
            db.session.commit()
            return queue.to_dict(), 200
        
        except Exception as e:
            return {'error': str(e)}, 400

    def delete(self, queue_id):
        queue = Queue.query.filter(Queue.id == queue_id).one_or_none()
        if queue is None:
            return {'error': 'Queue not found'}, 404
        
        db.session.delete(queue)
        db.session.commit()
        return '', 204

# Tag : get, post
class Tag(Resource):
    def get(self):
        tags = Tag.query.all()
        return [tag.to_dict() for tag in tags], 200

    def post(self):
        data = request.get_json()

        try:
            new_tag = Tag(name=data['name'])
            db.session.add(new_tag)
            db.session.commit()
            return new_tag.to_dict(), 201
        
        except Exception as e:
            return {'error': str(e)}, 400

# TagByID : delete
class TagByID(Resource):
    def delete(self, tag_id):
        tag = Tag.query.filter(Tag.id == tag_id).one_or_none()
        if tag is None:
            return {'error': 'Tag not found'}, 404
        
        db.session.delete(tag)
        db.session.commit()
        return '', 204

# Image : post
#https://medium.com/@brodiea19/flask-sqlalchemy-how-to-upload-photos-and-render-them-to-your-webpage-84aa549ab39e
def validate_image(stream):
    header = stream.read(512)
    stream.seek(0)
    format = imghdr.what(None, header)
    if not format:
        return None
    return "." + (format if format != "jpeg" else "jpg")

class Image(Resource):
    def post(self):
        data = request.get_json()
        info = request.form.get("info")
        image_name = request.form.get("image_name")
        image = request.files.get("image")

        try:
            if secure_filename(image.filename) in [
                img.file_path for img in Image.query.all()
            ]:
                unique_str = str(uuid.uuid4())[:8]
                image.filename = f"{unique_str}_{image.filename}"
                
            filename = secure_filename(image.filename)
            if filename:
                file_ext = os.path.splitext(filename)[1]
                if file_ext not in app.config[
                    "UPLOAD_EXTENSIONS"
                ] or file_ext != validate_image(image.stream):
                    return {"error": "File type not supported"}, 400

                image.save(os.path.join(app.config["UPLOAD_PATH"], filename))

            new_image = Image(
                name=data['name'],
                file_path=data['file_path'],
                ticket_id=data['ticket_id']
            )
            db.session.add(new_image)
            db.session.commit()
            return new_image.to_dict(), 201
        
        except Exception as e:
            return {'error': str(e)}, 400

# ImageByID : delete
class ImageByID(Resource):
    def get(self, image_id):
        image = Image.query.filter(Image.id == image_id).one_or_none()
        path = image.file_path
        if image is None:
            return {'error': 'Image not found'}, 404
        
        return send_from_directory(app.config["UPLOAD_PATH"], path)
    
    def delete(self, image_id):
        image = Image.query.filter(Image.id == image_id).one_or_none()
        path = image.file_path
        if image is None:
            return {'error': 'Image not found'}, 404
        
        os.remove(os.path.join(path, image.filename))
        
        db.session.delete(image)
        db.session.commit()
        return '', 204

api.add_resource(CheckSession, '/check_session')
api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
api.add_resource(User, '/user')
api.add_resource(UserByID, '/user/<int:user_id>')
api.add_resource(Ticket, '/ticket')
api.add_resource(TicketByID, '/ticket/<int:ticket_id>')
api.add_resource(CommentByID, '/comment/<int:comment_id>')
api.add_resource(Queue, '/queue')
api.add_resource(QueueByID, '/queue/<int:queue_id>')
api.add_resource(Tag, '/tag')
api.add_resource(TagByID, '/tag/<int:tag_id>')
api.add_resource(Image, '/image')
api.add_resource(ImageByID, '/image/<int:image_id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)

