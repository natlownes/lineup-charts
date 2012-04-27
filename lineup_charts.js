if (!window.Looting) {
  window.Looting = {}
}

Looting.LineupChart = function LineupChart(obj, width){
  this.lineups =      obj.lineups
  this.graphLines =   obj.graph_lines
  this.gameCount = Object.keys(this.lineups).length
  this.width = width
  this.height = (width / 5)
  this.lineWidth = (this.height / 40)
  this.x = pv.Scale.linear(0, this.gameCount).range(0, this.width);
  this.y = pv.Scale.linear(0, 10).range(0, this.height);

  this.panel = this.createPanel();
  this.start();
}

Looting.LineupChart.prototype = {
  'createPanel': function(){
    var p = new pv.Panel()
        .width(this.width)
        .height(this.height)
        .bottom(200)
        .left(20)
        .right(10)
        .top(5);
    return p;
  },

  'start': function(){
    this.createXAxis();
    this.createYAxis();
    this.drawLines();
  },

  'createXAxis': function(){
    this.panel.add(pv.Rule)
        .data(this.x.ticks(50))
        .visible(function(d){ return d > 0})
        .left(this.x)
        .strokeStyle("#eee")
      .add(pv.Rule)
        .bottom(-5)
        .height(5)
        .strokeStyle("#000")
      .anchor("bottom").add(pv.Label)
        .textAlign('left')
        .textAngle(1.1)
        .textMargin(5)
        .text(function(d){ return this.lineups[d].date }.bind(this));
  },

  'createYAxis': function(){
    this.panel.add(pv.Rule)
        .data(this.y.ticks(10))
        .bottom(this.y)
        .strokeStyle(function(d){ return (d ? "#eee" : "#000")})
        .anchor("left").add(pv.Label)
        .text(function(d){return Looting.LineupCharts.lineupPositionForGraph(d)});
  },

  'drawLines': function(){
    for(var lineGroupIndex in this.graphLines){
      var lineGroup = this.graphLines[lineGroupIndex];
      if(lineGroup.length > 0){
        this.panel.add(pv.Line)
            .data(lineGroup)
            .interpolate("step-before")
            .interpolate("cardinal")
            //.interpolate("linear")
            .interpolate("basis")
            .left(function(d){return (this.x(d.x))}.bind(this))
            // can't use 'round' with segmented lines
            //.lineJoin('round')
            //.segmented(true)
            .eccentricity(0.7)
            //.bottom(function(d){return (this.y(d.y) + Math.random())}.bind(this))
            .bottom(function(d){return (this.y(d.y))}.bind(this))
            .strokeStyle('#' + lineGroup[0]['color'])
            .lineWidth(this.lineWidth)
            .shape('circle')
            .text(lineGroup[0]['name'] + ' ' + lineGroup[0]['field_position'])
       //     .event('mouseover', function(d){window.Looting.LineupCharts.updatePlayerDisplay(d)})
        //    .event('mouseout', function(d){window.Looting.LineupCharts.clearPlayerDisplay(d)})
            .event('mouseover', pv.Behavior.tipsy({'gravity':'se', 'fade': true, 'delayOut':1000}))
          //.add(pv.Dot)
            //  .lineWidth(0.005)
            //  .left(function(d){return (this.x(d.x))}.bind(this))
            //  .bottom(function(d){return (this.y(d.y))}.bind(this))
            //  .fillStyle('white')
      }
    }
  },

  'render': function(){
    this.panel.render();
  }

} 

Looting.LineupCharts = {
  'lineupPositionForGraph': function(yAxisLabel){
    var dict = {
      '1':'9',
      '2':'8',
      '3':'7',
      '4':'6',
      '5':'5',
      '6':'4',
      '7':'3',
      '8':'2',
      '9':'1'
    }
    return dict[String(yAxisLabel)];
  },

  'clearPlayerDisplay': function(d){
    $('#player-info').text("");
  },

  'updatePlayerDisplay': function(d){
    console.log(d)
    $('#player-info').text(d.name);
  }
}

