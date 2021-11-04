import React, { useContext, useEffect } from 'react';

import Posts from './components/Posts';
import Selector from './components/Selector';
import RedditContext from './context/RedditContext';

export default function App() {
  const { selectedSubreddit, fetchPosts, postsBySubreddit, isFetching, refreshSubreddit } = useContext(RedditContext);
  console.log(postsBySubreddit);
  const { items: posts = [] } = postsBySubreddit[selectedSubreddit];
  const isEmpty = posts.length === 0;
  
  useEffect(() => fetchPosts(), [fetchPosts])

  const renderLastUpdatedAt = () => {
    const { lastUpdated } = postsBySubreddit[selectedSubreddit];

    if (!lastUpdated) return null;

    return (
      <span>
        {`Last updated at ${new Date(lastUpdated).toLocaleTimeString()}.`}
      </span>
    );
  }

  const renderRefreshButton = () => {
    if (isFetching) return null;

    return (
      <button
        type="button"
        onClick={() => refreshSubreddit(true)}
        disabled={isFetching}
      >
        Refresh
      </button>
    );
  }


  return (
    <div>
      <Selector />
      <div>
        { renderLastUpdatedAt() }
        { renderRefreshButton() }
      </div>
      {isFetching && <h2>Loading...</h2>}
      {!isFetching && isEmpty && <h2>Empty.</h2>}
      {!isFetching && !isEmpty && <Posts />}
    </div>
  );
}
