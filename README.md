### **Model Designing**-
- User
  - _id 
  - firstname
  - secondname
  - password
  - profile photo
  - posts
  - comments
  - friends
- Post
  - _id
  - content
  - author
  - comments
  - likes
- Comment
  - _id
  - content
  - post
  - author
- Like
  - _id
  - post
  - author
- Friend
  - _id
  - sender
  - reciever
  - response

### **Todos**-

- [x] Create initial files with `npx express-generator --no-view`
- [ ] Create models and connect to mongodb.
- [ ] Create controllers.

### **Goals**-

- [ ] Users must sign in to see anything except the sign in page.

- [ ] Users should be able to sign in using their real facebook details.

- [ ] Users can send friend requests to other users.
  
- [ ] A user must accept the friend request to become friends.

- [ ] Users can create posts. (begin with text only)

- [ ] Users can like posts.

- [ ] Users can comment on posts.

- [ ] Posts should always display with the post content, author, comments and likes.

- [ ] Treat the Posts index page like the real Facebook’s “Timeline” feature – show all the recent posts from the current user and users he/she is friends with.

- [ ] Users can create Profile with a photo (you can get this from the real facebook when you sign in using passport)

- [ ] The User Show page contains their profile information, profile photo and posts.

- [ ] The Users Index page lists all users and buttons for sending friend requests to those who are not already friends or who don’t already have a pending request.

- [ ] Deploy your app to Heroku!

### **Credits**-

- [populatedb.js](https://raw.githubusercontent.com/hamishwillee/express-locallibrary-tutorial/master/populatedb.js)