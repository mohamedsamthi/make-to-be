import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qawcnogudduhjefsrbxo.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhd2Nub2d1ZGR1aGplZnNyYnhvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjc4NjE1NCwiZXhwIjoyMDg4MzYyMTU0fQ.iDWZdZ8EOSF17osoNNj7g4FXrfVVlh1WwWROlxlT_js';

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function setup() {
  try {
    console.log('Testing connection & setting up buckets...');
    
    // Create products bucket
    const { data: pData, error: pErr } = await supabaseAdmin.storage.createBucket('products', {
      public: true,
      fileSizeLimit: 10485760 // 10MB
    });
    
    if (pErr) {
      if (pErr.message.includes('already exists') || pErr.message.includes('duplicate')) {
         console.log('products bucket already exists');
      } else {
         console.error('Failed to create products bucket:', pErr.message);
      }
    } else {
      console.log('Created products bucket successfully');
    }

    // Create promotions bucket
    const { data: prData, error: prErr } = await supabaseAdmin.storage.createBucket('promotions', {
      public: true,
      fileSizeLimit: 10485760
    });

    if (prErr) {
      if (prErr.message.includes('already exists') || prErr.message.includes('duplicate')) {
         console.log('promotions bucket already exists');
      } else {
         console.error('Failed to create promotions bucket:', prErr.message);
      }
    } else {
      console.log('Created promotions bucket successfully');
    }

    console.log('Setup complete!');
  } catch(e) {
    console.error('Exception during setup:', e);
  }
}

setup();
