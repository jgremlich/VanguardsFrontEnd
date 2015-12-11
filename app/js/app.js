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
                <a className="navbar-brand" href="/#/home">Vanguards</a>
              </div>
              <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul className="nav navbar-nav">
                  <li><Link to="page">Games</Link></li>
                </ul>
				<ul className="nav navbar-nav">
                  <li><Link to="abilityInfoPage">Ability Info</Link></li>
                </ul>
				<ul className="nav navbar-nav">
                  <li><Link to="download">Download</Link></li>
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
        <h1>Vanguards</h1>
        <SignupForm />
        
      </div>
    );
  }
});

var SignupForm = React.createClass({
  getInitialState: function() {
    return {username: '', password: ''};
  },

  handleUsernameChange: function(e) {
    this.setState({username: e.target.value});
  },

  handlePasswordChange: function(e) {
    this.setState({password: e.target.value});
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var username = this.state.username.trim();
    var password = this.state.password.trim();
    if (!username || !password){
      return;
    }
    this.handleSignupSubmit({username: username, password: password, role: "none", account_level: 1});//this.props.onSignupSubmit({username: username, password: password});
    this.setState({username: '', password: ''});
  },

  handleSignupSubmit: function(user){
    $.ajax({
      url: "http://52.35.193.149:8080/Vanguards/CreateUser",
      dataType: 'json',
      type: 'POST',
      data: user,
      success: function(data){
        this.setState({data:data});
        console.log(data);
      }.bind(this),
      error: function(xhr, status, err){
        console.error("http://52.35.193.149:8080/Vanguards/CreateUser", status, err.toString());
      }.bind(this)
    });
  },

  render: function() {
    return (
      <div>
        <h3>Create Account</h3>
        <form className="signupForm" onSubmit={this.handleSubmit}>
          <input type="text" placeholder="Username" value={this.state.username} onChange={this.handleUsernameChange} /><br/><br/>
          <input type="password" placeholder="Password" value={this.state.password} onChange={this.handlePasswordChange} /><br/><br/><br/>
          <input type="submit" value="Create" />
        </form>
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
var PlayerAbilityHeader = React.createClass({
   render: function(){
        var url = "/#/playerAbilities/"+this.props.id;
        var abilitySetNodes = this.props.abilitySets.map(function(abSet){
            return (
                <PlayerAbilitySet key={Math.random(0, 1000000)} ab1={abSet.Ability1} ab2={abSet.Ability2} ab3={abSet.Ability3} 
                ab4={abSet.Ability4} numPicked={abSet.TimesPicked} lastPicked={abSet.LastPicked}>
                </PlayerAbilitySet>
            );
        });
        var singlePickedNodes = this.props.singleAbilities.map(function(abset){
            return (
                <PlayerSinglePickedAbility key={Math.random(0, 1000000)} abilityName={abset.Ability} numPicked={abset.TimesPicked} lastPicked={abset.LastPicked}>
                </PlayerSinglePickedAbility>
            
            );
        });
        return (
        <div>
                <a className="list-group-item">
                <div className="row">Username: {this.props.username}</div>
                </a>
                <a className="list-group-item">
                <div className="row">Ability Sets</div>
                </a>
                {abilitySetNodes}
                <a className="list-group-item">
                <div className="row">Single Ability Picks</div>
                </a>
                {singlePickedNodes}
        </div>
            

        );
    } 
});

var PlayerAbilitySet = React.createClass({
    render: function(){
        var img1 = this.props.ab1 + ".png"
        var img2 = this.props.ab2 + ".png"
        var img3 = this.props.ab3 + ".png"
        var img4 = this.props.ab4 + ".png"
        return (
        <a className="list-group-item">
                    <div className="row">
                        <img className="col-md-1" src={img1} alt={this.props.ab1}></img>
                        <img className="col-md-1" src={img2} alt={this.props.ab2}></img>
                        <img className="col-md-1" src={img3} alt={this.props.ab3}></img>
                        <img className="col-md-1" src={img4} alt={this.props.ab4}></img>
                        <div className="col-md-2">{this.props.numPicked}</div>
                        <div className="col-md-2">{this.props.lastPicked}</div>
                    </div>
            </a>
        );
    }
});

var PlayerSinglePickedAbility = React.createClass({
    render: function(){
        var img1 = this.props.abilityName + ".png"
        return (
        <a className="list-group-item">
                    <div className="row">
                        <img className="col-md-1" src={img1} alt={this.props.abilityName}></img>
                        <div className="col-md-4">{this.props.numPicked}</div>
                        <div className="col-md-4">{this.props.lastPicked}</div>
                    </div>
            </a>
        );
    }
    
});

var AbilityData = React.createClass({
    render: function() {
        console.log(this.props.data);
        var json = [];
        if(this.props.data != ""){
            json = JSON.parse(this.props.data);
            console.log(json);
        }
        var usernameNodes = json.map(function(userAbilityData) {
            return (
                <PlayerAbilityHeader username={userAbilityData.Username} key={userAbilityData._id} abilitySets={userAbilityData.AbilitySets} singleAbilities={userAbilityData.SingleAbilityPicks}>
                </PlayerAbilityHeader>
            );
        });
        return (
            <div>
                <div className="list-group">
                    <a className="list-group-item active">
                        <div className="row">
                            <div className="col-md-4">GameID</div>
                            <div className="col-md-4">Time</div>
                            <div className="col-md-4">WinningTeam</div>
                        </div>
                    </a>
                    {usernameNodes}
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

var Download = React.createClass({
    render: function() {
        return (
        <div>
            <h1>Download our game!</h1>
            <a href="http://52.35.193.149:8080/Vanguards/DownloadGame" className="btn btn-lg btn-primary">Download</a>
        </div>
        );
  }
});
var AbilityInfoPage = React.createClass({
    loadAbilityDataFromServer: function() {
        $.ajax({
            url: "http://52.35.193.149:8080/Vanguards/RawPlayerAbilityData",
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({data: data});
                console.log("Retreived data from server");
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
        this.loadAbilityDataFromServer();
        //setInterval(this.loadAbilityDataFromServer, 2000);
    },
    render: function() {
        return (
        <div>
            <h1>AbilityInfo</h1>
            <AbilityData data={this.state.data} />
        </div>
        );
  }
});

// Run the routes
var routes = (
      <Router>
        <Route path="/" component={App}>
          <Route path="page" component={Page} />
          <Route path="abilityInfoPage" component={AbilityInfoPage} />
    		  <Route path="download" component={Download} />
          <Route path="gameDetails/:gameid" component={GameDetails}/>
          <Route path="*" component={Home}/>
        </Route>
      </Router>
);

ReactDOM.render(routes, document.getElementById('content'));