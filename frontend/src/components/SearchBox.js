import {render} from 'react-dom';
import React from 'react';

class SearchBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: ""
    };
  };

  searchForTweets(event) {
    event.preventDefault();
    this.props.sendQuery(this.state.search);
  };
  
  handleChange(event) {
    this.setState({
      search: event.target.value
    });
  };

  render() {
    return (
          <div className='minimal-navbar row'>
            <form onSubmit={this.searchForTweets.bind(this)}>
              <div className='input-group col-md-offset-1 col-md-8'>
                <input value={this.state.search} onChange={this.handleChange.bind(this)} className='form-control' placeholder="Search for user or #hashtag..." type="text"/>
                <span className='input-group-btn'>
                  <button onClick={this.searchForTweets.bind(this)} type='submit' className='btn btn-default' id="searchBtn">
                    <i style={{fontSize: '14pt'}} className='fa fa-search'></i>
                  </button>
                </span> 
              </div>
            </form>        
          </div>
    );
  };
};

export default SearchBox;
