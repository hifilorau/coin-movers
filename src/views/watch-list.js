// src/components/About/index.js
import React, { PropTypes, Component } from 'react';

export default class WatchList extends Component {
  // static propTypes = {}
  // static defaultProps = {}
  // state = {}

  render() {
    const {  ...props } = this.props;
    return (
      <div className="watch-list-outer">
        <h1>
          My Watchlist
        </h1>
        <ul>
            <li>1</li>
            <li>1</li>
        </ul>
      </div>
    );
  }
}
