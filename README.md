# Rooms in WS

I've seen people looking for implementations of rooms with the ws library in a couple places and needed to build one for myself, so I'm putting it together separately from the project I needed it for.

Based on the basic setup of a Create React App on a node backend from [bitlab studio](https://blog.bitlabstudio.com/a-simple-chat-app-with-react-node-and-websocket-35d3c9835807).

### Getting Started

You will need to have node and npm installed on your computer for this.

You can find instructions for downloading them [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm). 

1. Clone down this project onto your local machine.

2. Navigate to `/backend` (one level down from root.)

3. Run `npm install` to install all dependencies, and then `node server.js`

4. Navigate back up to root, and then down to `/frontend` (it should be next to `backend`.)

5. Again, run `npm install`. Then run `npm run start`.

6. This should open a page in your browser at `localhost:3000` and you can start playing.

### Notes on design

The frontend is a create-react-app. The backend is a basic node server, using the [ws](https://www.npmjs.com/package/ws) library. The frontend is probably much heavier than needed, but it also makes it's extremely easy to use out of the box, which is why I'm using it.

### Existing functionality:

- [X] Users can choose a username
- [X] Duplicate usernames will be rejected
- [X] Users with usernames can create new "rooms"
- [X] Rooms are "open rooms" or "closed rooms" -- open rooms are shown on the landing page so people can join
- [X] Users with usernames can join existing "rooms"
- [X] Users in a room can leave the room
- [X] Rooms have a size limit. Above that, new entrants will be rejected
- [X] Open rooms which are full are removed from the visible list
- [X] When a user leaves an "open" room, it is re-added to the visible list

- [ ] If a user is disconnected, they leave the room
- [ ] Users can send messages to the room they are in
- [ ] Users can see messages sent to the room they are in
