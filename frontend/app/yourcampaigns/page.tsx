'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'

interface Campaign {
  id: string
  title: string
  description: string | { original?: string; aiEnhanced?: string }
  aiDescription?: string
  channels: Record<string, any>
  createdAt: any
  updatedAt: any
  channelContent?: {
    voice?: { transcript?: string }
    calls?: { transcript?: string }
  }
  audioUrls?: {
    voice?: string
    calls?: string
  }
}

export default function YourCampaignsPage() {
  const router = useRouter()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        console.log('📋 Fetching your campaigns...')
        const res = await fetch('/api/yourcampaigns')
        const data = await res.json()

        if (!res.ok) {
          setError(data.error || 'Failed to load campaigns')
          setLoading(false)
          return
        }

        console.log('✅ Campaigns loaded:', data.campaigns.length)
        setCampaigns(data.campaigns)
      } catch (err) {
        console.error('Error fetching campaigns:', err)
        setError('Failed to load campaigns')
      } finally {
        setLoading(false)
      }
    }

    fetchCampaigns()
  }, [])

  const handleDelete = async (e: React.MouseEvent, campaignId: string) => {
    e.preventDefault()
    e.stopPropagation()

    if (!window.confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      return
    }

    try {
      setDeletingId(campaignId)
      console.log('🗑️ Deleting campaign:', campaignId)

      const res = await fetch(`/api/campaigns/${campaignId}/delete`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete campaign')
      }

      console.log('✅ Campaign deleted:', campaignId)
      setCampaigns((prev) => prev.filter((c) => c.id !== campaignId))
    } catch (err) {
      console.error('Error deleting campaign:', err)
      alert(err instanceof Error ? err.message : 'Failed to delete campaign')
    } finally {
      setDeletingId(null)
    }
  }

  const getChannelNames = (channels: Record<string, any>) => {
    if (!channels || typeof channels !== 'object') return 'No channels'
    return Object.entries(channels)
      .filter(([, v]: any) => v?.enabled)
      .map(([k]) => {
        if (k === 'text') return '📝 Text'
        if (k === 'voice') return '🎙️ Voice'
        if (k === 'calls') return '☎️ Calls'
        return k
      })
      .join(' • ') || 'No channels'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
      
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center space-y-3">
              <p className="text-white">Loading your campaigns...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black">
        
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center space-y-3">
              <p className="text-red-400">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 rounded-lg bg-white hover:bg-white/95 text-black font-semibold transition cursor-pointer"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
    
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-10 flex items-center justify-between">
          <Link
            href="/"
            className="px-4 py-2 rounded-lg border border-white/30 text-white hover:bg-white/5 transition cursor-pointer"
          >
            ← Back
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Your Campaigns</h1>
            <p className="text-white/60">Manage all your outreach campaigns</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/inbox"
              className="px-6 py-2.5 rounded-full border border-white/30 text-white hover:bg-white/5 transition cursor-pointer"
            >
              Inbox
            </Link>
            <Link
              href="/campaign/title"
              className="px-6 py-2.5 rounded-full border border-white/30 text-white hover:bg-white/5 transition cursor-pointer"
            >
              New Campaign
            </Link>
          </div>
        </div>

        {campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <div className="text-6xl mb-4">📁</div>
            <p className="text-white text-lg mb-2">No campaigns yet</p>
            <p className="text-white/60 mb-6">Create your first campaign to get started</p>
            <Link
              href="/campaign/description"
              className="px-6 py-2.5 rounded-lg bg-white hover:bg-white/95 text-black font-semibold transition shadow-[0_4px_12px_rgba(255,255,255,0.2)] cursor-pointer"
            >
              Create Campaign
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="relative group">
                <Link
                  href={`/yourcampaigns/${campaign.id}`}
                  className="block rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/50 p-6 hover:from-slate-900/70 hover:to-slate-800/70 transition cursor-pointer h-full"
                >
                  {/* Campaign Title */}
                  <h3 className="text-white font-semibold text-lg truncate mb-2">
                    {campaign.title || 'Untitled Campaign'}
                  </h3>

                  {/* Description Preview */}
                  <p className="text-white/60 text-sm line-clamp-2 mb-4">
                    {(() => {
                      let desc = ''
                      if (typeof campaign.description === 'object' && campaign.description) {
                        desc = campaign.description.aiEnhanced || campaign.description.original || ''
                      } else if (typeof campaign.description === 'string') {
                        desc = campaign.description || ''
                      }
                      return campaign.aiDescription || desc || 'No description yet'
                    })()}
                  </p>

                  {/* Voice Transcript & Audio */}
                  {campaign.channelContent?.voice?.transcript && (
                    <div className="mb-3 pb-3 border-b border-white/10">
                      <p className="text-xs text-white/40 mb-1">🎙️ Voice Transcript</p>
                      <p className="text-xs text-white/70 line-clamp-2 mb-2">{campaign.channelContent.voice.transcript}</p>
                      {campaign.audioUrls?.voice && (
                        <audio controls src={campaign.audioUrls.voice} className="w-full h-6 rounded text-xs" />
                      )}
                    </div>
                  )}

                  {/* Call Transcript & Audio */}
                  {campaign.channelContent?.calls?.transcript && (
                    <div className="mb-4 pb-3 border-b border-white/10">
                      <p className="text-xs text-white/40 mb-1">☎️ Call Transcript</p>
                      <p className="text-xs text-white/70 line-clamp-2 mb-2">{campaign.channelContent.calls.transcript}</p>
                      {campaign.audioUrls?.calls && (
                        <audio controls src={campaign.audioUrls.calls} className="w-full h-6 rounded text-xs" />
                      )}
                    </div>
                  )}

                  {/* Channels */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {Object.entries(campaign.channels || {})
                      .filter(([, v]: any) => v?.enabled)
                      .map(([k]) => (
                        <span key={k} className="text-[10px] px-2.5 py-1 rounded-full bg-slate-700/80 text-slate-200 border border-slate-600/50">
                          {k === 'text' && '📝 Text'}
                          {k === 'voice' && '🎙️ Voice'}
                          {k === 'calls' && '☎️ Calls'}
                        </span>
                      ))}
                  </div>

                  {/* Metadata */}
                  <div className="text-xs text-white/40 pt-4 border-t border-white/10 flex items-center justify-between">
                    <span>
                      {campaign.createdAt?.toDate?.()?.toLocaleDateString?.() ||
                        new Date(campaign.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-white/30 group-hover:text-purple-400 transition">→</span>
                  </div>
                </Link>

                {/* Delete Button */}
                <button
                  onClick={(e) => handleDelete(e, campaign.id)}
                  disabled={deletingId === campaign.id}
                  className="absolute top-3 right-3 p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete campaign"
                >
                  {deletingId === campaign.id ? (
                    <div className="w-5 h-5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="w-5 h-5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
