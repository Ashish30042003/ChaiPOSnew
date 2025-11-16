import { createClient } from '@supabase/supabase-js'

// REPLACE THESE WITH YOUR KEYS FROM SUPABASE SETTINGS -> API
const supabaseUrl = 'https://abrvmdtnjmdpaexgymae.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFicnZtZHRuam1kcGFleGd5bWFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyODM5ODgsImV4cCI6MjA3ODg1OTk4OH0.KIi0zBgKFj8qqQ2LXAoeyliZr3DqMo7_OOQF4gfD3Go'

export const supabase = createClient(supabaseUrl, supabaseKey)