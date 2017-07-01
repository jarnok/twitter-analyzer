import {render} from 'react-dom';
import React from 'react';

class Rating extends React.Component {
    
  render() {
    var emoticon = "";
    var i = this.props.rating;
    if(i === undefined) 
      return (null);
    else if(i > 0.2)
      emoticon = "fa fa-smile-o";
    else if(i < -0.2)
      emoticon = "fa fa-frown-o"
    else 
      emoticon = "fa fa-meh-o";
    return(
      <div className='col-md-2 rating-box'>
        Rating<br/>
        <i className={emoticon}></i>
      </div>
    );
       
  }
}
export default Rating;
