import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardMedia, CardTitle} from 'material-ui/Card';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import './App.css';

const muiTheme = getMuiTheme({
  palette: {
  },
  paper: {
  }
});

class Quiz extends Component {
  constructor(props){
    super(props);
    this.state = {
      ...props.data.selectGame(),
      isCorrect: null,
      clicked: null,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleNewGame = this.handleNewGame.bind(this);
  }

  handleClick = (e) => {
    e.preventDefault();
    this.setState({
      isCorrect: _.findIndex(
        this.state.author.books,
        (book) => { return book === e.target.innerText}
      ) >= 0,
      clicked: e.target.innerText
    });
  }

  handleNewGame = () => {
    this.setState({
      ...this.props.data.selectGame(),
      isCorrect: null,
      clicked: null,
    });
  }

  render(){
    const source = (this.state.author.imageSource)? "Source: " + this.state.author.imageSource : "";
    const attribution = (this.state.author.imageAttribution)? "Photo by: " + this.state.author.imageAttribution : "";
    return (
      <div id='main'>
        <Card id='question'
          zDepth={1} >
          <CardMedia className="col"
            overlay={ (source.length > 0 || attribution.length > 0) ?
            <CardTitle 
              style={{
                padding: "0px 16px 8px 16px"
              }}
              title={ attribution }
              titleStyle = {{
                fontSize: "14px",
                lineHeight: "16px"
              }}
              subtitle={ source } />
          : null}>
            <img
              src={this.state.author.imageUrl}
              alt={ (attribution.length > 0 && source.length > 0) ? 
                source + ", " + attribution : 
                source + attribution } />
          </CardMedia>
        </Card>
        <Card id='answer'
          zDepth={1}>
          {this.state.books.map((book, i) =>
            <div  
              key={i}
              className="col">
              <Book
                handleClick={this.handleClick}
                isCorrect={this.state.isCorrect}
                clicked={this.state.clicked === book}
                title = {book} />
            </div>
          )}
        </Card>
        {(this.state.isCorrect) &&
          <RaisedButton
            id='continue'
            label='Continue'
            primary={true}
            onTouchTap={this.handleNewGame}
            fullWidth={true} />
        }
      </div>
    )
  }
}

Quiz.propTypes = {
  data: PropTypes.array.isRequired,
  handleClick: PropTypes.func,
}

class Book extends Component {
  render(){
    return (
      <MenuItem  
        value={this.props.title}
        className={(this.props.clicked)? (this.props.isCorrect)? 'green':'red' : null}
        onTouchTap= {this.props.handleClick}
        primaryText={this.props.title}
      />
    )
  }
}

class App extends Component {
  constructor(props){
    super(props);
    this.Data = [
      {
          name: 'Mark Twain', 
          imageUrl: 'images/authors/marktwain.jpg',
          books: ['The Adventures of Huckleberry Finn']
      },
      {
          name: 'Joseph Conrad',
          imageUrl: 'images/authors/josephconrad.png',
          books: ['Heart of Darkness']
      },
      {
          name: 'J.K. Rowling',
          imageUrl: 'images/authors/jkrowling.jpg',
          imageSource: 'Wikimedia Commons',
          imageAttribution: 'Daniel Ogren',
          books: ['Harry Potter and the Sorcerers Stone']
      },
      {
          name: 'Stephen King',
          imageUrl: 'images/authors/stephenking.jpg',
          imageSource: 'Wikimedia Commons',
          imageAttribution: 'Pinguino',
          books: ['The Shining','IT']
      },
      {
          name: 'Charles Dickens',
          imageUrl: 'images/authors/charlesdickens.jpg',
          imageSource: 'Wikimedia Commons',
          books: ['David Copperfield', 'A Tale of Two Cities']
      },
      {
          name: 'William Shakespeare',
          imageUrl: 'images/authors/williamshakespeare.jpg',
          imageSource: 'Wikimedia Commons',
          books: ['Hamlet', 'Macbeth', 'Romeo and Juliet']
      }
    ];

    this.Data.selectGame = () => {
      let books = _.shuffle(this.Data.reduce((p,c,i)=>{
        return p.concat(c.books);
      },[])).slice(0,4);

      let answer = books[ _.random( books.length - 1 )];

      console.log(answer);
      return {
        books: books,
        author: _.find(this.Data, author => {
          return author.books.some( title => {
            return title === answer;
          });
        })
      };
    }


  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme} >
        <div className="App">
          <AppBar
            className="AppBar"
            title="Author Quiz"
            iconClassNameRight="muidocs-icon-navigation-expand-more" />
          <Paper 
            className="jumbotron" 
            style={{backgroundColor: 'rgb(237,235,230)'}}
            zDepth={1} >
            <h1>Author Quiz</h1>
            <h3>Select the book written by the author shown</h3>
          </Paper>
          <Quiz data = {this.Data} />
          <br/>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
