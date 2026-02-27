import { supabase } from '../lib/supabase'

/**
 * Generate a random alphanumeric string of a given length.
 */
function randomAlphanumeric(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Generate a unique referral code in the format ENG-XXXX.
 * Checks the `registrations` table to ensure the code doesn't already exist.
 * Retries up to `maxAttempts` times before throwing.
 *
 * @param {number} [maxAttempts=5] - Maximum generation attempts.
 * @returns {Promise<string>} A unique referral code.
 */
export async function generateReferralCode(maxAttempts = 5) {
  for (let i = 0; i < maxAttempts; i++) {
    const code = `ENG-${randomAlphanumeric(4)}`

    const { data, error } = await supabase
      .from('registrations')
      .select('id')
      .eq('referral_code', code)
      .maybeSingle()

    if (error) throw new Error(error.message)

    // No existing row → code is unique
    if (!data) return code
  }

  throw new Error('Unable to generate a unique referral code. Please try again.')
}
