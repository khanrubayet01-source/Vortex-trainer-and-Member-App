import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkSchema() {
  console.log('--- Checking Profiles Table Schema ---')
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(1)

  if (error) {
    console.error('Error fetching profiles:', error)
    if (error.message.includes('column "email" does not exist')) {
      console.log('❌ CONFIRMED: Column "email" does NOT exist in profiles table.')
    }
  } else if (data) {
    const columns = Object.keys(data[0] || {})
    console.log('Columns found:', columns)
    if (columns.includes('email')) {
      console.log('✅ Column "email" exists.')
      const { data: members } = await supabase.from('profiles').select('email').eq('role', 'member')
      console.log('Member emails found in DB:', members?.map(m => m.email))
    } else {
      console.log('❌ Column "email" is MISSING from the profiles table.')
    }
  }
}

checkSchema()
