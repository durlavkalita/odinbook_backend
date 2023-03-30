- api endpoints

userController

- GET /users: Get a list of all users
- GET /users/:id: Get a specific user by ID
- POST /users: Create a new user
- PUT /users/:id: Update an existing user by ID
- DELETE /users/:id: Delete a user by ID

postController

- GET /posts: Get a list of all posts
- GET /posts/:id: Get a specific post by ID
- POST /posts: Create a new post
- PUT /posts/:id: Update an existing post by ID
- DELETE /posts/:id: Delete a post by ID
- POST /posts/:id/like: Like a post
- DELETE /posts/:id/like: Unlike a post

commentController

- POST /posts/:id/comments: Create a new comment on a post
- PUT /comments/:id: Update an existing comment by ID
- DELETE /comments/:id: Delete a comment by ID

friendRequestController

- GET /friend-requests: Get a list of all friend requests
- GET /friend-requests/:id: Get a specific friend request by ID
- POST /friend-requests: Send a new friend request
- PUT /friend-requests/:id: Update an existing friend request by ID
- DELETE /friend-requests/:id: Delete a friend request by ID
