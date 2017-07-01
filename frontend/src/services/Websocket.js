import {render} from 'react-dom';
import React from 'react';

class Websocket extends React.Component {

  constructor(props) {
    super(props);
      this.state = {
        websocket: new WebSocket('ws://127.0.0.1:9000')
      }
  };

  componentWillUpdate(nextProps) {
    if(this.props.data.query != nextProps.data.query) 
      this.sendMessage(nextProps.data.query);
  };
  
  render() {
    return(null);
  }
  
  // removes line breaks and decodes base64-encoded string
  decodeMessage(encodedMessage) {
    return atob(
      encodedMessage.replace(/\s/g, ''));
  };


  // this function defines how each type of received data
  // is handled and then passed to app (TwitterAnalysis)
  // NOTE: ***.contd notation is used when handling 
  // multi-part dataset
  parseMessage(evt) {
    var message = this.decodeMessage(evt.data);
    var messageObject = JSON.parse(message);
    switch(messageObject.type) {
      case 'tweet':
        this.props.actions.receiveTweets(messageObject['data'], false);
        break;
      case 'tweet.contd':
        this.props.actions.receiveTweets(messageObject['data'], true);
        break;
      case 'sentiment':            
        for(var message of this.props.data.messages) {
          for(var sentiment of messageObject['data']) {
            if(message['tweet_id'] == sentiment['id']) {
              message['rating'] = sentiment['rating'];
            }            
          }
        }
        this.props.actions.receiveTweets(this.props.data.messages, false);
        break;
      case 'tweet_aggregate':
        this.props.actions.receiveStats(messageObject['data'], false);
        break;
      case 'tweet_aggregate.contd':
        this.props.actions.receiveStats(messageObject['data'], true);
        break;
      default:
        console.log('unknown message received');
        break;
      }
      return; 
  };
  
  // defines actions triggered by Websocket events 
  componentDidMount() {
    this.state.websocket.onmessage = evt => {
      this.parseMessage(evt);
    };
    this.state.websocket.onopen = evt => {
      this.setState({
        isOpen: true
      })
    };
  }; 

  sendMessage(message) {
    var message = JSON.stringify({"q":message, "count":"100"});
    this.state.websocket.send(message);
  };
 
};
export default Websocket;
