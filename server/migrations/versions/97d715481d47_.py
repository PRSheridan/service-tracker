"""empty message

Revision ID: 97d715481d47
Revises: 
Create Date: 2024-10-17 11:04:16.232533

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '97d715481d47'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('queues',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=64), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('tags',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=32), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=64), nullable=False),
    sa.Column('email', sa.String(length=128), nullable=False),
    sa.Column('phone', sa.String(length=20), nullable=True),
    sa.Column('_password_hash', sa.String(length=128), nullable=False),
    sa.Column('role', sa.String(length=32), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('username')
    )
    op.create_table('tickets',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('requestor_id', sa.Integer(), nullable=False),
    sa.Column('date', sa.DateTime(), nullable=True),
    sa.Column('email', sa.String(length=128), nullable=False),
    sa.Column('phone', sa.String(length=20), nullable=True),
    sa.Column('title', sa.String(length=128), nullable=False),
    sa.Column('description', sa.Text(), nullable=False),
    sa.Column('priority', sa.String(length=32), nullable=False),
    sa.Column('status', sa.String(length=32), nullable=False),
    sa.ForeignKeyConstraint(['requestor_id'], ['users.id'], name=op.f('fk_tickets_requestor_id_users')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user_queues',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('queue_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['queue_id'], ['queues.id'], name=op.f('fk_user_queues_queue_id_queues')),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_user_queues_user_id_users')),
    sa.PrimaryKeyConstraint('user_id', 'queue_id')
    )
    op.create_table('comments',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('ticket_id', sa.Integer(), nullable=False),
    sa.Column('date', sa.DateTime(), nullable=True),
    sa.Column('content', sa.Text(), nullable=False),
    sa.ForeignKeyConstraint(['ticket_id'], ['tickets.id'], name=op.f('fk_comments_ticket_id_tickets')),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_comments_user_id_users')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('images',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('file_path', sa.String(), nullable=False),
    sa.Column('ticket_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['ticket_id'], ['tickets.id'], name=op.f('fk_images_ticket_id_tickets')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('ticket_queues',
    sa.Column('ticket_id', sa.Integer(), nullable=False),
    sa.Column('queue_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['queue_id'], ['queues.id'], name=op.f('fk_ticket_queues_queue_id_queues')),
    sa.ForeignKeyConstraint(['ticket_id'], ['tickets.id'], name=op.f('fk_ticket_queues_ticket_id_tickets')),
    sa.PrimaryKeyConstraint('ticket_id', 'queue_id')
    )
    op.create_table('ticket_tags',
    sa.Column('ticket_id', sa.Integer(), nullable=False),
    sa.Column('tag_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['tag_id'], ['tags.id'], name=op.f('fk_ticket_tags_tag_id_tags')),
    sa.ForeignKeyConstraint(['ticket_id'], ['tickets.id'], name=op.f('fk_ticket_tags_ticket_id_tickets')),
    sa.PrimaryKeyConstraint('ticket_id', 'tag_id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('ticket_tags')
    op.drop_table('ticket_queues')
    op.drop_table('images')
    op.drop_table('comments')
    op.drop_table('user_queues')
    op.drop_table('tickets')
    op.drop_table('users')
    op.drop_table('tags')
    op.drop_table('queues')
    # ### end Alembic commands ###
