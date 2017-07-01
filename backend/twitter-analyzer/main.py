from services.twitter_service import TwitterService
from services.worker import BackendService

queue = []
retque = []

twitter_service = TwitterService()
BackendService(queue, retque)


