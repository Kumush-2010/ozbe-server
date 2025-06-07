const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Supabase URL yoki API Key aniqlanmagan. Iltimos, .env faylini tekshiring!");
}

exports.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// const supabase = createClient('https://ozbe.supabase.co', process.env.SUPABASE_ANON_KEY)

// async function uploadImage(file) {
//   const fileExt = file.name.split('.').pop()
//   const fileName = `${Date.now()}.${fileExt}`
//   const { data, error } = await supabase.storage
//     .from('images')
//     .upload(fileName, file)

//   if (error) throw error
//   return `https://ozbe.supabase.co/storage/v1/object/public/images/${fileName}`
// }