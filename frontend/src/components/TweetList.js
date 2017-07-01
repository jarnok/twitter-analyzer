import {render} from 'react-dom';
import React from 'react';
import twitter from 'twitter-text';
import Rating from '../components/Rating';

class TweetList extends React.Component {
   
  render() {
    if(this.props.messages.length) {
      var tweets = this.props.messages.map((d, i) => 
        <blockquote className="twitter-tweet col-md-5 col-sm-5 col-xs-11" key={i}>
          <div className='col-md-10'>
            <p dangerouslySetInnerHTML={{__html: twttr.txt.autoLink(d.text) }}></p>
            <span className='author'> — {d.screen_name}</span>
            <span className='date'>{ d.created_at }</span>
          </div>
          <Rating rating={ d.rating }/>
        </blockquote>);
      
      return (
        <div className='tweet-list'>
          <h4>Tweets</h4>
          <hr/>
          { tweets } 
        </div>
      );

    } 
    else {
      return (
        <div></div>
      );
    }
  }
}
export default TweetList;
