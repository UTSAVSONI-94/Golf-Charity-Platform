import { createClient } from '@/utils/supabase/server'

export default async function CharitiesPage() {
  const supabase = await createClient()
  const { data: charities } = await supabase.from('charities').select('*').order('featured', { ascending: false })

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Our Supported Charities</h1>
        <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
          At least 10% of every subscription goes directly to these verified causes. 
          You can allocate your specific contribution in your dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {(charities || []).length > 0 ? charities?.map((charity) => (
          <div key={charity.id} className="glass rounded-3xl overflow-hidden hover:-translate-y-2 transition-transform duration-300">
            {charity.image_url ? (
              <div className="h-48 relative w-full bg-neutral-900">
                <img src={charity.image_url} alt={charity.name} className="object-cover w-full h-full opacity-80" />
              </div>
            ) : (
              <div className="h-48 w-full bg-emerald-900/20 flex items-center justify-center">
                <span className="text-emerald-500 font-medium">No Image</span>
              </div>
            )}
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold">{charity.name}</h3>
                {charity.featured && (
                  <span className="text-xs font-semibold bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/30">
                    Featured
                  </span>
                )}
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                {charity.description || "A wonderful cause supporting those in need."}
              </p>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center text-neutral-500 bg-white/5 rounded-3xl border border-white/10">
            Charities are currently being updated. Please check back soon!
          </div>
        )}
      </div>
    </main>
  )
}
