### What is PubGo?

PubGo is an app intended to give the pub-goer an overview of KTH-campus where the user can see, on a map, which pubs are open, how many people are there and if the event is open to the public or not. It should be
possible for the pub-goer to quickly get a route to the nearest pub regarding their position. In addition to this, each Klubbmästeri(KM) at KTH has the ability to create events for their pubs, to be displayed on the map. The app also includes a clicker functionality, which will enable the pub-goers to see if the pub is busy and will allow the KM to keep an accurate count of how many people are in the pub.

### Completed Work

We have the initial layout of the app, with a login-page where the user logs in with a google account. After that we have a simple map view where the user can see all the events, for now we have a `random` button that adds a event on a random place in the world. There is also an event view that shows details of the event, such as if it is public and of busy the establishment is. Lastly there is an event-create view, where the user sets the name, date and place for the event. When choosing a place you can search for a new address to add if it is not already in the list of know places

### Work Distribution
We are aware that, as it stands, the work distribution has not been entirely equal due to late TW3 submissions. This led to Lucas starting to work on the initial setup of the project and adding login functionality and simple views which can be worked on further. We are aware that for the remainder of the project, more work will be done by Olivia, Max, and Eric in order to achieve a more equal work distribution.

### Future Work

- Users should be able to login with email & password, in addition to the Google Login.

- It should be possible to create user groups for each Klubbmästeri(KM), to keep track of what KM-member creates what event and to ensure that only authorized KM-members can create events for that KM. There should be an Admin KM group user, responsible for adding new members and appointing new admins.

- To authenticate the first admin user for each KM group and ensure that only people affiliated with an KM has access to make events, there needs to be an Authentication process and the possibility to enter an authcode in the app.

- In the map view, the user should be able to select a pub/event and then get a route (nearest path) from the user position to the pub. We are also planning to have a button that takes the user to the nearest open pub.

- In the map view, the user should be able to switch to a list view where they can see all the current an upcoming events.

- In the bottom of the screen we will have a navbar for easy navigation between each view.

### File Structure

Currently the file structure is quite straightforward. We've created 3 different directories with different purposes. `pages` is where all the pages of the application is stored. A page renders a view. Each view renders different components. `CreateEventPage` is a view that displays a form which is used to create a new event. In the `features` directory, the components and redux logic is found. Here, the slices (e.g `selectedEventSlice`) and API:s (e.g `eventSlice`) are found which fetch and display data from the Realtime Database. We have future plans to the structure in the directory more divided and clear, for instance, differentiating between views and redux logic. In the `components` folder, all the components that don't fetch data from firebase are found. These components rather get their data from their props. These components are for instance `BusyBar` which displays how busy a pub is or `DisplayEventInfo` which displays the info of an event.

Here are some interesting files and what they do.

#### routes.js

Chooses what route is to be rendered depending on the URL.

#### eventSlice.js

Used for fetching, creating and modifying events. It uses the `createApi` module from `@reduxjs/toolkit`.

#### PrivateRoute.js

Used for verifying that the user is logged in, it the user isn't logged in, we redirect the user to the login page.

#### EventsPage.js

Page for displaying the events in either map view (`HomeMapView`) or list view (`HomeListView`).
.