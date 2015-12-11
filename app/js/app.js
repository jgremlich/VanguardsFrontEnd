var Router = ReactRouter.Router;
var Link = ReactRouter.Link;
var Route = ReactRouter.Route;

var App = React.createClass({
  render: function() {
    return (
      <div>
        <nav className="navbar navbar-default" role="navigation">
          <div className="container">
              <div className="navbar-header">
                 <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                   <span className="sr-only">Toggle navigation</span>
                   <span className="icon-bar"></span>
                   <span className="icon-bar"></span>
                   <span className="icon-bar"></span>
                </button>
                <a className="navbar-brand" href="/">Vanguards</a>
              </div>
              <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul className="nav navbar-nav">
                  <li><Link to="page">Games</Link></li>
                </ul>
              </div>
            </div>
        </nav>

        <div className="container">
          {this.props.children}
        </div>
      </div>
    );
  }
});

var Home = React.createClass({
  render: function() {
    return (
      <div>
        <h1>Home</h1>
        <p>Put your home page here</p>
      </div>
    );
  }
});

var oldData = [
    {id: 1, time: 5, winningTeam: "Red"},
    {id: 5, time: 10, winningTeam: "Blue"}
];

var GameDetails = React.createClass({
    render: function(){
        var compid = "vis" + this.props.gameid;
        return(
            <div>
                <div id={compid}></div>
            </div>
        );
    },
    componentDidMount: function (){
        this.createTimeline();
    },
    createTimeline: function (){
        var container = document.getElementById('vis'+this.props.gameid);
        var options = {};
        console.log(this.props.events);
        var items = new vis.DataSet([
            {id: 1, content: 'Game Start', start: this.props.events.gameStart},
            {id: 3, content: 'Right Shrine Destroyed', start: this.props.events.RightShrineDestroyed},
            {id: 5, content: 'Left Shrine Destroyed', start: this.props.events.LeftShrineDestroyed},
            {id: 6, content: 'Game Over', start: this.props.events.GameOver}
        ]); 
        var timeline = new vis.Timeline(container, items, options);
    }
    
});

var Game = React.createClass({
    render: function(){
        console.log(this.props.gameInfo.events.gameStart);
        var url = "/#/gameDetails/"+this.props.gameInfo.events.gameStart;
        return (
            <a className="list-group-item">
                <div className="row">
                    <div className="col-md-4">Floating</div>
                    <div className="col-md-4">{this.props.gameInfo.gametime}</div>
                    <div className="col-md-4">{this.props.gameInfo.winning_team}</div>
                </div>
                <GameDetails gameid={this.props.gameid} events={this.props.gameInfo.events}>
                </GameDetails>
            </a>
        );
    }
});

var GamesList = React.createClass({
    render: function() {
        var json = [];
        if(this.props.data != ""){
            json = JSON.parse(this.props.data);
        }
        var gameNodes = json.map(function(game) {
            return (
                <Game gameInfo={game.GameInfo} gameid={game._id} key={game._id}>
                </Game>
            );
        });
        return (
            <div>
                <div className="list-group">
                    <a className="list-group-item active">
                        <div className="row">
                            <div className="col-md-4">Map</div>
                            <div className="col-md-4">Time</div>
                            <div className="col-md-4">WinningTeam</div>
                        </div>
                    </a>
                    {gameNodes}
                </div>
            </div>
        );
    }
});

var Page = React.createClass({
    loadGamesFromServer: function() {
        $.ajax({
            url: "http://52.35.193.149:8080/Vanguards/GetGamesList",
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function(){
        return {data:[]};
    },
    componentDidMount: function() {
        this.loadGamesFromServer();
        //setInterval(this.loadGamesFromServer, 2000);
    },
    render: function() {
        return (
        <div>
            <h1>Recorded Games</h1>
            <GamesList data={this.state.data} />
        </div>
        );
  }
});

// Run the routes
var routes = (
      <Router>
        <Route name="app" path="/" component={App}>
          <Route name="page" path="/page" component={Page} />
          <Route name="gameDetails" path="/gameDetails/:gamestart" component={GameDetails}/>
          <Route name="home" path="/" component={GameDetails}/>
          <Route path="*" component={Home}/>
        </Route>
      </Router>
);

ReactDOM.render(routes, document.getElementById('content'));