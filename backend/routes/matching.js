/**
 * Matching Routes
 * Handles job/project opportunities and applications
 */

const express = require('express');
const { supabase } = require('../lib/supabase');
const { authMiddleware, optionalAuthMiddleware } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/matching/offers
 * Get opportunities matching user's skills and interests
 *
 * @query {number} offset - Pagination offset
 * @query {number} limit - Items per page
 * @returns {Array} Matching opportunities with match scores
 */
router.get('/offers', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { offset = 0, limit = 20 } = req.query;
    const pageOffset = Math.max(0, parseInt(offset) || 0);
    const pageLimit = Math.min(100, Math.max(1, parseInt(limit) || 20));

    // Fetch user's skills and industries
    const { data: userSkills } = await supabase
      .from('user_skills')
      .select('skills(name)')
      .eq('user_id', userId);

    const { data: userIndustries } = await supabase
      .from('user_industries')
      .select('industries(slug)')
      .eq('user_id', userId);

    const userSkillNames = userSkills?.map((us) => us.skills.name) || [];
    const userIndustrySlugs = userIndustries?.map((ui) => ui.industries.slug) || [];

    // Fetch all open opportunities
    const { data: opportunities, error } = await supabase
      .from('opportunities')
      .select(
        `
        id,
        title,
        description,
        required_skills,
        required_industries,
        company_id,
        companies(id, company_name, industry, website)
      `
      )
      .eq('status', 'open')
      .range(pageOffset, pageOffset + pageLimit - 1);

    if (error) {
      return res.status(500).json({
        error: 'Database Error',
        message: error.message,
      });
    }

    // Calculate match scores
    const opportunitiesWithScores = opportunities.map((opp) => {
      let score = 0;
      let matchReasons = [];

      // Check skill matches
      if (opp.required_skills) {
        const requiredSkills = opp.required_skills.split(',').map((s) => s.trim());
        const matchedSkills = requiredSkills.filter((skill) =>
          userSkillNames.some((us) => us.toLowerCase().includes(skill.toLowerCase()))
        );

        if (matchedSkills.length > 0) {
          score += matchedSkills.length * 25;
          matchReasons.push(`${matchedSkills.length} matching skills`);
        }
      }

      // Check industry matches
      if (opp.required_industries && opp.required_industries !== 'all') {
        const requiredIndustries = opp.required_industries.split(',').map((i) => i.trim());
        if (
          requiredIndustries.some((industry) =>
            userIndustrySlugs.includes(industry.toLowerCase())
          )
        ) {
          score += 25;
          matchReasons.push('Industry match');
        }
      }

      return {
        ...opp,
        match_score: Math.min(100, score),
        match_reasons: matchReasons,
      };
    });

    // Sort by match score
    opportunitiesWithScores.sort((a, b) => b.match_score - a.match_score);

    return res.status(200).json({
      total: opportunities.length,
      offset: pageOffset,
      limit: pageLimit,
      opportunities: opportunitiesWithScores,
    });
  } catch (error) {
    console.error('Get offers error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch opportunities',
    });
  }
});

/**
 * GET /api/matching/offers/:id
 * Get a specific opportunity with details
 *
 * @param {string} id - Opportunity ID
 * @returns {Object} Opportunity details
 */
router.get('/offers/:id', optionalAuthMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch opportunity
    const { data: opportunity, error } = await supabase
      .from('opportunities')
      .select(
        `
        id,
        title,
        description,
        required_skills,
        required_industries,
        status,
        created_at,
        company_id,
        companies(id, company_name, industry, website, description)
      `
      )
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Opportunity not found',
        });
      }
      return res.status(500).json({
        error: 'Database Error',
        message: error.message,
      });
    }

    // Fetch application count
    const { data: applications } = await supabase
      .from('applications')
      .select('id')
      .eq('opportunity_id', id)
      .in('status', ['pending', 'accepted']);

    // Check if user applied
    let userApplication = null;
    if (req.userId) {
      const { data: userApp } = await supabase
        .from('applications')
        .select('id, status, created_at')
        .eq('opportunity_id', id)
        .eq('user_id', req.userId)
        .single();

      userApplication = userApp;
    }

    return res.status(200).json({
      ...opportunity,
      applicationCount: applications?.length || 0,
      userApplication,
    });
  } catch (error) {
    console.error('Get offer error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch opportunity',
    });
  }
});

/**
 * POST /api/matching/apply/:id
 * Apply to an opportunity
 *
 * @param {string} id - Opportunity ID
 * @returns {Object} Application data
 */
router.post('/apply/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    // Check if opportunity exists
    const { data: opportunity, error: oppError } = await supabase
      .from('opportunities')
      .select('id, status')
      .eq('id', id)
      .single();

    if (oppError || !opportunity) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Opportunity not found',
      });
    }

    if (opportunity.status !== 'open') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'This opportunity is no longer open',
      });
    }

    // Check if already applied
    const { data: existingApp } = await supabase
      .from('applications')
      .select('id, status')
      .eq('opportunity_id', id)
      .eq('user_id', userId)
      .single();

    if (existingApp) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'You have already applied to this opportunity',
      });
    }

    // Fetch user skills to calculate match score
    const { data: userSkills } = await supabase
      .from('user_skills')
      .select('skills(name)')
      .eq('user_id', userId);

    const { data: oppDetails } = await supabase
      .from('opportunities')
      .select('required_skills, required_industries')
      .eq('id', id)
      .single();

    let matchScore = 50; // Base score
    if (oppDetails?.required_skills) {
      const userSkillNames = userSkills?.map((us) => us.skills.name) || [];
      const requiredSkills = oppDetails.required_skills.split(',').map((s) => s.trim());
      const matchedCount = requiredSkills.filter((skill) =>
        userSkillNames.some((us) => us.toLowerCase().includes(skill.toLowerCase()))
      ).length;

      matchScore += matchedCount * 10;
    }

    // Create application
    const { data: application, error } = await supabase
      .from('applications')
      .insert([
        {
          opportunity_id: id,
          user_id: userId,
          status: 'pending',
          match_score: Math.min(100, matchScore),
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

    return res.status(201).json({
      message: 'Application submitted successfully',
      application,
    });
  } catch (error) {
    console.error('Apply error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to submit application',
    });
  }
});

/**
 * GET /api/matching/applications
 * Get user's job applications
 *
 * @query {string} status - Filter by status (pending, accepted, rejected)
 * @returns {Array} User's applications
 */
router.get('/applications', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { status } = req.query;

    let query = supabase
      .from('applications')
      .select(
        `
        id,
        status,
        match_score,
        applied_at,
        opportunity_id,
        opportunities(
          id,
          title,
          description,
          company_id,
          companies(id, company_name)
        )
      `
      )
      .eq('user_id', userId);

    if (status) {
      query = query.eq('status', status);
    }

    const { data: applications, error } = await query.order('applied_at', {
      ascending: false,
    });

    if (error) {
      return res.status(500).json({
        error: 'Database Error',
        message: error.message,
      });
    }

    return res.status(200).json({
      total: applications?.length || 0,
      applications: applications || [],
    });
  } catch (error) {
    console.error('Get applications error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch applications',
    });
  }
});

/**
 * PUT /api/matching/applications/:id
 * Update application status (user withdraw, or company accepts/rejects)
 *
 * @param {string} id - Application ID
 * @body {string} status - New status (withdrawn, accepted, rejected)
 * @returns {Object} Updated application
 */
router.put('/applications/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { status } = req.body;

    // Validation
    if (!['withdrawn', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid status. Must be: withdrawn, accepted, or rejected',
      });
    }

    // Fetch application and verify ownership
    const { data: application, error: appError } = await supabase
      .from('applications')
      .select('user_id')
      .eq('id', id)
      .single();

    if (appError || !application) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Application not found',
      });
    }

    // Only user can withdraw their own application
    if (status === 'withdrawn' && application.user_id !== userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only withdraw your own applications',
      });
    }

    // Update application
    const { data: updated, error } = await supabase
      .from('applications')
      .update({ status })
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
      message: 'Application updated',
      application: updated,
    });
  } catch (error) {
    console.error('Update application error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update application',
    });
  }
});

/**
 * GET /api/matching/messages
 * Get user's messages (mock endpoint for future implementation)
 *
 * @returns {Array} Messages
 */
router.get('/messages', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    // Fetch messages
    const { data: messages, error } = await supabase
      .from('messages')
      .select(
        `
        id,
        sender_id,
        recipient_id,
        content,
        read,
        created_at,
        users(id, name)
      `
      )
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({
        error: 'Database Error',
        message: error.message,
      });
    }

    return res.status(200).json({
      total: messages?.length || 0,
      messages: messages || [],
    });
  } catch (error) {
    console.error('Get messages error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch messages',
    });
  }
});

module.exports = router;
