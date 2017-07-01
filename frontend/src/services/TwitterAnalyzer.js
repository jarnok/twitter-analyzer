import {render} from 'react-dom';
import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import SearchBox from '../components/SearchBox.js';
import Graph from '../components/Graph.js';
import Websocket from '../services/Websocket';
import TweetList from '../components/TweetList';


// Container class
// Handles application status and serves
// as a message bus between components
export class TwitterAnalyzer extends React.Component {

  constructor(props) {
    super(props);
      this.state = {
        query: "",
        messages: [],
        stats: null,
        isOpen: false,
      }
  };

  sendQuery(query) {
    this.setState({
      query: query
     })
  };

  // statistics are received in parts
  // if set is a continuation, must append the data
  receiveStats(stats, contd) {
    var newStats = stats;
    if(contd) {

      var oldStats = this.state.stats;
      for(var key in stats) {
 
        if(key in oldStats)
          oldStats[key] = oldStats[key].concat(stats[key]);
        else
          oldStats[key] = stats[key];

      }

      newStats = this.sortStats(oldStats);
    }

    this.setState({
      stats: newStats
    });

  };

  // Data is sent as lists in OrderedDicts
  // need to guarantee order for graphs
  sortStats(stats) {
    var sortedStats = {};
    var sortedKeys = Object.keys(stats).sort();
    for(var key of sortedKeys)
      sortedStats[key] = stats[key];
    return sortedStats;
  };

  // Pass tweet data to app data handler
  receiveTweets(tweets, contd) {
    var messages = [];

    if(contd)
      messages = this.state.messages.concat(tweets);   
    else
      messages = tweets;
    

    this.setState({
      messages: messages
    });
  };

  render() {
    return(
      <MuiThemeProvider>
        <div>
          <h2>Twitter Analyzer</h2>
          <SearchBox sendQuery={this.sendQuery.bind(this)}/>
            <Websocket data = {{
                query: this.state.query,
                messages: this.state.messages
            }}
              actions = {{ 
                receiveTweets: this.receiveTweets.bind(this),
                receiveStats: this.receiveStats.bind(this)
            }}/>

          <Graph stats={this.state.stats}/>
          <TweetList messages={this.state.messages}/>
        </div>
      </MuiThemeProvider>
    )
  };
}
export default TwitterAnalyzer;
