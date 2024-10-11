#!/usr/bin/env python3

# Standard library imports
from random import sample, choice, randint

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Ticket, Queue, Comment

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")

        # Clear existing data
        User.query.delete()
        Ticket.query.delete()
        Queue.query.delete()
        Comment.query.delete()

        # Create queues
        queues = []
        for _ in range(5):
            queue = Queue(
                name=fake.word()
            )
            queues.append(queue)
            db.session.add(queue)

        # Create users
        users = []
        for _ in range(3):
            user = User(
                username=fake.user_name(),
                email=fake.email(),
                phone=fake.phone_number(),
                _password_hash="test",  # Assigning password directly
                role=choice(['client', 'admin'])
            )
            user.queues = sample(queues, k=randint(1, 3))
            users.append(user)
            db.session.add(user)

        db.session.commit()

        # Create tickets
        for _ in range(20):
            ticket = Ticket(
                requestor=choice(users),
                date=fake.date_time_this_year(),
                email=fake.email(),
                phone=fake.phone_number(),
                title=fake.sentence(),
                description=fake.text(),
                priority=choice(['low', 'medium', 'high']),
                status=choice(['new', 'in-progress', 'closed'])
            )
            ticket.queues = sample(queues, k=randint(1, 3))
            db.session.add(ticket)

            db.session.commit()

            # Add 1-3 comments for each ticket
            for _ in range(randint(1, 3)):
                comment = Comment(
                    content=fake.text(),
                    ticket_id=ticket.id,  # Associate the comment with the ticket
                    user_id=choice(users).id  # Ensure user_id is correctly assigned
                )
                db.session.add(comment)

        # Commit changes
        db.session.commit()

        print("Seeding complete!")


