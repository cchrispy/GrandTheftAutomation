import React, { Component } from 'react';
import { connect } from 'react-redux';
import createCommand from '../actions/UserCommandAction.js';
import changeLevel from '../actions/changeLevel.js';

class Footer extends Component {
  // == REACT FUNCTIONS =====================================================
  constructor(props) {
    super(props);
    this.state = {
      level: this.props.level
    };
  }

  // == CUSTOM FUNCTIONS ====================================================
  previousLevel(e) {
    e.preventDefault();
    if (this.props.level > 1) {
      this.props.changeLevel(this.props.level - 1);
    }
  }

  nextLevel(e) {                                                              // go to next level
    e.preventDefault();
    if (this.props.level < 4) {
      this.props.changeLevel(this.props.level + 1);
    }
  }

  refresh() {
    
  }

  // == RENDER FOOTER =======================================================
  render() {
    return (
      <footer className='footer'>
        <div className='container'>
          <button 
            className='btn btn-primary col-xs-1'
            onClick={ this.previousLevel.bind(this) } >
          Back
          </button>
          <h5 className='col-xs-10 text-center'>{ this.props.level } / 4</h5>
          <button 
            className='btn btn-primary col-xs-1'
            onClick={ this.nextLevel.bind(this) } >
          Next
          </button>
        </div>
      </footer>  
    );
  }
}

var mapStateToProps = state => {
  return {
    level: state.level
  }
}

var mapDispatchToProps = dispatch => {
  return {
    changeLevel: (level) => {
      dispatch(changeLevel(level));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Footer);