import base64
import json

class Base64JsonEndec:
    @staticmethod
    def decode(payload):
        return json.loads(payload.decode('utf-8'))

    @staticmethod
    def encode(payload):
        return base64.b64encode((str.encode(json.dumps(payload, ensure_ascii=False))))

