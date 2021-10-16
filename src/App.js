import './App.css';
import React, {useState, useEffect} from 'react';
import { useColumnsList } from './CustomHooks'
import {Line} from 'react-chartjs-2';
import axios from 'axios';

export default function App () {
  let columnsList = useColumnsList([]);
  let [dimensionSelected, setDimension] = useState('');
  let dimensionLabel = 'Please Select Dimension';
  let [measureSelected, setMeasure] = useState('');
  let measureLabel = 'Please Select Measure';
  let [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Data',
        fill: false,
        lineTension: 0.5,
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        data: []
      }
    ]
  })

  useEffect(()=>{
    if(dimensionSelected !== '' && measureSelected !== '') {
      getChartData();
    }
  }, [dimensionSelected, measureSelected])
  
  function clearData(id) {
    if(id === 1) {
      setDimension('')
    } else {
      setMeasure('')
    }
    setChartData({
      labels: [],
      datasets: [
        {
          label: 'Data',
          fill: false,
          lineTension: 0.5,
          borderColor: 'rgba(0,0,0,1)',
          borderWidth: 2,
          data: []
        }
      ]
    })
  }
  
  function changeColumn(name, func) {
    if(name !== dimensionSelected && name !== measureSelected) {
      if (func === "dimension") {
        setDimension(name)
        console.log(dimensionSelected)
      } else {
        setMeasure(name)
      }
    }
  }

  function getChartData() {
    axios({
      url: "https://plotter-task.herokuapp.com/data",
      method: "POST",
      data: {
        measures: [`${measureSelected}`],
        dimension: `${dimensionSelected}`,
      },
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      console.log(res.data)
      let dimensionData = [];
      let measureData = [];
      if (res.data[0].name === measureSelected) {
        measureData = res.data[0];
        dimensionData = res.data[1];
      } else {
        measureData = res.data[1];
        dimensionData = res.data[0];
      }
      changeChartData(dimensionData, measureData);
    })
    .catch((err) => {
      console.log(err)
    })
  }

  function changeChartData(dimensionData, measureData) {
    setChartData({
      labels: dimensionData.values,
      datasets: [
        {
          label: 'Data',
          fill: false,
          lineTension: 0.5,
          borderColor: 'rgba(0,0,0,1)',
          borderWidth: 2,
          data: measureData.values
        }
      ]
    })
  }
  
  return (
    <div className="chart">
      <div className="row">
        <div className="col-3">
          <ul className="columns-list">
            {columnsList.map((item, index) => {
              return (
                <li key={index}
                  onClick={() => changeColumn(item.name, item.function)}
                >
                  {item.name}
                </li>
              )
            })}
          </ul>
        </div>
        <div className="col-9">
          <div className="row mb-4">
            <div className="col-2">
              <label>Dimension</label>
            </div>
            <div className="col-10">
              <div className="selected-item">
                {dimensionSelected !== '' ?
                  <span>{ dimensionSelected }</span>
                :
                  <span>{ dimensionLabel }</span>
                }
                <button className="clear-btn" onClick={() => clearData(1)}>Clear</button>
              </div>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-2">
              <label>Measures</label>
            </div>
            <div className="col-10">
              <div className="selected-item">
                {measureSelected !== '' ?
                  <span>{ measureSelected }</span>
                :
                  <span>{ measureLabel }</span>
                }
                <button className="clear-btn" onClick={() => clearData(2)}>Clear</button>
              </div>
            </div>
          </div>

          <Line
            data={chartData}
            options={{}}
          />

        </div>
      </div>
    </div>
  );
}



