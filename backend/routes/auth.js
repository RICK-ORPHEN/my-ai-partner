/**
 * Authentication Routes
 * Handles user signup, login, logout, and profile retrieval
 */

const express = require('express');
const { supabase } = require('../lib/supabase');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/auth/signup
 * Create a new user account
 *
 * @body {string} email - User's email address
 * @body {string} password - User's password (min 6 chars)
 * @body {string} name - User's full name
 * @returns {Object} User object and session token
 */
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing required fields: email, password, name',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Password must be at least 6 characters',
      });
    }

    // Sign up user with Supabase Auth
    const { data, error: signUpError } = await supabase.auth.signUpWithPassword({
      email,
      password,
    });

    if (signUpError) {
      return res.status(400).json({
        error: 'Signup Failed',
        message: signUpError.message,
      });
    }

    const userId = data.user.id;

    // Create user record in users table
    const { error: userError } = await supabase.from('users').insert([
      {
        id: userId,
        email,
        name,
        role: 'student',
      },
    ]);

    if (userError) {
      console.error('Error creating user record:', userError);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to create user profile',
      });
    }

    // Create user profile
    const { error: profileError } = await supabase.from('user_profiles').insert([
      {
        user_id: userId,
        visibility: true,
      },
    ]);

    if (profileError) {
      console.error('Error creating user profile:', profileError);
    }

    // Create initial skill scores
    const { error: skillScoreError } = await supabase.from('skill_scores').insert([
      {
        user_id: userId,
        score: 0,
        level: 1,
      },
    ]);

    if (skillScoreError) {
      console.error('Error creating skill scores:', skillScoreError);
    }

    return res.status(201).json({
      message: 'Signup successful',
      user: {
        id: userId,
        email,
        name,
      },
      session: data.session,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred during signup',
    });
  }
});

/**
 * POST /api/auth/login
 * Authenticate a user and return session token
 *
 * @body {string} email - User's email address
 * @body {string} password - User's password
 * @returns {Object} User object and session token
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing required fields: email, password',
      });
    }

    // Sign in user with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({
        error: 'Authentication Failed',
        message: 'Invalid email or password',
      });
    }

    // Fetch user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (userError) {
      console.error('Error fetching user:', userError);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to fetch user data',
      });
    }

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      session: data.session,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred during login',
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout user (invalidate session)
 *
 * @returns {Object} Success message
 */
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout error:', error);
    }

    return res.status(200).json({
      message: 'Logout successful',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to logout',
    });
  }
});

/**
 * GET /api/auth/me
 * Get current authenticated user profile
 *
 * @returns {Object} User object with profile data
 */
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    // Fetch user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found',
      });
    }

    // Fetch user profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Fetch user industries
    const { data: userIndustries } = await supabase
      .from('user_industries')
      .select('industry_id, industries(id, name, slug, emoji)')
      .eq('user_id', userId);

    // Fetch skill scores
    const { data: skillScores } = await supabase
      .from('skill_scores')
      .select('*')
      .eq('user_id', userId)
      .single();

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        created_at: user.created_at,
      },
      profile,
      industries: userIndustries?.map((ui) => ui.industries) || [],
      skillScores,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch user profile',
    });
  }
});

/**
 * PUT /api/auth/profile
 * Update user profile
 *
 * @body {string} name - User's name
 * @body {string} bio - User's bio
 * @body {string} location - User's location
 * @body {string} avatar_url - User's avatar URL
 * @body {boolean} visibility - Profile visibility
 * @returns {Object} Updated profile
 */
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { name, bio, location, avatar_url, visibility } = req.body;

    // Update user name if provided
    if (name) {
      const { error: userError } = await supabase
        .from('users')
        .update({ name })
        .eq('id', userId);

      if (userError) {
        return res.status(400).json({
          error: 'Update Failed',
          message: userError.message,
        });
      }
    }

    // Update user profile
    const updateData = {};
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url;
    if (visibility !== undefined) updateData.visibility = visibility;

    const { data: updatedProfile, error: profileError } = await supabase
      .from('user_profiles')
      .update(updateData)
      .eq('user_id', userId)
      .select()
      .single();

    if (profileError) {
      return res.status(400).json({
        error: 'Update Failed',
        message: profileError.message,
      });
    }

    return res.status(200).json({
      message: 'Profile updated successfully',
      profile: updatedProfile,
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update profile',
    });
  }
});

module.exports = router;
