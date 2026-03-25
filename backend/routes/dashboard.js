/**
 * Dashboard Routes
 * Handles user dashboard data: progress, stats, activity, and recommendations
 */

const express = require('express');
const { supabase } = require('../lib/supabase');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/dashboard/stats
 * Get user's learning progress stats
 *
 * @returns {Object} Learning progress, skill scores, ranking, completed courses
 */
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    // Fetch overall skill score
    const { data: skillScore } = await supabase
      .from('skill_scores')
      .select('score, level')
      .eq('user_id', userId)
      .single();

    // Fetch course enrollments
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('progress')
      .eq('user_id', userId);

    const avgProgress = enrollments?.length
      ? Math.round(enrollments.reduce((acc, e) => acc + e.progress, 0) / enrollments.length)
      : 0;

    // Count completed lessons
    const { data: completedLessons } = await supabase
      .from('lesson_progress')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'completed');

    // Count total lessons
    const { data: totalLessons } = await supabase
      .from('lessons')
      .select('id', { count: 'exact' });

    // Fetch user badges
    const { data: badges } = await supabase
      .from('user_badges')
      .select('id')
      .eq('user_id', userId);

    // Get user rank
    const { data: allScores } = await supabase
      .from('skill_scores')
      .select('user_id, score')
      .order('score', { ascending: false });

    const userRank =
      allScores?.findIndex((s) => s.user_id === userId) + 1 ||
      allScores?.length ||
      0;

    // Get completed courses
    const { data: completedCourses } = await supabase
      .from('enrollments')
      .select('course_id')
      .eq('user_id', userId)
      .eq('progress', 100);

    return res.status(200).json({
      learningProgress: {
        lessonsCompleted: completedLessons?.length || 0,
        totalLessons: totalLessons?.length || 0,
        completionRate:
          totalLessons?.length
            ? Math.round(((completedLessons?.length || 0) / totalLessons.length) * 100)
            : 0,
      },
      skillScore: skillScore || { score: 0, level: 1 },
      courseProgress: {
        enrolledCourses: enrollments?.length || 0,
        completedCourses: completedCourses?.length || 0,
        averageProgress: avgProgress,
      },
      ranking: {
        currentRank: userRank,
        totalParticipants: allScores?.length || 0,
      },
      badges: {
        earned: badges?.length || 0,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch dashboard stats',
    });
  }
});

/**
 * GET /api/dashboard/activity
 * Get user's recent activity feed
 *
 * @query {number} limit - Number of activities to return
 * @returns {Array} Recent activities
 */
router.get('/activity', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { limit = 10 } = req.query;
    const activityLimit = Math.min(50, Math.max(1, parseInt(limit) || 10));

    const activities = [];

    // Fetch recent lesson completions
    const { data: lessonComps } = await supabase
      .from('lesson_progress')
      .select(
        `
        completed_at,
        lessons(id, title, courses(title))
      `
      )
      .eq('user_id', userId)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false })
      .limit(5);

    lessonComps?.forEach((lc) => {
      if (lc.completed_at) {
        activities.push({
          type: 'lesson_completed',
          title: `Completed lesson: ${lc.lessons.title}`,
          description: `in ${lc.lessons.courses.title}`,
          timestamp: lc.completed_at,
          icon: '✅',
        });
      }
    });

    // Fetch badge acquisitions
    const { data: badgeEarnings } = await supabase
      .from('user_badges')
      .select('earned_at, badges(name, icon)')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false })
      .limit(5);

    badgeEarnings?.forEach((be) => {
      activities.push({
        type: 'badge_earned',
        title: `Earned badge: ${be.badges.name}`,
        icon: be.badges.icon || '🏆',
        timestamp: be.earned_at,
      });
    });

    // Fetch community posts
    const { data: posts } = await supabase
      .from('community_posts')
      .select('created_at, title')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    posts?.forEach((p) => {
      activities.push({
        type: 'post_created',
        title: `Posted: ${p.title}`,
        timestamp: p.created_at,
        icon: '💬',
      });
    });

    // Fetch course enrollments
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('created_at, courses(title)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    enrollments?.forEach((e) => {
      activities.push({
        type: 'course_enrolled',
        title: `Enrolled in: ${e.courses.title}`,
        timestamp: e.created_at,
        icon: '📚',
      });
    });

    // Sort by timestamp and limit
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return res.status(200).json({
      total: activities.length,
      activities: activities.slice(0, activityLimit),
    });
  } catch (error) {
    console.error('Get activity error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch activity feed',
    });
  }
});

/**
 * GET /api/dashboard/next-lesson
 * Get the recommended next lesson for the user
 *
 * @returns {Object} Next lesson recommendation
 */
router.get('/next-lesson', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    // Get user's learning path
    const { data: learningPath } = await supabase
      .from('learning_paths')
      .select('lessons')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!learningPath || !learningPath.lessons) {
      return res.status(200).json({
        message: 'Complete onboarding to get lesson recommendations',
        nextLesson: null,
      });
    }

    // Get progress on all lessons
    const { data: progress } = await supabase
      .from('lesson_progress')
      .select('lesson_id, status')
      .eq('user_id', userId);

    const progressMap = {};
    progress?.forEach((p) => {
      progressMap[p.lesson_id] = p.status;
    });

    // Find the first incomplete lesson
    const nextLessonData = learningPath.lessons.find(
      (l) => !progressMap[l.lesson_id] || progressMap[l.lesson_id] === 'not_started'
    );

    if (!nextLessonData) {
      return res.status(200).json({
        message: 'No more lessons available',
        nextLesson: null,
      });
    }

    // Fetch lesson details
    const { data: lesson } = await supabase
      .from('lessons')
      .select(
        `
        id,
        title,
        description,
        duration_minutes,
        courses(title)
      `
      )
      .eq('id', nextLessonData.lesson_id)
      .single();

    return res.status(200).json({
      nextLesson: lesson,
      estimatedTime: `${lesson?.duration_minutes || 20} minutes`,
    });
  } catch (error) {
    console.error('Get next lesson error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch recommended lesson',
    });
  }
});

/**
 * GET /api/dashboard/progress-breakdown
 * Get detailed progress breakdown by course
 *
 * @returns {Array} Detailed progress for each course
 */
router.get('/progress-breakdown', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    // Fetch enrollments with course info
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select(
        `
        id,
        course_id,
        progress,
        courses(
          id,
          title,
          category,
          lessons(id)
        )
      `
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // Get detailed lesson progress for each course
    const breakdown = [];

    for (const enrollment of enrollments || []) {
      const lessonIds = enrollment.courses.lessons.map((l) => l.id);

      const { data: lessonProgress } = await supabase
        .from('lesson_progress')
        .select('lesson_id, status, score')
        .eq('user_id', userId)
        .in('lesson_id', lessonIds);

      const completedCount = lessonProgress?.filter((p) => p.status === 'completed').length || 0;
      const avgScore =
        lessonProgress?.length
          ? Math.round(
              lessonProgress.filter((p) => p.score).reduce((acc, p) => acc + p.score, 0) /
                lessonProgress.filter((p) => p.score).length
            )
          : 0;

      breakdown.push({
        courseId: enrollment.course_id,
        title: enrollment.courses.title,
        category: enrollment.courses.category,
        progress: enrollment.progress,
        lessonsCompleted: completedCount,
        totalLessons: enrollment.courses.lessons.length,
        averageScore: avgScore,
      });
    }

    return res.status(200).json({
      total: breakdown.length,
      breakdown,
    });
  } catch (error) {
    console.error('Get progress breakdown error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch progress breakdown',
    });
  }
});

module.exports = router;
