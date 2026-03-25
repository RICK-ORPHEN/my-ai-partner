/**
 * Community Routes
 * Handles community posts, discussions, and interactions
 */

const express = require('express');
const { supabase } = require('../lib/supabase');
const { authMiddleware, optionalAuthMiddleware } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/community/posts
 * Get all community posts with pagination
 *
 * @query {string} category - Filter by category (general, lessons, projects, etc)
 * @query {string} sort - Sort by (recent, popular, trending)
 * @query {number} offset - Pagination offset
 * @query {number} limit - Items per page
 * @returns {Array} Community posts
 */
router.get('/posts', optionalAuthMiddleware, async (req, res) => {
  try {
    const { category, sort = 'recent', offset = 0, limit = 20 } = req.query;
    const pageOffset = Math.max(0, parseInt(offset) || 0);
    const pageLimit = Math.min(100, Math.max(1, parseInt(limit) || 20));

    let query = supabase.from('community_posts').select(
      `
      id,
      user_id,
      title,
      content,
      category,
      likes_count,
      replies_count,
      created_at,
      users(id, name)
    `
    );

    if (category) {
      query = query.eq('category', category);
    }

    // Determine sort order
    const orderBy = sort === 'popular' ? 'likes_count' : 'created_at';
    const ascending = sort === 'trending' ? false : sort !== 'popular';

    const { data: posts, error } = await query
      .order(orderBy, { ascending })
      .range(pageOffset, pageOffset + pageLimit - 1);

    if (error) {
      return res.status(500).json({
        error: 'Database Error',
        message: error.message,
      });
    }

    return res.status(200).json({
      total: posts?.length || 0,
      offset: pageOffset,
      limit: pageLimit,
      posts: posts || [],
    });
  } catch (error) {
    console.error('Get posts error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch posts',
    });
  }
});

/**
 * POST /api/community/posts
 * Create a new community post
 *
 * @body {string} title - Post title
 * @body {string} content - Post content
 * @body {string} category - Post category
 * @returns {Object} Created post
 */
router.post('/posts', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { title, content, category = 'general' } = req.body;

    // Validation
    if (!title || !content) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'title and content are required',
      });
    }

    if (title.length > 200) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'title must be less than 200 characters',
      });
    }

    // Create post
    const { data: post, error } = await supabase
      .from('community_posts')
      .insert([
        {
          user_id: userId,
          title,
          content,
          category,
        },
      ])
      .select('id, user_id, title, content, category, created_at')
      .single();

    if (error) {
      return res.status(400).json({
        error: 'Database Error',
        message: error.message,
      });
    }

    return res.status(201).json({
      message: 'Post created successfully',
      post,
    });
  } catch (error) {
    console.error('Create post error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create post',
    });
  }
});

/**
 * GET /api/community/posts/:id
 * Get a specific post with all replies
 *
 * @param {string} id - Post ID
 * @returns {Object} Post with replies
 */
router.get('/posts/:id', optionalAuthMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch post
    const { data: post, error } = await supabase
      .from('community_posts')
      .select(
        `
        id,
        user_id,
        title,
        content,
        category,
        likes_count,
        replies_count,
        created_at,
        updated_at,
        users(id, name)
      `
      )
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Post not found',
        });
      }
      return res.status(500).json({
        error: 'Database Error',
        message: error.message,
      });
    }

    // Fetch replies
    const { data: replies } = await supabase
      .from('community_replies')
      .select(
        `
        id,
        user_id,
        content,
        likes_count,
        created_at,
        users(id, name)
      `
      )
      .eq('post_id', id)
      .order('created_at', { ascending: true });

    return res.status(200).json({
      ...post,
      replies: replies || [],
    });
  } catch (error) {
    console.error('Get post error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch post',
    });
  }
});

/**
 * PUT /api/community/posts/:id
 * Update a community post (only by author)
 *
 * @param {string} id - Post ID
 * @body {string} title - Updated title
 * @body {string} content - Updated content
 * @returns {Object} Updated post
 */
router.put('/posts/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { title, content } = req.body;

    // Fetch post and verify ownership
    const { data: post, error: postError } = await supabase
      .from('community_posts')
      .select('user_id')
      .eq('id', id)
      .single();

    if (postError || !post) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Post not found',
      });
    }

    if (post.user_id !== userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only edit your own posts',
      });
    }

    // Update post
    const updateData = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;

    const { data: updated, error } = await supabase
      .from('community_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        error: 'Database Error',
        message: error.message,
      });
    }

    return res.status(200).json({
      message: 'Post updated successfully',
      post: updated,
    });
  } catch (error) {
    console.error('Update post error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update post',
    });
  }
});

/**
 * DELETE /api/community/posts/:id
 * Delete a community post (only by author or admin)
 *
 * @param {string} id - Post ID
 * @returns {Object} Success message
 */
router.delete('/posts/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    // Fetch post and verify ownership
    const { data: post, error: postError } = await supabase
      .from('community_posts')
      .select('user_id')
      .eq('id', id)
      .single();

    if (postError || !post) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Post not found',
      });
    }

    if (post.user_id !== userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only delete your own posts',
      });
    }

    // Delete post (replies will cascade delete)
    const { error } = await supabase.from('community_posts').delete().eq('id', id);

    if (error) {
      return res.status(400).json({
        error: 'Database Error',
        message: error.message,
      });
    }

    return res.status(200).json({
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.error('Delete post error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete post',
    });
  }
});

/**
 * POST /api/community/posts/:id/reply
 * Add a reply to a post
 *
 * @param {string} id - Post ID
 * @body {string} content - Reply content
 * @returns {Object} Created reply
 */
router.post('/posts/:id/reply', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { content } = req.body;

    // Validation
    if (!content) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'content is required',
      });
    }

    // Verify post exists
    const { data: post, error: postError } = await supabase
      .from('community_posts')
      .select('id')
      .eq('id', id)
      .single();

    if (postError || !post) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Post not found',
      });
    }

    // Create reply
    const { data: reply, error } = await supabase
      .from('community_replies')
      .insert([
        {
          post_id: id,
          user_id: userId,
          content,
        },
      ])
      .select('id, content, created_at')
      .single();

    if (error) {
      return res.status(400).json({
        error: 'Database Error',
        message: error.message,
      });
    }

    // Increment reply count on post
    await supabase.rpc('increment_post_replies', { post_id: id }).catch(() => {
      // Fallback if RPC doesn't exist
      supabase
        .from('community_posts')
        .update({ replies_count: supabase.rpc('increment_replies') })
        .eq('id', id)
        .catch(console.error);
    });

    return res.status(201).json({
      message: 'Reply created successfully',
      reply,
    });
  } catch (error) {
    console.error('Create reply error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create reply',
    });
  }
});

/**
 * POST /api/community/posts/:id/like
 * Like/unlike a post
 *
 * @param {string} id - Post ID
 * @body {boolean} liked - Like or unlike
 * @returns {Object} Updated post likes
 */
router.post('/posts/:id/like', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { liked = true } = req.body;

    // Fetch post
    const { data: post, error: postError } = await supabase
      .from('community_posts')
      .select('likes_count')
      .eq('id', id)
      .single();

    if (postError || !post) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Post not found',
      });
    }

    // Update likes count
    const newLikesCount = Math.max(0, post.likes_count + (liked ? 1 : -1));

    const { data: updated, error } = await supabase
      .from('community_posts')
      .update({ likes_count: newLikesCount })
      .eq('id', id)
      .select('likes_count')
      .single();

    if (error) {
      return res.status(400).json({
        error: 'Database Error',
        message: error.message,
      });
    }

    return res.status(200).json({
      message: liked ? 'Post liked' : 'Post unliked',
      likes_count: updated.likes_count,
    });
  } catch (error) {
    console.error('Like post error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to like post',
    });
  }
});

module.exports = router;
