# SpotifyToYTMusicConverter

I recently got Youtube Premium and am fed up with Spotify Ads. It's time to switch.

What most Spotify to Youtube converters do is they find the first song that appears when you search up the name on YouTube. I want to add a feature in the middle which allows the user to check whether the videos are correct, and to allow the user to fix the choice.

Inspired by a project I saw in Hack Club's The Bay. I didn't actually see the project, I just saw the name. I had this idea for a few years originally, but finally decided to start on it since I have time over the summer.

Open Planning.excalidraw with Excalidraw in order to see my prototypes!

I'm first going to make an express/HTML version, then perhaps move over to react.

### Making a Google Cloud OAuth 2.0 Client

1. Make a Google Cloud Project
2. Go to APIs & Services => Credentials
3. Create Credentials => OAuth client ID
4. Add https://localhost:3000 to the Authorized JavaScript origins and https://localhost:3000/callback to the authorized redirects
5. Export your credentials as JSON
6. GO to APIs & Services => OAuth consent screen => Audience
7. Under Test Users, Add your email (or whatever email you'd like to use)
8. Edit views/convert by adding your client ID.

### How to run
Make sure you have node and npm installed
Open command prompt in your project directory

1. ``npm install``
2. ``npm run start``