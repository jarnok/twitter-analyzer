import sys
from threading import Thread
from twisted.python import log
from twisted.internet import reactor
from autobahn.twisted.websocket import WebSocketServerFactory
from autobahn.twisted.websocket import WebSocketServerProtocol
from shared.utils import Base64JsonEndec
import builtins
# Separate ServeDaemon process allows the server to listen for
# connections and requests while the main worker process handles
# the requests. The WebSocket server is a Twisted-based version
# provided with crossbario/autobahn framework

class ServerDaemon(Thread):

    def __init__(self, queue, retque):
        super(ServerDaemon, self).__init__()
        self.queue = queue
        self.retque = retque 

    def run(self):
        self.factory = BroadcastServerFactory(u"ws://127.0.0.1:9000", self.queue, self.retque)
        self.factory.protocol = MyServerProtocol
        reactor.listenTCP(9000, self.factory)
        reactor.run()


# Derived classes are used to define actions on events
class MyServerProtocol(WebSocketServerProtocol):

    def onConnect(self, request):
        self.factory.register(self)

    def onOpen(self):
        print("WebSocket connection open.")

    # On message, the data is passed to main worker thread
    # for processing
    def onMessage(self, payload, isBinary):
        self.factory.queue.append(dict(id=id(self), data=Base64JsonEndec.decode(payload)))

    def onClose(self, wasClean, code, reason):
        print("WebSocket connection closed: {}".format(reason))

# queue and retque are passed to BroadcastServerFactory as a duplex
# link between listener and worker threads
class BroadcastServerFactory(WebSocketServerFactory):

    def __init__(self, wsAddr, queue, retque):
        super(BroadcastServerFactory, self).__init__(wsAddr)
        self.clients = []
        self.queue = queue
        self.retque = retque
        self.tick()

    # Server registers clients to return async requests
    def register(self, client):
         if not client in self.clients:
             self.clients.append(client)

    # During each server tick the listener checks if any
    # client has new completed async requests
    # NOTE: the current implementation does not
    #       optimally accommodate multiuser environment
    #       as it handles one user's all messages at once
    #       (issue dismissed as outside of scope)  
    def tick(self):
        for client in self.clients:
            message = self.get_next_message(id(client))
            while message is not None:
                result = dict(type=message['type'], data=message['data'])
                client.sendMessage(Base64JsonEndec.encode(result))
                self.retque.remove(message)
                message = self.get_next_message(id(client))
            continue
        reactor.callLater(1, self.tick)

    def get_next_message(self, client_id):
        for item in self.retque:
            if item['id'] == client_id:
                return item



