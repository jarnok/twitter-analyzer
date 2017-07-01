FROM python:3.4

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ONBUILD COPY requirements.txt /usr/src/app/
ONBUILD RUN pip install --no-cache-dir -r requirements.txt

ONBUILD COPY . /usr/src/app

RUN apt-get update && apt-get install -y python-pip vim
RUN pip install autobahn
RUN pip install asyncio
RUN pip install crossbar

RUN pip install requests vaderSentiment
RUN pip install python-twitter python-dateutil
ADD . /tmp/backend
WORKDIR /tmp/backend/twitter-analyzer
CMD ["python3.4", "main.py"]
