from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.ext.associationproxy import association_proxy
import datetime

from config import db, bcrypt

# Models go here!
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    serialize_rules = ('-password', '-tickets.requestor', '-comments.user')

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    _password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(32), nullable=False)

    # relationships
    tickets = db.relationship('Ticket', back_populates='requestor')
    comments = db.relationship('Comment', back_populates='user')

    @hybrid_property
    def password_hash(self):
        raise AttributeError('Password hashes cannot be viewed.')

    @password_hash.setter
    def password_hash(self, password):
        print(f'Encrypting password: {self.username}')
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        print(f'Authenticating user: {self.username}')
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

    def __repr__(self):
        return f'<User {self.id, self.username}>'

class Ticket(db.Model, SerializerMixin):
    __tablename__ = 'tickets'
    serialize_rules = ('-requestor.tickets', '-comments.ticket', '-queue.tickets')

    id = db.Column(db.Integer, primary_key=True)
    requestor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    queue_id = db.Column(db.Integer, db.ForeignKey('queues.id'), nullable=False)

    date = db.Column(db.DateTime, default=datetime.date)
    email = db.Column(db.String(128), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    title = db.Column(db.String(128), nullable=False)
    description = db.Column(db.Text, nullable=False)
    priority = db.Column(db.String(32), nullable=False)
    status = db.Column(db.String(32), nullable=False)

    # relationships
    requestor = db.relationship('User', back_populates='tickets')
    tags = db.relationship('Tag', secondary='ticket_tags', back_populates='tickets')
    comments = db.relationship('Comment', back_populates='ticket')
    queue = db.relationship('Queue', back_populates='tickets')

class Comment(db.Model, SerializerMixin):
    __tablename__ = 'comments'
    serialize_rules = ('-user.comments', '-ticket.comments')

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    ticket_id = db.Column(db.Integer, db.ForeignKey('tickets.id'), nullable=False)

    date = db.Column(db.DateTime, default=datetime.date)
    content = db.Column(db.Text, nullable=False)

    # relationships
    user = db.relationship('User', back_populates='comments')
    ticket = db.relationship('Ticket', back_populates='comments')

class Queue(db.Model, SerializerMixin):
    __tablename__ = 'queues'
    serialize_rules = ('-tickets.queue', '-tags.queues')

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True, nullable=False)

    # relationships
    tickets = db.relationship('Ticket', back_populates='queue')
    tags = db.relationship('Tag', secondary='queue_tags', back_populates='queues')

class Tag(db.Model, SerializerMixin):
    __tablename__ = 'tags'
    serialize_rules = ('-tickets.tags', '-queues.tags')

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True, nullable=False)

    # relationships
    tickets = db.relationship('Ticket', secondary='ticket_tags', back_populates='tags')
    queues = db.relationship('Queue', secondary='queue_tags', back_populates='tags')

# Association tables
ticket_tags = db.Table('ticket_tags',
    db.Column('ticket_id', db.Integer, db.ForeignKey('tickets.id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('tags.id'), primary_key=True)
)

queue_tags = db.Table('queue_tags',
    db.Column('queue_id', db.Integer, db.ForeignKey('queues.id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('tags.id'), primary_key=True)
)