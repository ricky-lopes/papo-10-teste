import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://pbfhdsvcantbvixhkqyj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBiZmhkc3ZjYW50YnZpeGhrcXlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MDAyMzYsImV4cCI6MjA5MjQ3NjIzNn0.ip0gxXtuqq6n_0zNHqobsRp9MCodUzdUdAwHdu27KaY'
)