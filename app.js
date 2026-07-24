document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements selection
  const body = document.body;
  const themeToggle = document.getElementById('theme-toggle');
  const searchInput = document.getElementById('search-input');
  const currentCountDisplay = document.getElementById('current-count-display');
  const statPostCount = document.getElementById('stat-post-count');
  
  const layoutGridBtn = document.getElementById('layout-grid-btn');
  const layoutListBtn = document.getElementById('layout-list-btn');
  const blogGrid = document.getElementById('blog-grid');
  
  const blogsIndexView = document.getElementById('blogs-index-view');
  const readerView = document.getElementById('reader-view');
  const navBlogsLink = document.getElementById('nav-blogs-link');
  const navLogo = document.getElementById('nav-logo');

  // Expanded Filter DOM bindings
  const filterToggleBtn = document.getElementById('filter-toggle-btn');
  const filterPanel = document.getElementById('filter-panel');
  const filterTagsContainer = document.getElementById('filter-tags');
  const sortSelect = document.getElementById('sort-select');
  const clearAllBtn = document.getElementById('clear-all-btn');

  let readingProgressBar = null;

  // Application State
  let state = {
    searchQuery: '',
    selectedTag: 'ALL',
    sortOrder: 'newest',
    viewLayout: localStorage.getItem('blog-layout') || 'grid', // 'grid' or 'list'
    theme: localStorage.getItem('theme') || 'light'
  };

  // 1. Theme Configuration
  const applyTheme = (themeName) => {
    if (themeName === 'dark') {
      body.setAttribute('data-theme', 'dark');
    } else {
      body.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', themeName);
    state.theme = themeName;
  };

  // Toggle Theme Click Event
  themeToggle.addEventListener('click', () => {
    const nextTheme = state.theme === 'light' ? 'dark' : 'light';
    applyTheme(nextTheme);
  });

  // Set Initial Theme
  applyTheme(state.theme);

  // 2. Layout Grid/List Switcher
  const applyLayout = (layout) => {
    if (layout === 'list') {
      blogGrid.classList.add('list-view');
      layoutListBtn.classList.add('active');
      layoutGridBtn.classList.remove('active');
    } else {
      blogGrid.classList.remove('list-view');
      layoutGridBtn.classList.add('active');
      layoutListBtn.classList.remove('active');
    }
    localStorage.setItem('blog-layout', layout);
    state.viewLayout = layout;
  };

  layoutGridBtn.addEventListener('click', () => {
    applyLayout('grid');
    renderBlogPosts();
  });
  layoutListBtn.addEventListener('click', () => {
    applyLayout('list');
    renderBlogPosts();
  });

  // Initialize Layout
  applyLayout(state.viewLayout);

  // Date Parsing Helper (converts '13 JUL 2026' or 'JUL 2026' into Date objects for sorting)
  const parseDate = (dateStr) => {
    const parts = dateStr.trim().split(' ');
    if (parts.length < 2) return new Date(0);
    
    let monthStr = parts[0];
    let yearStr = parts[1];
    if (parts.length === 3) {
      monthStr = parts[1];
      yearStr = parts[2];
    }
    
    const months = { JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5, JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11 };
    const month = months[monthStr.toUpperCase()] !== undefined ? months[monthStr.toUpperCase()] : 0;
    const year = parseInt(yearStr, 10) || 2026;
    
    return new Date(year, month, 1);
  };

  const getPostViews = (postId) => {
    const key = `blog_views_${postId}`;
    const stored = localStorage.getItem(key);
    if (stored !== null) {
      return parseInt(stored, 10);
    }
    return 1;
  };

  const fetchGlobalViews = async (postId) => {
    try {
      const res = await fetch(`https://api.counterapi.dev/v1/techblogs-${postId}/views/`);
      if (res.ok) {
        const data = await res.json();
        const liveCount = data.count || 1;
        localStorage.setItem(`blog_views_${postId}`, liveCount.toString());
        return liveCount;
      }
    } catch (e) {
      console.warn('Live counter API offline, using cached count:', e);
    }
    return getPostViews(postId);
  };

  const incrementGlobalViews = async (postId) => {
    try {
      const res = await fetch(`https://api.counterapi.dev/v1/techblogs-${postId}/views/up/`);
      if (res.ok) {
        const data = await res.json();
        const liveCount = data.count || 1;
        localStorage.setItem(`blog_views_${postId}`, liveCount.toString());
        return liveCount;
      }
    } catch (e) {
      console.warn('Live counter API offline, using local count:', e);
    }
    return getPostViews(postId);
  };

  const hasUserViewedPost = (postId) => {
    return sessionStorage.getItem(`viewed_blog_${postId}`) === 'true';
  };

  const markPostAsViewed = (postId) => {
    sessionStorage.setItem(`viewed_blog_${postId}`, 'true');
  };

  const getPostComments = (postId) => {
    const key = `blog_comments_${postId}`;
    const stored = localStorage.getItem(key);
    if (stored !== null) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse comments', e);
      }
    }
    return [];
  };

  const fetchLiveComments = async (postId) => {
    const cacheKey = `blog_comments_${postId}`;
    const commentIdsKey = `blog_comment_ids_${postId}`;
    let commentIds = [];
    try {
      commentIds = JSON.parse(localStorage.getItem(commentIdsKey) || '[]');
    } catch (e) {}

    if (commentIds.length > 0) {
      try {
        const idParams = commentIds.map(id => `id=${id}`).join('&');
        const res = await fetch(`https://api.restful-api.dev/objects?${idParams}`);
        if (res.ok) {
          const dataList = await res.json();
          const liveComments = dataList.map(item => ({
            id: item.id,
            author: item.data.author,
            date: item.data.date,
            content: item.data.content,
            avatar: item.data.avatar || item.data.author.charAt(0).toUpperCase()
          }));
          localStorage.setItem(cacheKey, JSON.stringify(liveComments));
          return liveComments;
        }
      } catch (err) {
        console.warn('Live comments fetch error, using local cache:', err);
      }
    }

    return getPostComments(postId);
  };

  const postLiveComment = async (postId, author, content) => {
    const cleanAuthor = author.trim();
    const cleanContent = content.trim();
    const dateStr = 'Just now';
    
    const commentData = {
      postId: postId,
      author: cleanAuthor,
      content: cleanContent,
      date: dateStr,
      avatar: cleanAuthor.charAt(0).toUpperCase()
    };

    let newCommentObj = {
      id: Date.now().toString(),
      ...commentData
    };

    try {
      const res = await fetch('https://api.restful-api.dev/objects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `techblogs_comment_${postId}`,
          data: commentData
        })
      });
      if (res.ok) {
        const resData = await res.json();
        if (resData && resData.id) {
          newCommentObj.id = resData.id;
          
          const commentIdsKey = `blog_comment_ids_${postId}`;
          const currentIds = JSON.parse(localStorage.getItem(commentIdsKey) || '[]');
          currentIds.unshift(resData.id);
          localStorage.setItem(commentIdsKey, JSON.stringify(currentIds));
        }
      }
    } catch (e) {
      console.warn('Live post comment error, saving locally:', e);
    }

    const cacheKey = `blog_comments_${postId}`;
    const currentComments = getPostComments(postId);
    currentComments.unshift(newCommentObj);
    localStorage.setItem(cacheKey, JSON.stringify(currentComments));
    return currentComments;
  };

  const renderCommentsListHTML = (comments) => {
    if (!comments || comments.length === 0) {
      return `<div class="no-comments-notice">No comments yet. Be the first to join the discussion!</div>`;
    }
    return comments.map(c => `
      <div class="comment-card reveal-item">
        <div class="comment-avatar">${c.avatar || c.author.charAt(0).toUpperCase()}</div>
        <div class="comment-body">
          <div class="comment-meta">
            <span class="comment-author-name">${c.author}</span>
            <span class="comment-date">${c.date}</span>
          </div>
          <div class="comment-content-text">${c.content}</div>
        </div>
      </div>
    `).join('');
  };

  // Compile unique tags dynamically from the posts database
  const updateFilterPills = () => {
    const posts = window.BLOG_POSTS;
    const totalCount = posts.length;

    // Compile Tag stats
    const tagCounts = {};
    posts.forEach(post => {
      post.tags.forEach(tag => {
        const cleanTag = tag.trim().toUpperCase();
        tagCounts[cleanTag] = (tagCounts[cleanTag] || 0) + 1;
      });
    });

    filterTagsContainer.innerHTML = '';

    // Add ALL TAGS button
    const allTagsBtn = document.createElement('button');
    allTagsBtn.className = `filter-pill${state.selectedTag === 'ALL' ? ' active' : ''}`;
    allTagsBtn.dataset.tag = 'ALL';
    allTagsBtn.innerHTML = `ALL TAGS <span>${totalCount}</span>`;
    filterTagsContainer.appendChild(allTagsBtn);

    // Sort tags by frequency descending
    const sortedTags = Object.keys(tagCounts).sort((a, b) => {
      const countDiff = tagCounts[b] - tagCounts[a];
      return countDiff !== 0 ? countDiff : a.localeCompare(b);
    });

    sortedTags.forEach(tag => {
      const btn = document.createElement('button');
      btn.className = `filter-pill${state.selectedTag === tag ? ' active' : ''}`;
      btn.dataset.tag = tag;
      btn.innerHTML = `${tag} <span>${tagCounts[tag]}</span>`;
      filterTagsContainer.appendChild(btn);
    });
  };

  // Render Blog Grid with full Filter and Sort overrides
  const renderBlogPosts = () => {
    blogGrid.innerHTML = '';
    
    let filteredPosts = window.BLOG_POSTS.filter(post => {
      // 1. Tag Match
      const tagMatch = state.selectedTag === 'ALL' || post.tags.some(t => t.toUpperCase() === state.selectedTag);
      
      // 2. Search Match (Title, Summary, or Tags)
      const searchLower = state.searchQuery.toLowerCase();
      const searchMatch = !state.searchQuery || 
        post.title.toLowerCase().includes(searchLower) ||
        post.summary.toLowerCase().includes(searchLower) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchLower));
        
      return tagMatch && searchMatch;
    });

    // Sort posts
    filteredPosts.sort((a, b) => {
      if (state.sortOrder === 'newest') {
        return parseDate(b.date) - parseDate(a.date);
      }
      if (state.sortOrder === 'oldest') {
        return parseDate(a.date) - parseDate(b.date);
      }
      if (state.sortOrder === 'title-asc') {
        return a.title.localeCompare(b.title);
      }
      if (state.sortOrder === 'title-desc') {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });

    // Update dynamic toolbar counter display
    currentCountDisplay.textContent = `${filteredPosts.length} posts`;
    
    if (filteredPosts.length === 0) {
      blogGrid.innerHTML = `
        <div class="no-results fade-in">
          <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"></path>
          </svg>
          <h3>No articles found</h3>
          <p>We couldn't find any blog posts matching the selected search query and filter criteria.</p>
        </div>
      `;
      return;
    }

    // Sync class list with layout type
    if (state.viewLayout === 'list') {
      blogGrid.classList.add('list-view');
      blogGrid.innerHTML = '';
      
      // Group posts by year
      const postsByYear = {};
      filteredPosts.forEach(post => {
        const parts = post.date.split(' ');
        const year = parts[2] || '2026';
        if (!postsByYear[year]) {
          postsByYear[year] = [];
        }
        postsByYear[year].push(post);
      });
      
      // Sort years descending
      const sortedYears = Object.keys(postsByYear).sort((a, b) => b - a);
      
      sortedYears.forEach(year => {
        const yearPosts = postsByYear[year];
        
        // Calculate total unique tags for this year
        const tagsSet = new Set();
        yearPosts.forEach(p => p.tags.forEach(t => tagsSet.add(t)));
        
        // Render Year Section header
        const yearHeader = document.createElement('div');
        yearHeader.className = 'list-year-section reveal-item';
        yearHeader.innerHTML = `
          <div class="list-year-info">
            <h2 class="list-year-title">${year}</h2>
            <span class="list-year-stats">${yearPosts.length} posts &bull; ${tagsSet.size} tags</span>
          </div>
        `;
        blogGrid.appendChild(yearHeader);
        
        // Render post rows for this year
        yearPosts.forEach((post, index) => {
          const row = document.createElement('a');
          row.href = `#post-${post.id}`;
          row.className = 'list-post-row reveal-item';
          row.style.transitionDelay = `${(index % 6) * 0.08}s`;
          
          const dateParts = post.date.split(' ');
          let day = '01';
          let month = 'JAN';
          if (dateParts.length === 3) {
            [day, month] = dateParts;
          } else if (dateParts.length === 2) {
            [month] = dateParts;
            day = '01';
          }
          
          row.innerHTML = `
            <div class="list-post-date">
              <span class="list-day">${day}</span>
              <span class="list-month">${month}</span>
            </div>
            <div class="list-post-details">
              <h3 class="list-post-title">${post.title}</h3>
              <p class="list-post-summary">${post.summary}</p>
            </div>
            <div class="list-post-type"><span class="type-pill">${post.type}</span></div>
            <div class="list-post-arrow">&rarr;</div>
          `;
          blogGrid.appendChild(row);
        });
      });
      
      setupScrollReveal();
      return;
    }

    blogGrid.classList.remove('list-view');

    // Render cards
    filteredPosts.forEach((post, index) => {
      const card = document.createElement('a');
      card.href = `#post-${post.id}`;
      // Highlight the latest (first) post in Grid layout
      const isFeatured = index === 0 && !blogGrid.classList.contains('list-view');
      card.className = `blog-card reveal-item${isFeatured ? ' featured-card' : ''}`;
      card.style.transitionDelay = `${(index % 6) * 0.08}s`;
      
      // Format card date to exclude the day number for grid view
      const cardDate = post.date.split(' ').slice(1).join(' ');
      
      card.innerHTML = `
        <div class="card-image-wrap">
          <img src="${post.coverImage}" alt="${post.title}" class="card-image" loading="lazy">
        </div>
        <div class="card-content">
          <div class="card-meta">
            <span class="card-type">${post.type}</span>
            <span class="card-date">${cardDate}</span>
            <span class="card-views">👁️ ${getPostViews(post.id)}</span>
          </div>
          <h2 class="card-title">${post.title}</h2>
          <p class="card-desc">${post.summary}</p>
          <div class="card-footer">
            <div class="card-tags">
              ${post.tags.map(tag => `<span class="card-tag">${tag}</span>`).join(' ')}
            </div>
            <span class="card-read-more">Read &rarr;</span>
          </div>
        </div>
      `;
      
      blogGrid.appendChild(card);
    });

    setupScrollReveal();
  };

  // 5. Expanded Filter Panel Event Listeners
  
  // Toggle panel visibility
  filterToggleBtn.addEventListener('click', () => {
    filterPanel.classList.toggle('open');
    filterToggleBtn.classList.toggle('active');
  });

  // TAG pill clicks
  filterTagsContainer.addEventListener('click', (e) => {
    const pill = e.target.closest('.filter-pill');
    if (!pill) return;
    state.selectedTag = pill.dataset.tag;
    updateFilterPills();
    renderBlogPosts();
  });

  // SORT change
  sortSelect.addEventListener('change', (e) => {
    state.sortOrder = e.target.value;
    renderBlogPosts();
  });

  // CLEAR ALL clicks
  clearAllBtn.addEventListener('click', () => {
    state.selectedTag = 'ALL';
    state.sortOrder = 'newest';
    state.searchQuery = '';
    
    searchInput.value = '';
    sortSelect.value = 'newest';
    
    updateFilterPills();
    renderBlogPosts();
  });

  // 6. Search Inputs Events
  searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    renderBlogPosts();
  });

  // Focus Search Bar on Command+K or Control+K shortcut
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    }
  });

  // 7. Route and View Controls
  const renderArticleReader = (postId) => {
    const post = window.BLOG_POSTS.find(p => p.id === postId);
    
    if (!post) {
      // Fallback if ID doesn't exist
      window.location.hash = '';
      return;
    }

    // Increment view counter
    const currentViews = incrementPostViews(postId);
    const comments = getPostComments(postId);

    const postIndex = window.BLOG_POSTS.findIndex(p => p.id === postId);
    const minutes = post.readTime.split(' ')[0];

    const dateParts = post.date.split(' ');
    let formattedPublishedDate = post.date;
    if (dateParts.length === 3) {
      const [d, m, y] = dateParts;
      const cleanMonth = m.charAt(0).toUpperCase() + m.slice(1).toLowerCase();
      formattedPublishedDate = `${cleanMonth} ${parseInt(d)}, ${y}`;
    }

    // Hide blog catalog listing, display article reading view
    blogsIndexView.style.display = 'none';
    readerView.style.display = 'block';
    
    // Create and append reading progress bar
    if (!readingProgressBar) {
      readingProgressBar = document.createElement('div');
      readingProgressBar.className = 'reading-progress-bar';
      document.body.appendChild(readingProgressBar);
    }
    readingProgressBar.style.width = '0%';
    readingProgressBar.style.display = 'block';
    
    // Smooth scroll to top of viewport
    window.scrollTo({ top: 0, behavior: 'instant' });

    readerView.innerHTML = `
      <div class="fade-in">
        <!-- Back Button Container -->
        <div class="reader-back-container">
          <button class="back-btn" id="reader-back-btn">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to Blogs
          </button>
        </div>

        <!-- Article Header Columns -->
        <div class="reader-header-grid">
          <!-- Left Column: Details -->
          <div class="reader-header-left">
            <div class="reader-breadcrumb">
              WRITING <span class="slash">/</span> ${post.title.toUpperCase()}
            </div>

            <h1 class="reader-title">${post.title}</h1>
            
            <p class="reader-summary">${post.summary}</p>
            
            <div class="reader-meta-table">
              <div class="meta-col">
                <div class="meta-label">PUBLISHED</div>
                <div class="meta-value">${formattedPublishedDate}</div>
              </div>
              <div class="meta-col">
                <div class="meta-label">READING</div>
                <div class="meta-value">${minutes} <span class="accent-text-orange">min</span></div>
              </div>
              <div class="meta-col">
                <div class="meta-label">VIEWS</div>
                <div class="meta-value view-count-badge"><span class="view-icon">👁️</span> <span id="post-view-count-val">${currentViews}</span></div>
              </div>
              <div class="meta-col">
                <div class="meta-label">KIND</div>
                <div class="meta-value">${post.type}</div>
              </div>
              <div class="meta-col">
                <div class="meta-label">TAGS</div>
                <div class="meta-value">${post.tags.map(t => t.replace('#', '')).join(', ')}</div>
              </div>
            </div>
          </div>
          
          <!-- Right Column: Card Image -->
          <div class="reader-header-right">
            <div class="reader-featured-card">
              <div class="reader-image-wrap">
                <img src="${post.coverImage}" alt="${post.title}">
              </div>
              <div class="reader-featured-caption">
                PLATE &middot; ${post.type.toUpperCase()} &middot; ${formattedPublishedDate.toUpperCase()}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Article Body Content -->
        <article class="reader-content">
          ${post.content}
        </article>

        <!-- Interactive Comments Section -->
        <section class="comments-section">
          <div class="comments-header">
            <h3 class="comments-title">
              Discussion <span class="comments-badge" id="comments-count-badge">${comments.length}</span>
            </h3>
          </div>

          <!-- New Comment Form Card -->
          <div class="comment-form-card">
            <form id="add-comment-form">
              <div class="comment-form-grid">
                <div class="form-group">
                  <label class="form-label" for="comment-author-input">Your Name</label>
                  <input type="text" id="comment-author-input" class="form-input" placeholder="e.g. Alex Morgan" required>
                </div>
                <div class="form-group">
                  <label class="form-label" for="comment-text-input">Your Comment</label>
                  <textarea id="comment-text-input" class="form-textarea" rows="3" placeholder="Share your thoughts on this article..." required></textarea>
                </div>
                <button type="submit" class="submit-comment-btn">
                  Post Comment &rarr;
                </button>
              </div>
            </form>
          </div>

          <!-- Comments List Container -->
          <div class="comments-list" id="comments-list-container">
            ${renderCommentsListHTML(comments)}
          </div>
        </section>
      </div>
    `;

    // Add scroll reveal class to all content paragraphs, subheadings, lists, code, quotes, and comments
    const contentElements = readerView.querySelectorAll('.reader-content > *, .reader-content li, .comments-section');
    contentElements.forEach((el, idx) => {
      el.classList.add('reveal-item');
      el.style.transitionDelay = `${(idx % 4) * 0.05}s`;
    });

    // Only increment view count once per unique session; otherwise fetch live count without incrementing
    if (!hasUserViewedPost(postId)) {
      markPostAsViewed(postId);
      incrementGlobalViews(postId).then(liveCount => {
        const valEl = document.getElementById('post-view-count-val');
        if (valEl) {
          valEl.textContent = liveCount;
        }
      });
    } else {
      fetchGlobalViews(postId).then(liveCount => {
        const valEl = document.getElementById('post-view-count-val');
        if (valEl) {
          valEl.textContent = liveCount;
        }
      });
    }

    // Bind reader back button to restore route
    document.getElementById('reader-back-btn').addEventListener('click', () => {
      window.location.hash = '';
    });

    // Asynchronously fetch live global comments
    fetchLiveComments(postId).then(liveComments => {
      const commentsContainer = document.getElementById('comments-list-container');
      const countBadge = document.getElementById('comments-count-badge');
      if (commentsContainer) {
        commentsContainer.innerHTML = renderCommentsListHTML(liveComments);
      }
      if (countBadge) {
        countBadge.textContent = liveComments.length;
      }
      setupScrollReveal();
    });

    // Form listener for adding a new comment live
    const commentForm = document.getElementById('add-comment-form');
    if (commentForm) {
      commentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const authorInput = document.getElementById('comment-author-input');
        const textInput = document.getElementById('comment-text-input');
        const author = authorInput.value.trim();
        const content = textInput.value.trim();

        if (!author || !content) return;

        const updatedComments = await postLiveComment(postId, author, content);

        // Re-render comments list dynamically
        const commentsContainer = document.getElementById('comments-list-container');
        const countBadge = document.getElementById('comments-count-badge');
        if (commentsContainer) {
          commentsContainer.innerHTML = renderCommentsListHTML(updatedComments);
        }
        if (countBadge) {
          countBadge.textContent = updatedComments.length;
        }

        // Reset form inputs
        authorInput.value = '';
        textInput.value = '';

        setupScrollReveal();
      });
    }

    setupScrollReveal();
  };

  const handleRouting = () => {
    const hash = window.location.hash;
    
    if (hash.startsWith('#post-')) {
      const postId = hash.replace('#post-', '');
      renderArticleReader(postId);
      navBlogsLink.classList.remove('active');
    } else {
      // Restore main listing index view
      readerView.style.display = 'none';
      blogsIndexView.style.display = 'block';
      blogsIndexView.classList.remove('fade-in');
      void blogsIndexView.offsetWidth; // trigger reflow
      blogsIndexView.classList.add('fade-in');
      navBlogsLink.classList.add('active');
      
      // Hide reading progress bar
      if (readingProgressBar) {
        readingProgressBar.style.display = 'none';
      }
      
      // Sync view with state queries
      renderBlogPosts();
    }
  };

  // Listen for hash routing triggers
  window.addEventListener('hashchange', handleRouting);
  
  // Navigation Logo and Blogs click return home
  const goHome = (e) => {
    e.preventDefault();
    if (window.location.hash === '') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.hash = '';
    }
  };
  
  navBlogsLink.addEventListener('click', goHome);
  navLogo.addEventListener('click', goHome);

  // Setup Intersection Observer scroll reveal triggers
  const setupScrollReveal = () => {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.05
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal-item').forEach(item => {
      observer.observe(item);
    });
  };

  // Shrink navigation bar and update reading progress bar dynamically
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Update reading progress bar if visible
    if (readingProgressBar && readingProgressBar.style.display === 'block') {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const progress = (window.scrollY / scrollHeight) * 100;
        readingProgressBar.style.width = `${progress}%`;
      }
    }
  });

  // Set Total blog count inside header statistics dynamically
  if (statPostCount) {
    statPostCount.textContent = window.BLOG_POSTS.length;
  }

  // Populate dynamic kind & tag stats
  updateFilterPills();

  // Initialize Routing on Page Load
  handleRouting();
});
