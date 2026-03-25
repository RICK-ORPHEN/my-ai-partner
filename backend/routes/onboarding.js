/**
 * Onboarding Routes
 * Handles user onboarding: industry selection, goals, and learning path generation
 */

const express = require('express');
const { supabase } = require('../lib/supabase');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/onboarding/my-progress
 * Get user's onboarding progress
 *
 * @returns {Object} Onboarding progress data
 */
router.get('/my-progress', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    // Fetch user industries
    const { data: userIndustries } = await supabase
      .from('user_industries')
      .select('industry_id, industries(id, name, slug, emoji)')
      .eq('user_id', userId);

    // Fetch user goals
    const { data: userGoals } = await supabase
      .from('user_goals')
      .select('id, goal_id, industry_goals(id, title, industry_id)')
      .eq('user_id', userId);

    // Fetch learning path
    const { data: learningPath } = await supabase
      .from('learning_paths')
      .select('id, industry_id, status, created_at, updated_at')
      .eq('user_id', userId)
      .single();

    return res.status(200).json({
      industries: userIndustries?.map((ui) => ui.industries) || [],
      goals: userGoals?.map((ug) => ug.industry_goals) || [],
      learningPath: learningPath || null,
      completed: !!(userIndustries?.length && userGoals?.length && learningPath),
    });
  } catch (error) {
    console.error('Get onboarding progress error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch onboarding progress',
    });
  }
});

/**
 * POST /api/onboarding/select-industry
 * Select an industry for learning path
 *
 * @body {string} industry_id - UUID of the industry
 * @returns {Object} Success response
 */
router.post('/select-industry', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { industry_id } = req.body;

    // Validation
    if (!industry_id) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing required field: industry_id',
      });
    }

    // Check if industry exists
    const { data: industry, error: industryError } = await supabase
      .from('industries')
      .select('id')
      .eq('id', industry_id)
      .single();

    if (industryError || !industry) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Industry not found',
      });
    }

    // Add industry to user (upsert)
    const { error } = await supabase.from('user_industries').upsert([
      {
        user_id: userId,
        industry_id,
      },
    ]);

    if (error) {
      return res.status(400).json({
        error: 'Database Error',
        message: error.message,
      });
    }

    return res.status(200).json({
      message: 'Industry selected successfully',
      industry_id,
    });
  } catch (error) {
    console.error('Select industry error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to select industry',
    });
  }
});

/**
 * POST /api/onboarding/select-goals
 * Select multiple goals for the user
 *
 * @body {Array<string>} goal_ids - Array of goal UUIDs
 * @returns {Object} Success response
 */
router.post('/select-goals', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { goal_ids } = req.body;

    // Validation
    if (!Array.isArray(goal_ids) || goal_ids.length === 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'goal_ids must be a non-empty array',
      });
    }

    // Clear existing goals
    const { error: deleteError } = await supabase
      .from('user_goals')
      .delete()
      .eq('user_id', userId);

    if (deleteError && deleteError.code !== 'PGRST116') {
      console.error('Delete existing goals error:', deleteError);
    }

    // Insert new goals
    const goalRecords = goal_ids.map((goal_id) => ({
      user_id: userId,
      goal_id,
    }));

    const { error } = await supabase.from('user_goals').insert(goalRecords);

    if (error) {
      return res.status(400).json({
        error: 'Database Error',
        message: error.message,
      });
    }

    return res.status(200).json({
      message: 'Goals selected successfully',
      goal_count: goal_ids.length,
    });
  } catch (error) {
    console.error('Select goals error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to select goals',
    });
  }
});

/**
 * POST /api/onboarding/generate-path
 * Generate a learning path based on selected industry and goals
 *
 * @body {string} industry_id - UUID of the industry
 * @returns {Object} Generated learning path
 */
router.post('/generate-path', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { industry_id } = req.body;

    // Validation
    if (!industry_id) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing required field: industry_id',
      });
    }

    // Fetch user goals for this industry
    const { data: userGoals } = await supabase
      .from('user_goals')
      .select('industry_goals(id, title, industry_id)')
      .eq('user_id', userId);

    // Fetch recommended courses (for now, return all published courses)
    const { data: courses } = await supabase
      .from('courses')
      .select(
        `
        id,
        title,
        description,
        category,
        level,
        lessons (
          id,
          title,
          order_index,
          duration_minutes
        )
      `
      )
      .eq('published', true)
      .order('level', { ascending: true });

    // Build learning path structure
    const lessons = [];
    if (courses) {
      courses.forEach((course) => {
        if (course.lessons) {
          course.lessons.forEach((lesson) => {
            lessons.push({
              lesson_id: lesson.id,
              title: lesson.title,
              course_id: course.id,
              course_title: course.title,
              duration_minutes: lesson.duration_minutes,
              order_index: lesson.order_index,
            });
          });
        }
      });
    }

    // Check if learning path exists
    const { data: existingPath } = await supabase
      .from('learning_paths')
      .select('id')
      .eq('user_id', userId)
      .eq('industry_id', industry_id)
      .single();

    // Upsert learning path
    const { data: learningPath, error } = await supabase
      .from('learning_paths')
      .upsert([
        {
          id: existingPath?.id,
          user_id: userId,
          industry_id,
          lessons: lessons,
          status: 'active',
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

    return res.status(200).json({
      message: 'Learning path generated successfully',
      learningPath,
      lessonCount: lessons.length,
    });
  } catch (error) {
    console.error('Generate path error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to generate learning path',
    });
  }
});

/**
 * GET /api/onboarding/my-path
 * Get user's current learning path
 *
 * @returns {Object} Learning path with lessons
 */
router.get('/my-path', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    // Fetch learning path
    const { data: learningPath, error } = await supabase
      .from('learning_paths')
      .select(
        `
        id,
        user_id,
        industry_id,
        industries(id, name, slug, emoji),
        lessons,
        status,
        created_at,
        updated_at
      `
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          error: 'Not Found',
          message: 'No learning path found. Complete onboarding first.',
        });
      }
      return res.status(500).json({
        error: 'Database Error',
        message: error.message,
      });
    }

    // Fetch lesson progress for this path
    if (learningPath.lessons && Array.isArray(learningPath.lessons)) {
      const lessonIds = learningPath.lessons.map((l) => l.lesson_id);

      const { data: progress } = await supabase
        .from('lesson_progress')
        .select('lesson_id, status, score, completed_at')
        .eq('user_id', userId)
        .in('lesson_id', lessonIds);

      // Merge progress data
      learningPath.lessons_with_progress = learningPath.lessons.map((lesson) => ({
        ...lesson,
        progress: progress?.find((p) => p.lesson_id === lesson.lesson_id) || {
          status: 'not_started',
          score: null,
          completed_at: null,
        },
      }));
    }

    return res.status(200).json(learningPath);
  } catch (error) {
    console.error('Get learning path error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch learning path',
    });
  }
});

module.exports = router;
