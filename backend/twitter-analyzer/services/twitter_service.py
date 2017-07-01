import time
import os
import sys
import json
import twitter
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import urllib.parse
from dateutil import parser
from collections import OrderedDict

KEYFILE="../keys.json"


class TwitterService:

    def __init__(self):
        self.keys = self.load_keys()
        self.api = twitter.Api(consumer_key=self.keys['consumer_key'], 
                               consumer_secret=self.keys['consumer_secret'], 
                               access_token_key=self.keys['access_token_key'],
                               access_token_secret=self.keys['access_token_secret'])


    # Loads API keys for the twitter plugin
    def load_keys(self):
        if os.path.isfile(KEYFILE):
            return json.loads(open(KEYFILE).read())
        raise Exception("No API keyfile available")

    
    def get_tweets(self, request):
        self.validate_request(request)
        request_query = self.parse_request(request)
        tweets = twitter.api.Api.GetSearch(self.api, raw_query=request_query + "&lang=en&truncated=false")
        for tweet in tweets:
            if tweet.retweet_count > 0:
                tweets.remove(tweet)
        return tweets


    # Provides perfunctory, incomplete sanitation
    def validate_request(self, request):
        available_parameters = ['q', 'count', 'max_id']
        if not 'q' in request.keys():
            raise Exception("Invalid request, no search term")

        # Disallows uncontrolled params
        if len(set(set(request.keys())- set(available_parameters))):
           raise Exception("Invalid request, unknown parameters")

        # Date validation (frontend implementation dropped as outside of scope)
        for key in request.keys():
           if "date" in key:
               try:
                   datetime.strptime(request[key], "%Y-%m-%d")
               except:
                   raise Exception("Invalid request, invalid date parameter(s)")


    # Appends valid request parameters to the API request uri
    def parse_request(self, request):
        parameter_list = []
        for k,v in request.items():
            parameter_list.append(k + "=" + request[k])
        return urllib.parse.urlencode(request)
        return "&".join(parameter_list)


    # Generates sentiment values for tweet text content
    # Powered by cjhutto/vaderSentiment, check out at Github.com
    def get_sentiments(self, tweets):
        balances = []
        balance = 0
        analyzer = SentimentIntensityAnalyzer()
        for re in tweets:
            num = analyzer.polarity_scores(re.text)['compound']
            if num > 0.5:
                balance+=1
            elif num < 0.5:
                balance-=1
            balances.append(dict(id=re.id, rating=num, created_at=re.created_at))
        return balances


    # Provides tweet counts/ratings per date in a dictionary
    # with guaranteed order
    def get_tweet_aggregates(self, tweets):
        ret_dict = dict()
        for tweet in tweets:
            date = parser.parse(tweet['created_at']).strftime('%Y-%m-%d')
            rating = tweet['rating']
            if date in ret_dict:
                ret_dict[date].append(rating)
            else:
                ret_dict[date] = [rating]

        return OrderedDict(sorted(ret_dict.items(), key=lambda t: t[0]))

