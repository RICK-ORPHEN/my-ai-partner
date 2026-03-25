/**
 * Industries Routes
 * Handles industry and goal data retrieval
 */

const express = require('express');
const { supabase } = require('../lib/supabase');

const router = express.Router();

/**
 * GET /api/industries
 * Get all industries with their goals
 *
 * @returns {Array} List of industries with nested goals
 */
router.get('/', async (req, res) => {
  try {
    // Fetch all industries with their goals
    const { data: industries, error: industriesError } = await supabase
      .from('industries')
      .select(
        `
        id,
        name,
        slug,
        emoji,
        description,
        icon_url,
        created_at,
        industry_goals (
          id,
          title,
          description,
          sort_order
        )
      `
      )
      .order('id', { ascending: true });

    if (industriesError) {
      return res.status(500).json({
        error: 'Database Error',
        message: industriesError.message,
      });
    }

    // Sort goals within each industry
    const industriesWithSortedGoals = industries.map((industry) => ({
      ...industry,
      industry_goals: industry.industry_goals.sort((a, b) => a.sort_order - b.sort_order),
    }));

    return res.status(200).json({
      total: industriesWithSortedGoals.length,
      industries: industriesWithSortedGoals,
    });
  } catch (error) {
    console.error('Get industries error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch industries',
    });
  }
});

/**
 * GET /api/industries/:slug
 * Get a specific industry with its goals
 *
 * @param {string} slug - Industry slug
 * @returns {Object} Industry with goals
 */
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    // Fetch industry with goals
    const { data: industry, error } = await supabase
      .from('industries')
      .select(
        `
        id,
        name,
        slug,
        emoji,
        description,
        icon_url,
        created_at,
        industry_goals (
          id,
          title,
          description,
          sort_order
        )
      `
      )
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          error: 'Not Found',
          message: `Industry '${slug}' not found`,
        });
      }
      return res.status(500).json({
        error: 'Database Error',
        message: error.message,
      });
    }

    // Sort goals
    industry.industry_goals = industry.industry_goals.sort((a, b) => a.sort_order - b.sort_order);

    return res.status(200).json(industry);
  } catch (error) {
    console.error('Get industry error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch industry',
    });
  }
});

/**
 * GET /api/industries/:id/goals
 * Get all goals for a specific industry
 *
 * @param {string} id - Industry ID
 * @returns {Array} List of goals
 */
router.get('/:id/goals', async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch goals
    const { data: goals, error } = await supabase
      .from('industry_goals')
      .select('id, title, description, sort_order')
      .eq('industry_id', id)
      .order('sort_order', { ascending: true });

    if (error) {
      return res.status(500).json({
        error: 'Database Error',
        message: error.message,
      });
    }

    return res.status(200).json({
      total: goals.length,
      goals,
    });
  } catch (error) {
    console.error('Get goals error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch goals',
    });
  }
});

module.exports = router;
