import {render} from 'react-dom';
import React from 'react';
import { Line as LineChart } from 'react-chartjs';
import { Pie as PieChart } from 'react-chartjs';

// NOTE: non ad-hoc implementation
// disregarded as outside of scope
class Graph extends React.Component {

  generateLineData(data) {
    if(data == null) {
      return {'labels': null, 'data': null}
    } 
    var ret = {};
    ret['labels'] = Object.keys(data)
    ret['data'] = []
    for(var item in data) {
      ret['data'].push(data[item].length)
    }
    return ret    
  }

  generatePieData(data) {
    var ret = [];
    if(data == null) {
       return ret;
    }
    var list = [0,0,0];
    for(var key in data) {
      for(var item of data[key]) {
        if(item > 0.2)
          list[0] += 1
        else if(item < -0.2) 
          list[1] += 1
        else
          list[2] += 1
      }
    }
    ret.push({ value: list[0],
               color: '#46BFBF',
               label: 'Positive'},
             { value: list[1],
               color: '#FF35A3',
               label: 'Negative'},
             { value: list[2],
               color: '#FDB45C',
               label: 'Neutral'})
    return ret
  }

  constructor(props) {
    super(props);
      this.state = {
       chartOptions: {
         showTooltips: false, 
       },
       data: {
        labels: [],
        datasets: [{
            data: []
        }]
      }
  }
  }

  render() {

   var lineData = this.state.data;
   var lineMetas = this.generateLineData(this.props.stats);
   lineData['datasets'][0]['data'] = lineMetas['data'];
   lineData['labels'] = lineMetas['labels'];

   var pieData = this.generatePieData(this.props.stats);   
   if(pieData.length) {
     return(
       <div className='row statistics'>
         <h4>Statistics</h4>
         <hr/>
         <div style={{display: 'inline-block'}}>
           <h5>Tweets per day</h5>
           <LineChart data={lineData} options={this.state.chartOptions} 
                 width='300px' height='200px' />
         </div>
         <div style={{display: 'inline-block'}}>
         <h5>Tweet sentiments</h5>
          <PieChart data={pieData} options={this.state.pieOptions}
                 width='300px' height='200px'/>
         </div>
      </div>
   );
   }
   else {
     return(null);
   }
  };
}
export default Graph;
