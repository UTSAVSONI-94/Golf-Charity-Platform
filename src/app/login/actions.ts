'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

import { sendWelcomeEmail } from '@/lib/email'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // Strict API validation
  const parsed = authSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    redirect('/login?error=Invalid inputs. Make sure email is valid and password is at least 6 characters.')
  }

  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) {
    console.error('Supabase Login Error:', error.message)
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // Strict API validation
  const parsed = authSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    redirect('/login?error=Invalid inputs. Make sure email is valid and password is at least 6 characters.')
  }

  const { error } = await supabase.auth.signUp(parsed.data)

  if (error) {
    console.error('Supabase Signup Error:', error.message)
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  // Trigger welcome email safely
  try {
    await sendWelcomeEmail(parsed.data.email)
  } catch (emailErr) {
    console.error('Email Dispatch Error:', emailErr)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
