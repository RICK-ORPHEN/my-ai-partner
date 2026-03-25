/**
 * Lessons Routes
 * Handles lesson retrieval, progress tracking, and chat interactions
 */

const express = require('express');
const { supabase } = require('../lib/supabase');
const { authMiddleware, optionalAuthMiddleware } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/lessons
 * Get all available lessons with pagination
 *
 * @query {number} offset - Pagination offset (default: 0)
 * @query {number} limit - Items per page (default: 20)
 * @query {string} course_id - Filter by course (optional)
 * @returns {Object} Paginated lessons list
 */
router.get('/', optionalAuthMiddleware, async (req, res) => {
  try {
    const { offset = 0, limit = 20, course_id } = req.query;
    const pageOffset = Math.max(0, parseInt(offset) || 0);
    const pageLimit = Math.min(100, Math.max(1, parseInt(limit) || 20));

    let query = supabase
      .from('lessons')
      .select('id, course_id, title, description, duration_minutes, order_index, created_at')
      .order('course_id', { ascending: true })
      .order('order_index', { ascending: true });

    if (course_id) {
      query = query.eq('course_id', course_id);
    }

    const { data: lessons, error, count } = await query.range(pageOffset, pageOffset + pageLimit - 1);

    if (error) {
      return res.status(500).json({
        error: 'Database Error',
        message: error.message,
      });
    }

    return res.status(200).json({
      total: count || 0,
      offset: pageOffset,
      limit: pageLimit,
      lessons: lessons || [],
    });
  } catch (error) {
    console.error('Get lessons error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch lessons',
    });
  }
});

/**
 * GET /api/lessons/:id
 * Get a specific lesson with full details
 *
 * @param {string} id - Lesson ID
 * @returns {Object} Lesson details
 */
router.get('/:id', optionalAuthMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch lesson with course info
    const { data: lesson, error } = await supabase
      .from('lessons')
      .select(
        `
        id,
        course_id,
        title,
        description,
        content,
        video_url,
        duration_minutes,
        order_index,
        created_at,
        courses(id, title, category, level)
      `
      )
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Lesson not found',
        });
      }
      return res.status(500).json({
        error: 'Database Error',
        message: error.message,
      });
    }

    // Fetch user progress if authenticated
    if (req.userId) {
      const { data: progress } = await supabase
        .from('lesson_progress')
        .select('status, score, completed_at')
        .eq('user_id', req.userId)
        .eq('lesson_id', id)
        .single();

      lesson.user_progress = progress || {
        status: 'not_started',
        score: null,
        completed_at: null,
      };
    }

    return res.status(200).json(lesson);
  } catch (error) {
    console.error('Get lesson error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch lesson',
    });
  }
});

/**
 * POST /api/lessons/:id/start
 * Mark a lesson as in-progress
 *
 * @param {string} id - Lesson ID
 * @returns {Object} Updated progress
 */
router.post('/:id/start', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    // Verify lesson exists
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select('id')
      .eq('id', id)
      .single();

    if (lessonError || !lesson) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Lesson not found',
      });
    }

    // Upsert lesson progress
    const { data: progress, error } = await supabase
      .from('lesson_progress')
      .upsert([
        {
          user_id: userId,
          lesson_id: id,
          status: 'in_progress',
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        error: 'Database Error',
        message: error.message,
      });
    }

    // Create chat session if it doesn't exist
    const { data: chatSession } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('user_id', userId)
      .eq('lesson_id', id)
      .single();

    if (!chatSession) {
      await supabase.from('chat_sessions').insert([
        {
          user_id: userId,
          lesson_id: id,
          messages: [],
        },
      ]);
    }

    return res.status(200).json({
      message: 'Lesson started',
      progress,
    });
  } catch (error) {
    console.error('Start lesson error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to start lesson',
    });
  }
});

/**
 * POST /api/lessons/:id/complete
 * Mark a lesson as completed with a score
 *
 * @param {string} id - Lesson ID
 * @body {number} score - Score (0-100)
 * @returns {Object} Updated progress
 */
router.post('/:id/complete', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { score = 100 } = req.body;

    // Validate score
    if (typeof score !== 'number' || score < 0 || score > 100) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Score must be a number between 0 and 100',
      });
    }

    // Verify lesson exists
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select('id, course_id')
      .eq('id', id)
      .single();

    if (lessonError || !lesson) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Lesson not found',
      });
    }

    // Update lesson progress
    const { data: progress, error } = await supabase
      .from('lesson_progress')
      .update({
        status: 'completed',
        score,
        completed_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('lesson_id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        error: 'Database Error',
        message: error.message,
      });
    }

    // Update course enrollment progress
    const { data: courseProgress } = await supabase
      .from('lesson_progress')
      .select('status')
      .eq('user_id', userId)
      .in('lesson_id', (
        await supabase
          .from('lessons')
          .select('id')
          .eq('course_id', lesson.course_id)
      ).data?.map((l) => l.id) || []);

    const completedCount = courseProgress?.filter((p) => p.status === 'completed').length || 0;
    const totalLessons = courseProgress?.length || 1;
    const courseProgress_pct = Math.round((completedCount / totalLessons) * 100);

    await supabase
      .from('enrollments')
      .update({ progress: courseProgress_pct })
      .eq('user_id', userId)
      .eq('course_id', lesson.course_id);

    return res.status(200).json({
      message: 'Lesson completed',
      progress,
      courseProgress: courseProgress_pct,
    });
  } catch (error) {
    console.error('Complete lesson error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to complete lesson',
    });
  }
});

/**
 * GET /api/lessons/:id/progress
 * Get user's progress on a specific lesson
 *
 * @param {string} id - Lesson ID
 * @returns {Object} Progress data
 */
router.get('/:id/progress', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    // Fetch progress
    const { data: progress, error } = await supabase
      .from('lesson_progress')
      .select('id, status, score, completed_at, created_at, updated_at')
      .eq('user_id', userId)
      .eq('lesson_id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(200).json({
          status: 'not_started',
          score: null,
          completed_at: null,
        });
      }
      return res.status(500).json({
        error: 'Database Error',
        message: error.message,
      });
    }

    return res.status(200).json(progress);
  } catch (error) {
    console.error('Get progress error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch lesson progress',
    });
  }
});

/**
 * POST /api/lessons/:id/chat
 * Save chat message and get AI response (placeholder)
 *
 * @param {string} id - Lesson ID
 * @body {string} message - User message
 * @returns {Object} Chat session with messages
 */
router.post('/:id/chat', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { message } = req.body;

    // Validation
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'message is required and must be a string',
      });
    }

    // Fetch or create chat session
    let { data: chatSession, error: sessionError } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('lesson_id', id)
      .single();

    if (sessionError && sessionError.code === 'PGRST116') {
      // Create new session
      const newSession = await supabase
        .from('chat_sessions')
        .insert([
          {
            user_id: userId,
            lesson_id: id,
            messages: [],
          },
        ])
        .select()
        .single();

      chatSession = newSession.data;
    } else if (sessionError) {
      return res.status(500).json({
        error: 'Database Error',
        message: sessionError.message,
      });
    }

    // Prepare messages array
    const messages = Array.isArray(chatSession.messages) ? chatSession.messages : [];

    // Add user message
    messages.push({
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    });

    // TODO: Call AI API (Claude/ChatGPT) to generate response
    // For now, return a placeholder response
    const aiResponse = `Thank you for your message: "${message}". This is a placeholder response. Integrate with Claude or ChatGPT API here.`;

    messages.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date().toISOString(),
    });

    // Update chat session
    const { data: updatedSession, error } = await supabase
      .from('chat_sessions')
      .update({ messages })
      .eq('id', chatSession.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        error: 'Database Error',
        message: error.message,
      });
    }

    return res.status(200).json({
      session: updatedSession,
      lastMessage: messages[messages.length - 1],
    });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to process chat message',
    });
  }
});

module.exports = router;
