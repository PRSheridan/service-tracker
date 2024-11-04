# Service Tracker:

Service Tracker is a full-stack CRM application used to manage user ticket requests in an organized and inviting interface. Client users can submit tickets, add images and comments, and view their previously submitted tickets. Admins have the ability to search, make changes to tickets, manage ticket queues, and tags, and create new queues and tags. Both types of users have a profile where they can update their personal information and change their authenticated passwords. 

This project integrates the following features:
- A React frontend for easy, intuitive navigation.
- A Flask REST API for backend data management, and organization.
- Secure authenticated logins.

## Login
![login](https://github.com/user-attachments/assets/3fd91295-c4b2-4d17-983e-c7f5baa8bbf3)


## Search
![search](https://github.com/user-attachments/assets/a92aaa84-2b14-4714-a065-a3276b75c847)


## Image
![1c332738-0909-4442-99d3-fafdc871ae32](https://github.com/user-attachments/assets/7fd145bd-b092-44ae-af35-b97964b3d20d)


## Admin
![admin](https://github.com/user-attachments/assets/82694ab6-df28-417e-aa54-847f3b2998ea)


## Technologies Used:

### Frontend

- **Next.js**: A React framework for building fast, server-side-rendered applications.
- **Formik**: A React library for managing forms.
- **JSZip**: A javascript library for creating, reading and editing .zip files

### Backend

- **Flask**: Python micro-framework used to build RESTful APIs.
- **SQLAlchemy**: ORM (Object Relational Mapper) for database management.
- **Flask-RESTful**: Flask extension for creating REST APIs.
- **Flask-Bcrypt**: For password hashing.
- **Flask-Migrate**: For handling database migrations.

## Setup

1. Clone the repository
`git clone https://github.com/PRSheridan/DayList/`

2. Create a virtual environment and install dependencies:
`pipenv install`
`pipenv shell`

3. Run the Flask server from the server directory (`cd server`):
`python app.py`

The backend server should now be running on http://localhost:5555.

4. Install dependencies:
`npm install --prefix client`

5. Run the React application:
`npm start --prefix client`

The frontend should now be running on http://localhost:4000.

6. Initialize and upgrade the database from the server directory (`cd ../server`):
`flask db init`
`flask db migrate -m "Initial migration"`
`flask db upgrade`

## Models:

#### User
- id: Primary key.
- username: Unique username.
- email: User email address.
- phone: Optional phone number.
- _password_hash: Encrypted user password.
- role: Role of the user (client or admin).
- tickets: Tickets created by the user (relationship).
- comments: Comments made by the user (relationship).
- queues: Queues the user is associated with (relationship).

#### Ticket
- id: Primary key.
- requestor_id: Foreign key referencing the user who requested the ticket.
- date: Creation date of the ticket.
- email: Contact email for the ticket.
- phone: Contact phone for the ticket.
- title: User-defined title of the ticket.
- description: Detailed description of the issue or request.
- priority: Priority level of the ticket (low, medium, high).
- status: Current status of the ticket (new, in-progress, closed).
- requestor: User who created the ticket (relationship).
- tags: Tags associated with the ticket (relationship).
- comments: Comments associated with the ticket (relationship).
- queues: Queues the ticket is assigned to (relationship).
- images: Images uploaded to the ticket (relationship).

#### Queue
- id: Primary key.
- name: Name of the queue.
- tickets: Tickets assigned to the queue (relationship).
- users: Users associated with the queue (relationship).

#### Comment
- id: Primary key.
- user_id: Foreign key referencing the user who made the comment.
- ticket_id: Foreign key referencing the ticket the comment belongs to.
- date: Date the comment was created.
- content: Content of the comment.
- user: User who made the comment (relationship).
- ticket: Ticket the comment is associated with (relationship).

#### Tag
- id: Primary key.
- name: Tag name.
- tickets: Tickets associated with the tag (relationship).

#### Image
- id: Primary key.
- file_path: Path to the image file.
- ticket_id: Foreign key referencing the ticket the image belongs to.
- ticket: Ticket the image is associated with (relationship).

---

### Association Tables

#### ticket_tags
- ticket_id: Foreign key referencing `tickets.id`, part of composite primary key.
- tag_id: Foreign key referencing `tags.id`, part of composite primary key.

#### ticket_queues
- ticket_id: Foreign key referencing `tickets.id`, part of composite primary key.
- queue_id: Foreign key referencing `queues.id`, part of composite primary key.

#### user_queues
- user_id: Foreign key referencing `users.id`, part of composite primary key.
- queue_id: Foreign key referencing `queues.id`, part of composite primary key.


## Future Plans:

There are many additions/extensions that could be added to this application:
- Default queues: unassigned, or closed ticket queues that tickets are added to by default.
- Ticket reports: For example, seeing how long it takes to resolve tickets in a given queue.
- Customizability: Changing themes, profile pictures, etc.
- Client user searching

## Contact Me:

PRSheridan (github.com)

philrsheridan@gmail.com
