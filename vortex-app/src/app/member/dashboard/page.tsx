import { createClient } from '@/lib/supabase/server'

const GYM_NOTICES = [
  { title: 'New Equipment Arrived!', body: 'Check out our brand new cable machines and Smith rack in Zone B.', type: 'info' },
  { title: 'Holiday Hours', body: 'We will operate 8am–4pm on public holidays. Normal hours otherwise.', type: 'warning' },
  { title: 'Challenge of the Month', body: '30-Day Squat Challenge is live! Join at reception or ask your trainer.', type: 'success' },
]

const GYM_HOURS = [
  { day: 'Monday – Friday', hours: '6:00 AM – 10:00 PM' },
  { day: 'Saturday', hours: '7:00 AM – 8:00 PM' },
  { day: 'Sunday', hours: '8:00 AM – 6:00 PM' },
  { day: 'Public Holidays', hours: '8:00 AM – 4:00 PM' },
]

export default async function MemberDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user!.id)
    .single()

  const { data: myRequests } = await supabase
    .from('requests')
    .select('id, status, request_type, created_at')
    .eq('member_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(3) as any

  const { data: routines } = await supabase
    .from('routines')
    .select('day_label, exercise_name')
    .eq('member_id', user!.id)
    .order('day_label') as any

  const uniqueDays = [...new Set(routines?.map(r => r.day_label) || [])]

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <p className="text-zinc-500 text-sm font-medium">{greeting} 👋</p>
        <h1 className="text-3xl font-black text-white mt-1">
          {profile?.full_name?.split(' ')[0] || 'Athlete'}
        </h1>
        <p className="text-zinc-600 text-sm mt-1">Ready to crush today?</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Workout Days', value: uniqueDays.length || 0, icon: '🏋️', color: 'red' },
          { label: 'Active Requests', value: myRequests?.filter(r => r.status !== 'completed').length || 0, icon: '📋', color: 'orange' },
          { label: 'Plan Status', value: uniqueDays.length > 0 ? 'Active' : 'Pending', icon: '⚡', color: 'green' },
          { label: 'Streak Days', value: '—', icon: '🔥', color: 'yellow' },
        ].map(stat => (
          <div key={stat.label} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 hover:border-red-800/40 transition-colors">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-black text-white">{stat.value}</div>
            <div className="text-xs text-zinc-500 mt-1 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Gym Billboard */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-bold text-zinc-400 tracking-widest uppercase flex items-center gap-2">
            <span className="w-6 h-[2px] bg-red-600" /> Gym Billboard
          </h2>
          {GYM_NOTICES.map((notice, i) => (
            <div key={i} className={`p-4 rounded-xl border ${
              notice.type === 'success' ? 'bg-green-950/20 border-green-800/30' :
              notice.type === 'warning' ? 'bg-yellow-950/20 border-yellow-800/30' :
              'bg-blue-950/20 border-blue-800/30'
            }`}>
              <h3 className={`font-bold text-sm ${
                notice.type === 'success' ? 'text-green-400' :
                notice.type === 'warning' ? 'text-yellow-400' : 'text-blue-400'
              }`}>{notice.title}</h3>
              <p className="text-zinc-400 text-sm mt-1 leading-relaxed">{notice.body}</p>
            </div>
          ))}

          {/* Quick Actions */}
          <h2 className="text-sm font-bold text-zinc-400 tracking-widest uppercase flex items-center gap-2 pt-2">
            <span className="w-6 h-[2px] bg-red-600" /> Quick Actions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { href: '/member/request', label: 'Request Plan', icon: '📋', desc: 'Get a trainer' },
              { href: '/member/my-plan', label: 'My Workout', icon: '💪', desc: 'View routine' },
              { href: '/member/diet', label: 'Diet Chart', icon: '🥗', desc: 'See nutrition' },
              { href: '/member/explore', label: 'Exercise Library', icon: '🔍', desc: 'Browse exercises' },
              { href: '/member/bookmarks', label: 'Bookmarks', icon: '🔖', desc: 'Saved exercises' },
            ].map(action => (
              <a key={action.href} href={action.href}
                className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-red-700/50 hover:bg-red-950/10 transition-all duration-300 group">
                <div className="text-xl mb-2">{action.icon}</div>
                <div className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">{action.label}</div>
                <div className="text-xs text-zinc-600 mt-0.5">{action.desc}</div>
              </a>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Gym Hours */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
            <h2 className="text-sm font-bold text-zinc-400 tracking-widest uppercase flex items-center gap-2 mb-4">
              <span className="w-4 h-[2px] bg-red-600" /> Gym Hours
            </h2>
            <div className="space-y-3">
              {GYM_HOURS.map(h => (
                <div key={h.day} className="flex flex-col gap-0.5">
                  <span className="text-xs text-zinc-500">{h.day}</span>
                  <span className="text-sm font-semibold text-white">{h.hours}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Requests */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
            <h2 className="text-sm font-bold text-zinc-400 tracking-widest uppercase flex items-center gap-2 mb-4">
              <span className="w-4 h-[2px] bg-red-600" /> My Requests
            </h2>
            {myRequests && myRequests.length > 0 ? (
              <div className="space-y-3">
                {myRequests.map(req => (
                  <div key={req.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white capitalize">{req.request_type}</p>
                      <p className="text-xs text-zinc-600">{new Date(req.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      req.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      req.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-zinc-800 text-zinc-500'
                    }`}>
                      {req.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-zinc-600 text-sm">No requests yet</p>
                <a href="/member/request" className="text-red-500 text-xs hover:text-red-400 mt-1 block">Create one →</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
