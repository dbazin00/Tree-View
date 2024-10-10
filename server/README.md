# Tree View - Server

---
### Instructions

- Execute `npm install` to install all dependecies
- Create `.env` file by copying content of `.env.example` and replacing values with your personal data
- Run app by executing command `npm start` from your terminal
---

### Database

- **PostgreSQL** is used as a database for this project
- **Sequelize** is used as an ORM for this project
- **Code first** approach is used for this project. If table **TreeViews** does not exist, it will be automatically created
- Database contains following fields:
  - **id** - Primary key and auto-generated field. It is populated by incrementing previous value
  - **text** - Text of tree node
  - **parentId** - Foreign key

---

### Routes

You need to have installed Postman or similar tool for testing following API routes:

- `GET /api/treeviews` - HTTP GET request which return all available tree nodes from database

- `GET /api/treeviews/:id` - HTTP GET request which returns a tree node that matches `:id`. If it does not match any of ids in database, request will return message that tree node with that id does not exist

- `POST /api/treeviews` - HTTP POST request which adds new tree node in database. This is an example of HTTP request body:

```
{
    "text": "Lorem ipsum"
    "parentId": 1
}
```

- `PUT /api/treeviews/:id` - HTTP PUT request which updates a tree node that matches `:id`. If it does not match any of ids in database, request will return message that tree node with that id does not exist

```
{
    "text": "Lorem ipsum"
}
```

- `DELETE /api/treeviews/:id` - HTTP DELETE request which deletes a tree node that matches `:id`. If it does not match any of ids in database, request will return message that tree node with that id does not exist

- `PUT /api/treeviews/:id/move` - HTTP PUT request which updates a tree node parent node that matches `:id`. If it does not match any of ids in database, request will return message that tree node with that id does not exist

```
{
    "text": "Lorem ipsum",
    "parentId": 1
}
```
