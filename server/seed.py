#!/usr/bin/env python3

# Standard library imports
from random import sample, choice, randint

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Ticket, Queue

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")

        # Clear existing data
        User.query.delete()
        Ticket.query.delete()
        Queue.query.delete()

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
                _password_hash="test",  # Assigning password directly
                role=choice(['admin', 'user'])
            )
            user.queues = sample(queues, k=randint(1, 3))
            users.append(user)
            db.session.add(user)

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
                status=choice(['open', 'closed', 'in progress'])
            )
            ticket.queues = sample(queues, k=randint(1, 3))
            db.session.add(ticket)

        # Commit changes
        db.session.commit()

        print("Seeding complete!")


