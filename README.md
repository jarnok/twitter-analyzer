# twitter-analyzer
Simple dockerized application for browsing cached tweets
and tweet aggregates (last 7 days) from Twitter's API.  


# Description

**Note: Twitter app API keys required.**

The frontend is written with ReactJS and transpiled/bundled with Webpack & Babel.  
Frontend displays and parses tweet (/aggregate) data from backend and visualizes
the data and sentiment analysis in graphs and emoticons using GraphJS. THe frontend
handles the request responses asynchronously using the WebSocket protocol.

The backend is written in Python3.4, and runs a worker process and a WebSocket
listener process in a separate thread. The threading solution provides the option
of implementing a multiuser-supported environment.

The Websocket server receives requests from the frontend and then passes said
requests to the worker process. The worker process then makes the requested
queries to the Twitter API, after which the results are passed asynchronously
back to the WebSocket server thread and eventually the frontend.

# Install

**NOTE: installation requires Docker and Docker-compose to be installed beforehand.**

1. Fetch the code `git clone https://github.com/jarnok/twitter-analyzer.git`
2. Copy the `keys.json` (API keys) to the project directory `twitter-analyzer/backend/`
3. Run Docker-compose in project root `sudo docker-compose up --build`
4. Give it a little time to build.
5. Enjoy!

# Usage

Once the build and Docker-compose is ready, the frontend should be running
on `localhost:1337` and the backend WebSocket listener should be running
on `localhost:9000`.

Then just open a browser and head to `http://localhost:1337` and enjoy!

**NOTE: the Twitter API has a usage limit of a few hundred requests per 15 minutes and each search requires 10 separate requests.** 

# Known issues

- Tests are currently missing
- Warn messages in Webpack build
- Non-fatal error message on backend WebSocket server thread startup
- Some issues with special Unicode characters in tweets
- Only supports tweets written in English (others are filtered)
- No icon/animation to notify user a request is being processed
- Styles not optimized for low-resolution screens
