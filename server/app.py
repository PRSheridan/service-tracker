#!/usr/bin/env python3
import imghdr, uuid, os, io, zipfile
from flask import request, session, make_response, send_file
from flask_restful import Resource
from werkzeug.utils import secure_filename
from sqlalchemy import or_
import datetime

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
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        email = data.get('username')
        phone = data.get('password')
        role = "client"
        passwordConfirm = data.get('passwordConfirm')

        if password != passwordConfirm:
            return {'error': '401 Passwords do not match'}, 401

        try:
            user = User(
                username = username,
                email = email,
                phone = phone,
                role=role
            )
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
    
class Users(Resource):
    def get(self):
        users = User.query.all()
    
        return [user.to_dict() for user in users], 200
    
# UserByID : get, post, delete
class UserByID(Resource):
    def get(self, user_id):
        user = User.query.filter(User.id == user_id).one_or_none()
        if user is None:
            return {'error': 'User not found'}, 404
    
        return user.to_dict(), 200

    def put(self, user_id):
        user = User.query.filter(User.id == user_id).one_or_none()
        if user is None:
            return {'error': 'User not found'}, 404
        
        data = request.get_json()
        password = data.get('password')
        passwordConfirm = data.get('passwordConfirm')
        passwordCurrent = data.get('passwordCurrent')

        #if user.authenticate(passwordCurrent):
        #    return {'error': 'Incorrect current password'}, 401

        if password and password != passwordConfirm:
            return {'error': 'Passwords do not match'}, 401

        try:
            user.username = data.get('username', user.username)
            user.email = data.get('email', user.email)
            user.phone = data.get('phone', user.phone)
            
            if 'role' in data:
                if user.role != 'admin':
                    return {'error': 'Only admins can change roles'}, 403
                user.role = data.get('role', user.role)
            
            # Update password if provided
            #if password:
            #   user.password_hash = password
            
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
    def get(self):        
        user = User.query.filter(User.id == session['user_id']).one_or_none()
        if user is None:
            return {'error': 'User not found'}, 404
        
        queues = user.queues
        return [queue.to_dict() for queue in queues], 200

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
    
class UserTickets(Resource):
    def get(self):
        user = User.query.filter(User.id == session['user_id']).one_or_none()
        if user is None:
            return {'error': 'User not found'}, 404
        
        tickets = user.tickets
        return [ticket.to_dict() for ticket in tickets], 200

# Ticket : get, post
class Tickets(Resource):
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
        

class TicketBySearchQuery(Resource):
  def get(self):
    search_query = request.args.get('q', '').lower()

    if not search_query:
      return {"error": "Search query is required"}, 400

    query = Ticket.query.join(User).outerjoin(Ticket.tags)

    # Filtering based on the search query
    query = query.filter(
      db.or_(
        Ticket.id.cast(db.String).ilike(f'%{search_query}%'),
        Ticket.title.ilike(f'%{search_query}%'),
        User.username.ilike(f'%{search_query}%'),
        Tag.name.ilike(f'%{search_query}%')
      )
    )

    tickets = query.all()
    return [ticket.to_dict() for ticket in tickets], 200

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

# Queue : get, post
class Queues(Resource):
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
        
    def delete(self, ticket_id):
        queue_id = request.get_json()
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

# Tag : get, post
class Tags(Resource):
    def get(self):
        tags = Tag.query.all()
        return [tag.to_dict() for tag in tags], 200

    def post(self):
        data = request.get_json()
        print(data)
        print(data['name'])
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
    
class TagByTicketID(Resource):
    def post(self, ticket_id):
        data = request.get_json()

        tag = Tag.query.filter(Tag.name == data['name']).one_or_none()
        if tag is None:
            return {'error': 'Tag not found'}, 404
        
        ticket = Ticket.query.filter(Ticket.id == ticket_id).one_or_none()
        if ticket is None:
            return {'error': 'Ticket not found'}, 404
        
        try:
            ticket.tags.append(tag)
            db.session.commit()
            return '', 201

        except Exception as e:
            return {'error': str(e)}, 400
        
    def delete(self, ticket_id):
        tag_id = request.get_json()
        tag = Tag.query.filter(Tag.id == tag_id).one_or_none()
        if tag is None:
            return {'error': 'Tag not found'}, 404
        
        ticket = Ticket.query.filter(Ticket.id == ticket_id).one_or_none()
        if ticket is None:
            return {'error': 'Ticket not found'}, 404
        
        try:
            ticket.tags.remove(tag)
            db.session.commit()
            return '', 204
        
        except Exception as e:
            return {'error': str(e)}, 400

# Image : post
def validate_image(stream):
    header = stream.read(512)
    stream.seek(0)
    format = imghdr.what(None, header)
    if not format:
        return None
    return "." + (format if format != "jpeg" else "jpg")

class Images(Resource):
    def post(self):
        if 'image' not in request.files:
            return {"error": "No file part"}, 400

        image = request.files['image']  # Accessing the file from request.files
        ticket_id = request.form.get('ticket_id')  # Get the ticket_id from the form data

        if not image or image.filename == '':
            return {"error": "No selected file"}, 400

        filename = secure_filename(image.filename)
        if filename:         
            try:
                print(f"Saving image: {filename}")
                image.save(os.path.join(app.config["UPLOAD_PATH"], filename))
            except Exception as e:
                print(f"Error saving image: {e}")
                return {"error": "Error saving image"}, 500

            new_image = Image(
                file_path=filename,
                ticket_id=ticket_id
            )
            
            db.session.add(new_image)
            db.session.commit()
            return new_image.to_dict(), 201

        return {"error": "File type not supported"}, 400

# ImageByID : delete
class ImagesByTicketID(Resource):
    def get(self, ticket_id):
        images = Image.query.filter(Image.ticket_id == ticket_id).all()

        if not images:
            return {'error': 'No images found'}, 404

        memory_file = io.BytesIO()
        with zipfile.ZipFile(memory_file, 'w') as zf:
            for image in images:
                file_path = f"{app.config['UPLOAD_PATH']}/{image.file_path}"
                if os.path.exists(file_path):
                    zf.write(file_path, image.file_path)  # Add file to the zip using its relative path
                else:
                    return {'error': f'Image not found at {file_path}'}, 404

        memory_file.seek(0)

        return send_file(memory_file, download_name='images.zip', as_attachment=True)

    
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
api.add_resource(Users, '/users')
api.add_resource(UserByID, '/user/<int:user_id>')
api.add_resource(UserQueues, '/user/queues')
api.add_resource(UserQueueByID, '/user/queue/<int:queue_id>')
api.add_resource(UserTickets, '/user/tickets')
api.add_resource(Tickets, '/tickets')
api.add_resource(TicketByID, '/ticket/<int:ticket_id>')
api.add_resource(TicketBySearchQuery, '/tickets/search')
api.add_resource(CommentByID, '/comment/<int:comment_id>')
api.add_resource(CommentsByTicketID, '/tickets/<int:ticket_id>/comments')
api.add_resource(Queues, '/queues')
api.add_resource(QueueByID, '/queue/<int:queue_id>')
api.add_resource(QueueByTicketID, '/ticket/<int:ticket_id>/queue/')
api.add_resource(Tags, '/tags')
api.add_resource(TagByID, '/tag/<int:tag_id>')
api.add_resource(TagByTicketID, '/ticket/<int:ticket_id>/tag/')
api.add_resource(Images, '/image')
api.add_resource(ImagesByTicketID, '/images/<int:ticket_id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)

