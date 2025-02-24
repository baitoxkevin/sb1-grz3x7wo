import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  'https://aoiwrdzlichescqgnohi.supabase.co',
  process.env.service_role_2
);

async function createSuperAdmin() {
  try {
    console.log('Creating super admin user...');
    
    // Create user with email/password
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'kevin@baito.events',
      password: 'BaitoTest111~~',
      email_confirm: true,
      user_metadata: {
        is_super_admin: true,
        full_name: 'Kevin Admin'
      }
    });

    if (authError) {
      console.error('Error creating user:', authError);
      return;
    }

    console.log('User created:', authData);

    // Update user role in users table
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        role: 'super_admin',
        raw_user_meta_data: {
          is_super_admin: true,
          full_name: 'Kevin Admin'
        }
      })
      .eq('id', authData.user.id);

    if (updateError) {
      console.error('Error updating user role:', updateError);
      return;
    }

    console.log('Successfully created super admin user');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createSuperAdmin();
