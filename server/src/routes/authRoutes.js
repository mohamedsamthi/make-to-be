import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Admin bypass to auto-confirm users (development convenience)
router.post('/confirm-user', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // 1. Get the user list to find the user ID
    // We utilize the auth.admin interface which requires the service_role key
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) throw listError;
    
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return res.status(404).json({ message: 'User record not found.' });
    }

    // 2. Mark user as confirmed via the Admin API
    const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { email_confirm: true }
    );

    if (updateError) throw updateError;

    res.status(200).json({ 
      message: 'User confirmed successfully.', 
      user: updateData.user 
    });
  } catch (error) {
    console.error('Bypass error:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
