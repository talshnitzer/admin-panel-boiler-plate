import React, { Component } from 'react';
import * as ChartJS from 'chart.js';
import classNames from 'classnames';

export class DashboardChart extends Component {
    
  constructor(){
    super()
    this.canvas = React.createRef()                  //// 1 - create ref
  }

  componentDidMount() {
    this.render()
  }

    plugin = {
        beforeDraw: function(chart) {
            console.log('chart object', chart);
            
        if (chart.config.options.elements.center) {
          // Get ctx from string
          const ctx = chart.chart.ctx;

          // Get options from the center object in options
          const centerConfig = chart.config.options.elements.center;
          const fontStyle = centerConfig.fontStyle || 'Arial';
          const txt = centerConfig.text;
          const color = centerConfig.color || '#000';
          const maxFontSize = centerConfig.maxFontSize || 75;
          const sidePadding = centerConfig.sidePadding || 20;
          const sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)
          // Start with a base font of 30px
          ctx.font = "30px " + fontStyle;

          // Get the width of the string and also the width of the element minus 10 to give it 5px side padding
          const stringWidth = ctx.measureText(txt).width;
          const elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

          // Find out how much the font can grow in width.
          const widthRatio = elementWidth / stringWidth;
          const newFontSize = Math.floor(30 * widthRatio);
          const elementHeight = (chart.innerRadius * 2);

          // Pick a new font size so it will not be larger than the height of label.
          let fontSizeToUse = Math.min(newFontSize, elementHeight, maxFontSize);
          let minFontSize = centerConfig.minFontSize;
          const lineHeight = centerConfig.lineHeight || 25;
          let wrapText = false;

          if (minFontSize === undefined) {
            minFontSize = 20;
          }

          if (minFontSize && fontSizeToUse < minFontSize) {
            fontSizeToUse = minFontSize;
            wrapText = true;
          }

          // Set font settings to draw it correctly.
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
          let centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
          ctx.font = fontSizeToUse + "px " + fontStyle;
          ctx.fillStyle = color;

          if (!wrapText) {
            ctx.fillText(txt, centerX, centerY);
            return;
          }

          const words = txt.split(' ');
          let line = '';
          const lines = [];

          // Break words up into multiple lines if necessary
          for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > elementWidth && n > 0) {
              lines.push(line);
              line = words[n] + ' ';
            } else {
              line = testLine;
            }
          }

          // Move the center up depending on line height and number of lines
          centerY -= (lines.length / 2) * lineHeight;

          for (let n = 0; n < lines.length; n++) {
            ctx.fillText(lines[n], centerX, centerY);
            centerY += lineHeight;
          }
          //Draw text in center
          ctx.fillText(line, centerX, centerY);
        }
      }
    }


    render() {

      //prepare the chart data value
      console.log('****props of DashboardChart', this.props);

      const pieOptions = {
          title: {
              display: true,
              text: this.props.data.name ,
              fontSize: 25
          },
          elements: {
              center: {
                  text: `${this.props.data.advisoryHoursDone}/${this.props.data.advisoryHoursPlanned}`,
                  color: '#FF6384', // Default is #000000
                  fontStyle: 'Arial', // Default is Arial
                  sidePadding: 20 // Defualt is 20 (as a percentage)
              }
          }
      }
        
        const pieDataEnterprises = {
            labels: ['Done','Remaining'],
            datasets: [
                {
                    data:  [
                      this.props.data.advisoryHoursDone, this.props.data.advisoryHoursPlanned-this.props.data.advisoryHoursDone] ,
                    backgroundColor: [
                        "#FFC107"
                    ],
                    hoverBackgroundColor: [
                        "#FFE082",
                        "#81D4FA",
                        "#A5D6A7"
                    ]
                }]
        }  

        //if ((this.canvas !== null) && (this.canvas !== undefined) && (this.canvas.current !== null))
        if (this.canvas.current !== null)
        {
          this.DoughnutChart = new ChartJS(this.canvas.current.getContext("2d"), {
            plugins: [this.plugin],
            type: 'doughnut',
            data: pieDataEnterprises,
            options: pieOptions
          });
        }

    //draw the chart
    
        let 
            className = classNames('p-chart', this.props.className),
            style = Object.assign({
                width: this.props.width,
                height: this.props.height
                }, this.props.style);

                return (
            <div  style={style,{alignItems: 'center'}} className={className}>
                <canvas id={this.props.id} ref={this.canvas} width={this.props.width} height={this.props.height} />
            </div>
            
        )     
    }
}



