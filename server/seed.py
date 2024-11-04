#!/usr/bin/env python3

# Standard library imports
from random import sample, choice, randint
from faker import Faker

# Local imports
from app import app
from models import db, Ticket, Queue, Tag, Comment, User  # Ensure User is imported

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")

        # Clear existing tickets, queues, tags, and comments
        Ticket.query.delete()
        Queue.query.delete()
        Tag.query.delete()
        Comment.query.delete()

        # Create specified queues
        queue_names = ["Networking", "AV Services", "Help Desk", "Software Development", "Accounts"]
        queues = [Queue(name=name) for name in queue_names]
        db.session.add_all(queues)

        # Create specified tags
        tag_names = [
            "laptop", "desktop", "wired", "wireless", "front-end", "back-end", "new-user",
            "admin", "client", "software", "peripheral", "hardware"
        ]
        tags = [Tag(name=name) for name in tag_names]
        db.session.add_all(tags)

        db.session.commit()

        # Retrieve existing users
        users = [user for user in User.query.all() if user.username in ['client1', 'client2', 'client3', 'sheridan']]
        if not users:
            print("No existing users found with usernames: client1, client2, client3, sheridan")

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
            ticket.queues = sample(queues, k=1)
            ticket.tags = sample(tags, k=randint(1, 5))  # Assign 1-5 random tags
            
            # Commit ticket first to assign an ID
            db.session.add(ticket)
            db.session.commit()

            # Add 1-3 comments per ticket after committing
            for _ in range(randint(1, 3)):
                comment = Comment(
                    content=fake.text(),
                    ticket_id=ticket.id,
                    user_id=choice(users).id
                )
                db.session.add(comment)

        # Commit all comments at once
        db.session.commit()

        print("Seeding complete!")

