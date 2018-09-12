import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.css';
import Game from './Game';
import EndWin from './EndWin';
import EndLose from './EndLose';
import EndSurrender from './EndSurrender';
import Start from './Start';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route path="/" exact component={Start}/>
          <Route path="/play" component={Game} />
          <Route path="/win" component={EndWin} />
          <Route path="/lose" component={EndLose} />
          <Route path="/surrender" component={EndSurrender} />
        </Switch>
      </div>
    )
  }
}

export default App;
