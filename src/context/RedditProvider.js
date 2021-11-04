import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { getPostsBySubreddit } from '../services/redditAPI';
import RedditContext from '../context/RedditContext';

export default function RedditProvider({ children }) {
  const [postsBySubreddit, setPostsBySubreddit] = useState({
    frontend: { },
    reactjs: { },
  });
  const [selectedSubreddit, setSelectedSubreddit] = useState('reactjs');
  const [shouldRefreshSubreddit, setShouldRefreshSubreddit] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (selectedSubreddit || shouldRefreshSubreddit) {
      fetchPosts();
      console.log(1);
    }
  })


  const fetchPosts = () => {
    if (!shouldFetchPosts()) return;
    setIsFetching(true);
    setShouldRefreshSubreddit(false);
    getPostsBySubreddit(selectedSubreddit)
      .then(handleFetchSuccess, handleFetchError);
  }

  const shouldFetchPosts = () => {
    const posts = postsBySubreddit[selectedSubreddit];

    if (!posts.items) return true;
    if (isFetching) return false;
    return shouldRefreshSubreddit;
  }

  const handleFetchSuccess = (json) => {
    const lastUpdated = Date.now();
    const items = json.data.children.map((child) => child.data);

    setIsFetching(false);
    setShouldRefreshSubreddit(false);
    setPostsBySubreddit({...postsBySubreddit,
      [selectedSubreddit]:  {
        items,
        lastUpdated,
      }
    });
  }

  const handleFetchError = (error) => {
    setIsFetching(false);
    setShouldRefreshSubreddit(false);
    setPostsBySubreddit({...postsBySubreddit,
      [selectedSubreddit]:  {
        error: error.message,
        items: [],
      }
    });
  }

  const context = {
    selectSubreddit: setSelectedSubreddit,
    fetchPosts: fetchPosts,
    refreshSubreddit: setShouldRefreshSubreddit,
    availableSubreddits: Object.keys(postsBySubreddit),
    posts: postsBySubreddit[selectedSubreddit].items,
    postsBySubreddit,
    isFetching,
  };

  return (
    <RedditContext.Provider value={context}>
      {children}
    </RedditContext.Provider>
  );
}

RedditProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
