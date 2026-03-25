/**
 * Skills Routes
 * Handles skill scores, badges, and user ranking/profile
 */

const express = require('express');
const { supabase } = require('../lib/supabase');
const { authMiddleware, optionalAuthMiddleware } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/skills
 * Get all available skills
 *
 * @returns {Array} List of skills with categories
 */
router.get('/', async (req, res) => {
  try {
    const { data: skills, error } = await supabase
      .from('skills')
      .select('id, name, category, description')
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      return res.status(500).json({
        error: 'Database Error',
        message: error.message,
      });
    }

    // Group by category
    const byCategory = {};
    skills.forEach((skill) => {
      if (!byCategory[skill.category]) {
        byCategory[skill.category] = [];
      }
      byCategory[skill.category].push(skill);
    });

    return res.status(200).json({
      total: skills.length,
      byCategory,
      all: skills,
    });
  } catch (error) {
    console.error('Get skills error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch skills',
    });
  }
});

/**
 * GET /api/skills/my-scores
 * Get authenticated user's skill scores across all categories
 *
 * @returns {Object} User's skill scores and overall progress
 */
router.get('/my-scores', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    // Fetch overall skill score
    const { data: skillScore } = await supabase
      .from('skill_scores')
      .select('score, level')
      .eq('user_id', userId)
      .single();

    // Fetch individual user skills
    const { data: userSkills } = await supabase
      .from('user_skills')
      .select(
        `
        skill_id,
        skill_level,
        verified,
        skills(id, name, category)
      `
      )
      .eq('user_id', userId)
      .order('skill_level', { ascending: false });

    // Group by category
    const byCategory = {};
    userSkills?.forEach((us) => {
      const category = us.skills.category;
      if (!byCategory[category]) {
        byCategory[category] = [];
      }
      byCategory[category].push({
        skill_id: us.skill_id,
        name: us.skills.name,
        level: us.skill_level,
        verified: us.verified,
      });
    });

    return res.status(200).json({
      overall: skillScore || { score: 0, level: 1 },
      byCategory,
      totalSkills: userSkills?.length || 0,
    });
  } catch (error) {
    console.error('Get skill scores error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch skill scores',
    });
  }
});

/**
 * PUT /api/skills/my-scores/:skill_id
 * Update a user's skill level
 *
 * @param {string} skill_id - Skill ID
 * @body {number} skill_level - New skill level (1-5)
 * @returns {Object} Updated skill
 */
router.put('/my-scores/:skill_id', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { skill_id } = req.params;
    const { skill_level } = req.body;

    // Validation
    if (!skill_level || skill_level < 1 || skill_level > 5) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'skill_level must be between 1 and 5',
      });
    }

    // Verify skill exists
    const { data: skill, error: skillError } = await supabase
      .from('skills')
      .select('id')
      .eq('id', skill_id)
      .single();

    if (skillError || !skill) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Skill not found',
      });
    }

    // Update or insert user skill
    const { data: userSkill, error } = await supabase
      .from('user_skills')
      .upsert([
        {
          user_id: userId,
          skill_id,
          skill_level,
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
      message: 'Skill updated',
      userSkill,
    });
  } catch (error) {
    console.error('Update skill error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update skill',
    });
  }
});

/**
 * GET /api/skills/badges
 * Get all badges and user's earned badges
 *
 * @returns {Object} All badges and user's earned badges
 */
router.get('/badges', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    // Fetch all badges
    const { data: allBadges } = await supabase
      .from('badges')
      .select('id, name, description, icon')
      .order('name', { ascending: true });

    // Fetch user's badges
    const { data: userBadges } = await supabase
      .from('user_badges')
      .select('badge_id, earned_at, badges(id, name, description, icon)')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });

    const earnedBadgeIds = new Set(userBadges?.map((ub) => ub.badge_id) || []);

    return res.status(200).json({
      all: allBadges || [],
      earned: userBadges?.map((ub) => ({
        ...ub.badges,
        earned_at: ub.earned_at,
      })) || [],
      total: allBadges?.length || 0,
      earnedCount: userBadges?.length || 0,
    });
  } catch (error) {
    console.error('Get badges error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch badges',
    });
  }
});

/**
 * GET /api/skills/ranking
 * Get user's ranking among all users
 *
 * @query {number} limit - Top N users to return (default: 20)
 * @returns {Object} User's rank and top users
 */
router.get('/ranking', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { limit = 20 } = req.query;
    const topLimit = Math.min(100, Math.max(1, parseInt(limit) || 20));

    // Fetch top users by skill score
    const { data: topUsers } = await supabase
      .from('skill_scores')
      .select(
        `
        user_id,
        score,
        level,
        users(id, name)
      `
      )
      .order('score', { ascending: false })
      .limit(topLimit);

    // Find user's rank
    const userRank = topUsers?.findIndex((u) => u.user_id === userId) + 1 || null;

    // Fetch user's own score
    const { data: userScore } = await supabase
      .from('skill_scores')
      .select('score, level')
      .eq('user_id', userId)
      .single();

    return res.status(200).json({
      userRank,
      userScore: userScore || { score: 0, level: 1 },
      topUsers:
        topUsers?.map((u) => ({
          rank: topUsers.indexOf(u) + 1,
          user_id: u.user_id,
          name: u.users?.name || 'Anonymous',
          score: u.score,
          level: u.level,
        })) || [],
      totalRanked: topUsers?.length || 0,
    });
  } catch (error) {
    console.error('Get ranking error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch ranking',
    });
  }
});

/**
 * GET /api/skills/profile/:userId
 * Get a public user profile with skills and badges
 *
 * @param {string} userId - User ID
 * @returns {Object} User profile with skills and badges
 */
router.get('/profile/:userId', optionalAuthMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, name, email, created_at')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found',
      });
    }

    // Fetch user profile (only if public or own profile)
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('bio, location, avatar_url, portfolio_url, visibility')
      .eq('user_id', userId)
      .single();

    // Check visibility
    if (profile && !profile.visibility && req.userId !== userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'This profile is private',
      });
    }

    // Fetch skills
    const { data: userSkills } = await supabase
      .from('user_skills')
      .select('skill_level, skills(id, name, category)')
      .eq('user_id', userId);

    // Fetch badges
    const { data: badges } = await supabase
      .from('user_badges')
      .select('earned_at, badges(id, name, icon)')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });

    // Fetch skill score
    const { data: skillScore } = await supabase
      .from('skill_scores')
      .select('score, level')
      .eq('user_id', userId)
      .single();

    return res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        created_at: user.created_at,
      },
      profile: profile || {},
      skills:
        userSkills?.map((us) => ({
          name: us.skills.name,
          category: us.skills.category,
          level: us.skill_level,
        })) || [],
      badges:
        badges?.map((b) => ({
          name: b.badges.name,
          icon: b.badges.icon,
          earned_at: b.earned_at,
        })) || [],
      skillScore: skillScore || { score: 0, level: 1 },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch user profile',
    });
  }
});

module.exports = router;
