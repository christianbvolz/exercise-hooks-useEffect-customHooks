import React, { useContext } from 'react';
import RedditContext from '../context/RedditContext';


export default function Selector() {
  const { selectedSubreddit, availableSubreddits, selectSubreddit } = useContext(RedditContext);

  const renderOptions = (options) => (
    options.map((option) => (
      <option
        value={option}
        key={option}
      >
        {option}
      </option>
    ))
  );

  return (
    <span>
      <h1>{`Selected: ${selectedSubreddit}`}</h1>
      <select
        onChange={(e) => selectSubreddit(e.target.value)}
        value={selectedSubreddit}
      >
        {renderOptions(availableSubreddits)}
      </select>
    </span>
  )
};
