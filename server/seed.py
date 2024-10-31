#!/usr/bin/env python3

# Standard library imports
from random import sample, choice, randint

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Ticket, Queue, Tag

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting ticket seeding...")

        # Fetch existing users, queues, and tags from the database
        users = User.query.filter(User.username.in_(['client1', 'client2', 'client3', 'sheridan'])).all()
        queues = Queue.query.all()
        tags = Tag.query.all()

        # Clear existing tickets
        Ticket.query.delete()
        db.session.commit()

        # Create tickets
        for _ in range(20):
            ticket = Ticket(
                requestor=choice(users),
                date=fake.date_time_this_year(),
                title=fake.sentence(),
                description=fake.text(),
                priority=choice(['low', 'medium', 'high']),
                status=choice(['new', 'in-progress', 'closed']),
                email=fake.email(),              # Add fake email
                phone=fake.phone_number()         # Add fake phone number
            )
            ticket.queues = [choice(queues)]  # Assign one queue to each ticket
            ticket.tags = sample(tags, k=randint(1, 3))  # Assign 1-3 tags
            db.session.add(ticket)

        # Commit changes
        db.session.commit()

        print("Ticket seeding complete!")





