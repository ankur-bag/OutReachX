'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import useSWR from 'swr'

interface AnalyticsData {
  campaign: {
    id: string
    title: string
    description: any
    status: string
    createdAt: any
    launchedAt: any
  }
  analytics: {
    totalContacts: number
    contactsReceivedMessage: number
    contactsOpenedChat: number
    contactsReplied: number
    contactsNotInteracted: number
    voiceCalls: number
    voiceCallsAnswered: number
    voiceCallsMissed: number
    voiceCallsAnsweredRate: number
    textInteractions: number
    aiResponsesCount: number
    avgResponseTimeMs: number
    channels: {
      voice: boolean
      calls: boolean
      text: boolean
    }
    engagementScore: number
    totalConversations: number
    totalMessages: number
  }
  conversationSummary: any[]
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function AnalyticsPage() {
  const params = useParams()
  const router = useRouter()
  const campaignId = params.campaignId as string

  const { data, error, isLoading, mutate } = useSWR(
    campaignId ? `/api/campaigns/${campaignId}/analytics` : null,
    fetcher,
    { 
      refreshInterval: 20000, // 20s live refresh
      revalidateOnFocus: true,
      revalidateOnReconnect: true
    }
  )

  const loading = isLoading
  const errorMsg = error ? 'Failed to fetch analytics' : ''

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-7xl mx-auto px-4 py-12 flex items-center justify-center h-[60vh]">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <img 
                src="/favicon.svg" 
                alt="Loading" 
                className="w-12 h-12 animate-spin"
              />
            </div>
            <p className="text-white">Loading campaign analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-7xl mx-auto px-4 py-12 flex items-center justify-center h-[60vh]">
          <div className="text-center space-y-4">
            <p className="text-red-400 text-lg">{errorMsg || 'Campaign not found'}</p>
            <button
              onClick={() => router.back()}
              className="px-6 py-2.5 rounded-lg bg-white hover:bg-white/95 text-black font-semibold cursor-pointer"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  const { campaign, analytics } = data
  const formatDate = (dateVal: any) => {
    if (!dateVal) return 'N/A'
    const date = new Date(dateVal)
    return date.toLocaleDateString()
  }

  const formatTime = (ms: number) => {
    if (ms === 0) return 'N/A'
    const hours = Math.floor(ms / 3600000)
    const minutes = Math.floor((ms % 3600000) / 60000)
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition cursor-pointer"
            >
              ← Back
            </button>
            <h1 className="text-3xl font-bold">{campaign.title}</h1>
            <button
              onClick={() => mutate()}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg cursor-pointer bg-white/10 hover:bg-white/20 border border-white/20 transition flex items-center gap-2 disabled:opacity-50"
              title="Refresh analytics data"
            >
              <span className=  {isLoading ? 'animate-spin' : ''}>↻</span>
              Live Data
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Contacts */}
          <div className="bg-linear-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-lg p-6">
            <p className="text-white/60 text-sm mb-2">Total Contacts</p>
            <p className="text-3xl font-bold text-blue-400">{analytics.totalContacts}</p>
            <p className="text-white/40 text-xs mt-2">in this campaign</p>
          </div>

          {/* Contacts Received Message */}
          <div className="bg-linear-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-lg p-6">
            <p className="text-white/60 text-sm mb-2">📨 Message Received</p>
            <p className="text-3xl font-bold text-purple-400">{analytics.contactsReceivedMessage}</p>
            <p className="text-white/40 text-xs mt-2">
              {analytics.totalContacts > 0
                ? Math.round((analytics.contactsReceivedMessage / analytics.totalContacts) * 100)
                : 0}% delivery rate
            </p>
          </div>

          {/* Contacts Replied */}
          <div className="bg-linear-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-lg p-6">
            <p className="text-white/60 text-sm mb-2">💬 Replied/Engaged</p>
            <p className="text-3xl font-bold text-green-400">{analytics.contactsReplied}</p>
            <p className="text-white/40 text-xs mt-2">
              {analytics.totalContacts > 0
                ? Math.round((analytics.contactsReplied / analytics.totalContacts) * 100)
                : 0}% response rate
            </p>
          </div>

          {/* Calls Answered - Always show */}
          <div className="bg-linear-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20 rounded-lg p-6">
            <p className="text-white/60 text-sm mb-2">☎️ Overall Calls Answered from Your Phone No. in last 24 hrs</p>
            <p className="text-3xl font-bold text-orange-400">{analytics.voiceCallsAnswered}</p>
            <p className="text-white/40 text-xs mt-2">
              {analytics.voiceCalls > 0
                ? analytics.voiceCallsAnsweredRate
                : 0}% pickup rate
            </p>
          </div>
        </div>

        {/* Engagement Score */}
        <div className="bg-linear-to-r from-yellow-500/10 to-yellow-500/5 border border-yellow-500/20 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm mb-2">Overall Engagement Score</p>
              <p className="text-4xl font-bold text-yellow-400">{analytics.engagementScore}%</p>
              <p className="text-white/40 text-sm mt-2">
                {analytics.channels.calls 
                  ? 'Based on replies and call pickups' 
                  : 'Based on message replies'}
              </p>
            </div>
            <div className="hidden lg:flex items-center justify-center w-32 h-32">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#ffffff20" strokeWidth="8" />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#FBBF24"
                    strokeWidth="8"
                    strokeDasharray={`${(analytics.engagementScore / 100) * 282.6} 282.6`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{analytics.engagementScore}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="p-6 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition">
            <p className="text-white/60 text-sm mb-2">💬 Total Conversations</p>
            <p className="text-2xl font-bold text-white">{analytics.totalConversations}</p>
            <p className="text-white/40 text-xs mt-2">active discussions</p>
          </div>
          <div className="p-6 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition">
            <p className="text-white/60 text-sm mb-2">🤖 Doubts solved by AI</p>
            <p className="text-2xl font-bold text-cyan-400">{analytics.aiResponsesCount}</p>
            <p className="text-white/40 text-xs mt-2">AI-generated messages</p>
          </div>
        </div>

        {/* Two Column Layout - Contact Breakdown (Left) and Messages/Calls (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Left: Contact Breakdown */}
          <div className="bg-linear-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-lg p-6">
            <h3 className="text-base font-semibold text-blue-300 mb-6">👥 Contact breakdown</h3>
            <div className="h-80 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <Pie
                    data={[
                      { name: 'Opened', value: analytics.contactsOpenedChat, color: '#3b82f6' },
                      { name: 'Replied', value: analytics.contactsReplied, color: '#22c55e' },
                      { name: 'No action', value: analytics.contactsNotInteracted, color: '#525252' },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {[
                      { name: 'Opened', value: analytics.contactsOpenedChat, color: '#3b82f6' },
                      { name: 'Replied', value: analytics.contactsReplied, color: '#22c55e' },
                      { name: 'No action', value: analytics.contactsNotInteracted, color: '#525252' },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#171717',
                      border: '1px solid #262626',
                      borderRadius: '6px',
                      fontSize: '14px',
                      color: '#ffffff'
                    }}
                    labelStyle={{ color: '#ffffff' }}
                    formatter={(value) => [<span style={{ color: '#ffffff' }}>{value} contacts</span>, <span style={{ color: '#ffffff' }}>Count</span>]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-blue-500/20 transition-colors cursor-pointer group">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-blue-300 group-hover:text-blue-200 transition-colors">Opened</span>
                </div>
                <span className="text-sm font-medium text-blue-300">{analytics.contactsOpenedChat}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-green-500/20 transition-colors cursor-pointer group">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-green-300 group-hover:text-green-200 transition-colors">Replied</span>
                </div>
                <span className="text-sm font-medium text-green-300">{analytics.contactsReplied}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-500/20 transition-colors cursor-pointer group">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                  <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">No action</span>
                </div>
                <span className="text-sm font-medium text-gray-400">{analytics.contactsNotInteracted}</span>
              </div>
            </div>
          </div>

          {/* Right: Messages and Calls (Stacked) */}
          <div className="space-y-6">
            {/* Messages Card */}
            <div className="bg-linear-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-lg p-6">
              <h3 className="text-base font-semibold text-green-300 mb-6">💬 Messages</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-300/70">Total messages</span>
                  <span className="font-semibold text-green-300 text-lg">{analytics.totalMessages}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-300/70">Incoming</span>
                  <span className="font-semibold text-green-300 text-lg">{analytics.textInteractions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-300/70">AI responses</span>
                  <span className="font-semibold text-cyan-400 text-lg">{analytics.aiResponsesCount}</span>
                </div>
              </div>
            </div>

            {/* Calls Card - Always show */}
            <div className="bg-linear-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20 rounded-lg p-6">
              <h3 className="text-base font-semibold text-orange-300 mb-6">☎️ Calls [From Your Mobile No. in last 24hrs] </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-orange-300/70">Total calls</span>
                  <span className="font-semibold text-orange-300 text-lg">{analytics.voiceCalls}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-orange-300/70">Answered</span>
                  <span className="font-semibold text-green-400 text-lg">{analytics.voiceCallsAnswered}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-orange-300/70">Missed</span>
                  <span className="font-semibold text-red-400 text-lg">{analytics.voiceCallsMissed}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Channel Configuration */}
        {(analytics.channels.voice || analytics.channels.calls || analytics.channels.text) && (
          <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span>📢</span> Active Channels
            </h2>
            <div className="flex flex-wrap gap-4">
              {analytics.channels.voice && (
                <div className="px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30">
                  <p className="text-blue-300 text-sm font-medium">🎙️ Voice Messages</p>
                </div>
              )}
              {analytics.channels.calls && (
                <div className="px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/30">
                  <p className="text-orange-300 text-sm font-medium">☎️ Voice Calls</p>
                </div>
              )}
              {analytics.channels.text && (
                <div className="px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30">
                  <p className="text-green-300 text-sm font-medium">💬 Text Messages</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
