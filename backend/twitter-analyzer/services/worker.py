import html
import time
from services.listener import ServerDaemon
from dateutil import parser
from services.twitter_service import TwitterService


# BackendService is the "worker process" that handles
# incoming job requests for tweets
# 
# BackendService launches the secondary thread
# ServerDaemon that listens for Websocket connections
# and handles the WebSocket protocol

# The main worker thread (BackendService) and the WebSocket
# server share two lists ([]), queue and retque, that is
# used as the duplex channel to move jobs between processes

class BackendService:
    
    def escape_special_chars(self, text):
        return html.escape(text).replace('…', '...')

    def filter_twitter_data(self, tweets):
        return [ dict(tweet_id=ite.id, 
                      text=self.escape_special_chars(ite.text),
                      screen_name=ite.user.screen_name,
                      created_at=parser.parse(ite.created_at).strftime('%H:%M - %d %b %Y'))
                      for ite in tweets ]


    def __init__(self, queue, retque):
        server = ServerDaemon(queue, retque)
        server.daemon = True
        server.start()
        self.twitter_service = TwitterService()
        self.retque = retque
        self.queue = queue
        self.listen()

    def process_request(self, request):
        req_id = request['id']
        req_data = request['data']

        max_id = ""
        contd = ""
        for i in range(0,10):
            req_data['max_id'] = max_id
            tweets = self.twitter_service.get_tweets(req_data)

            if not len(tweets):
                break;

            max_id = str(tweets[-1].id)
            self.retque.append(dict(id=req_id, 
                                    type="tweet" + contd, 
                                    data=self.filter_twitter_data(tweets)))

            sentiments = self.twitter_service.get_sentiments(tweets)
            self.retque.append(dict(id=req_id, 
                                    type="sentiment", data=sentiments))

            aggregates = self.twitter_service.get_tweet_aggregates(sentiments)
            self.retque.append(dict(id=req_id, 
                                    type="tweet_aggregate" + contd,
                                    data=aggregates))
            contd = ".contd"

    def listen(self):
        while True:
            time.sleep(1)
            self.process_request(self.queue.pop()) if len(self.queue) > 0 else None
