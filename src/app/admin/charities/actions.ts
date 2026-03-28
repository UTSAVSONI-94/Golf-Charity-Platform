'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const charitySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
})

export async function addCharity(formData: FormData) {
  const supabase = await createClient()

  const parsed = charitySchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
  })

  if (!parsed.success) {
    redirect('/admin/charities?error=Invalid charity name.')
  }

  const { error } = await supabase.from('charities').insert({
    name: parsed.data.name,
    description: parsed.data.description || null,
    featured: false,
  })

  if (error) {
    redirect(`/admin/charities?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/admin/charities?success=Charity added successfully.')
}

export async function deleteCharity(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string
  if (!id) redirect('/admin/charities?error=Missing charity ID')

  const { error } = await supabase.from('charities').delete().eq('id', id)
  if (error) {
    redirect(`/admin/charities?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/admin/charities?success=Charity removed.')
}

export async function toggleFeatured(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string
  const currentFeatured = formData.get('featured') === 'true'

  if (!id) redirect('/admin/charities?error=Missing charity ID')

  const { error } = await supabase
    .from('charities')
    .update({ featured: !currentFeatured })
    .eq('id', id)

  if (error) {
    redirect(`/admin/charities?error=${encodeURIComponent(error.message)}`)
  }

  redirect(`/admin/charities?success=Charity ${!currentFeatured ? 'featured' : 'unfeatured'}.`)
}
