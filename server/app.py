#!/usr/bin/env python3
import imghdr, uuid, os
from flask import request, session, make_response, send_from_directory
from flask_restful import Resource
from werkzeug.utils import secure_filename
import datetime

# Local imports
#https://medium.com/@brodiea19/flask-sqlalchemy-how-to-upload-photos-and-render-them-to-your-webpage-84aa549ab39e
#https://www.w3schools.com/react/react_usecontext.asp

from config import app, db, api
from models import User, Ticket, Comment, Queue, Tag, Image

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
        role = "client"
        passwordConfirm = json.get('passwordConfirm')

        if password != passwordConfirm:
            return {'error': '401 Passwords do not match'}, 401

        try:
            user = User(username = username, role=role)
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
        #password = json.get('password')
        user = User.query.filter(User.username == username).first()

        if user: #and user.authenticate(password):
            session['user_id'] = user.id
            return make_response(user.to_dict(), 200)
        
        return {'error': '401 Unauthorized login'}, 401
    
class Logout(Resource):
    def delete(self):
        if session['user_id']:
            session['user_id'] = ''
            return {}, 204
        
        return {'error':'401 Unable to process request'}, 401
    
class UserResource(Resource):
    def get(self):
        user = User.query.filter(User.id == session['user_id']).one_or_none()
        if user is None:
            return {'error': 'User not found'}, 404
    
        return user.to_dict(), 200
    
# UserByID : get, post, delete
class UserByID(Resource):
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
    
class UserQueues(Resource):
    def post(self):
        data = request.get_json()

        user = User.query.filter(User.id == session['user_id']).one_or_none()
        if user is None:
            return {'error': 'User not found'}, 404
        
        queue = Queue.query.filter(Queue.name == data['name']).one_or_none()
        if queue is None:
            return {'error': 'Queue not found'}, 404
        
        user.queues.append(queue)
        db.session.commit()
        return '', 201
    
class UserQueueByID(Resource):
    def delete(self, queue_id):
        user = User.query.filter(User.id == session['user_id']).one_or_none()
        if user is None:
            return {'error': 'User not found'}, 404
        
        queue = Queue.query.filter(Queue.id == queue_id).one_or_none()
        if queue is None:
            return {'error': 'Queue not found'}, 404
        
        user.queues.remove(queue)
        db.session.commit()
        return '', 201


# Ticket : get, post
class TicketIndex(Resource):
    def get(self):
        tickets = Ticket.query.all()
        return [ticket.to_dict() for ticket in tickets], 200

    def post(self):
        data = request.get_json()
        print(data)

        try:
            new_ticket = Ticket(
                requestor_id=User.query.filter(User.username == data['requestor']).first().id,
                date=datetime.datetime.utcnow(),
                email=data['email'],
                phone=data['phone'],
                title=data['title'],
                description=data['description'],
                priority=data['priority'],
                status='new'
            )
            new_ticket.queues.append(Queue.query.filter(Queue.name == data['queue']).first())

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

    def put(self, ticket_id):
        ticket = Ticket.query.filter(Ticket.id == ticket_id).one_or_none()
        if ticket is None:
            return {'error': 'Ticket not found'}, 404
        data = request.get_json()

        try:
            ticket.requestor_id = data.get('requestor_id', ticket.requestor_id)
            ticket.email = data.get('email', ticket.email)
            ticket.phone = data.get('phone', ticket.phone)
            ticket.title = data.get('title', ticket.title)
            ticket.description = data.get('description', ticket.description)
            ticket.priority = data.get('priority', ticket.priority)
            ticket.status = data.get('status', ticket.status)
            db.session.commit()
            return ticket.to_dict(), 200

        except Exception as e:
            print(str(e))  # Log the exception
            return {'error': str(e)}, 400

    def delete(self, ticket_id):
        ticket = Ticket.query.filter(Ticket.id == ticket_id).one_or_none()
        if ticket is None:
            return {'error': 'Ticket not found'}, 404
        
        db.session.delete(ticket)
        db.session.commit()
        return '', 204
    
# TicketByQueueID : get, post, delete
class TicketByQueueID(Resource):
    def get(self, queue_id):
        queue = Queue.query.filter(Queue.id == queue_id).one_or_none()
        if queue is None:
            return {'error': 'Queue not found'}, 404
        
        tickets = queue.tickets
        return [ticket.to_dict() for ticket in tickets], 200

    def post(self, queue_id):
        queue = Queue.query.filter(Queue.id == queue_id).one_or_none()
        if queue is None:
            return {'error': 'Queue not found'}, 404
        data = request.get_json()

        try:
            new_ticket = Ticket(
                requestor_id=data['requestor_id'],
                email=data['email'],
                phone=data.get('phone'),
                title=data['title'],
                description=data['description'],
                priority=data['priority'],
                status=data['status']
            )
            new_ticket.queues.append(queue)
            db.session.add(new_ticket)
            db.session.commit()
            return new_ticket.to_dict(), 201
        
        except Exception as e:
            return {'error': str(e)}, 400

    def delete(self, queue_id, ticket_id):
        queue = Queue.query.filter(Queue.id == queue_id).one_or_none()
        if queue is None:
            return {'error': 'Queue not found'}, 404
        
        ticket = Ticket.query.filter(Ticket.id == ticket_id).one_or_none()
        if ticket is None:
            return {'error': 'Ticket not found'}, 404
        
        try:
            ticket.queues.remove(queue)
            db.session.commit()
            return '', 204
        
        except Exception as e:
            return {'error': str(e)}, 400

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
    
class CommentsByTicketID(Resource):
    def get(self, ticket_id):
        comments = Ticket.query.filter(Ticket.id == ticket_id).first().comments
        if comments is None:
            return {'error': 'No comments found'}, 404
        
        return [comment.to_dict() for comment in comments], 200

    def post(self, ticket_id):
        data = request.get_json()

        try:
            new_comment = Comment(
                content=data['content'],
                user_id=session['user_id'],
                ticket_id=ticket_id,
            )

            db.session.add(new_comment)
            db.session.commit()
            return new_comment.to_dict(), 201  
         
        except Exception as e:
            return {'error': str(e)}, 400


class QueueByTicketID(Resource):
    def post(self, ticket_id):
        data = request.get_json()

        queue = Queue.query.filter(Queue.name == data['name']).one_or_none()
        if queue is None:
            return {'error': 'Queue not found'}, 404
        
        ticket = Ticket.query.filter(Ticket.id == ticket_id).one_or_none()
        if ticket is None:
            return {'error': 'Ticket not found'}, 404
        
        try:
            ticket.queues.append(queue)
            db.session.commit()
            return '', 201

        except Exception as e:
            return {'error': str(e)}, 400
        

class QueueIDByTicketID(Resource):
    def delete(self, ticket_id, queue_id):
        queue = Queue.query.filter(Queue.id == queue_id).one_or_none()
        if queue is None:
            return {'error': 'Queue not found'}, 404
        
        ticket = Ticket.query.filter(Ticket.id == ticket_id).one_or_none()
        if ticket is None:
            return {'error': 'Ticket not found'}, 404
        
        try:
            ticket.queues.remove(queue)
            db.session.commit()
            return '', 204
        
        except Exception as e:
            return {'error': str(e)}, 400

# Queue : get, post
class QueueIndex(Resource):
    def get(self):
        queues = [queue.name for queue in Queue.query.all()]
        return queues, 200

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

# QueueByUserID : get
class QueueByUserID(Resource):
    def get(self):
        user_id = session.get('user_id')
        if not user_id:
            return {'error': 'User not logged in'}, 401
        user = User.query.filter(User.id == user_id).one_or_none()
        if user is None:
            return {'error': 'User not found'}, 404
        queues = user.queues
        return [queue.to_dict() for queue in queues], 200

# Tag : get, post
class TagIndex(Resource):
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

class ImageIndex(Resource):
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
api.add_resource(Logout, '/logout')

api.add_resource(UserResource, '/user')
api.add_resource(UserByID, '/user/<int:user_id>')
api.add_resource(UserQueues, '/user/queues')
api.add_resource(UserQueueByID, '/user/queue/<int:queue_id>')

api.add_resource(TicketIndex, '/ticket')
api.add_resource(TicketByID, '/ticket/<int:ticket_id>')

api.add_resource(CommentByID, '/comment/<int:comment_id>')
api.add_resource(CommentsByTicketID, '/tickets/<int:ticket_id>/comments')

api.add_resource(QueueByTicketID, '/ticket/<int:ticket_id>/queue/')
api.add_resource(QueueIDByTicketID, '/ticket/<int:ticket_id>/queue/<int:queue_id>')
api.add_resource(QueueIndex, '/queues')
api.add_resource(QueueByID, '/queue/<int:queue_id>')
api.add_resource(QueueByUserID, '/user/queues')

api.add_resource(TagIndex, '/tag')
api.add_resource(TagByID, '/tag/<int:tag_id>')

api.add_resource(ImageIndex, '/image')
api.add_resource(ImageByID, '/image/<int:image_id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)

