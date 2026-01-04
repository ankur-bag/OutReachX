'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { VscCallOutgoing } from 'react-icons/vsc'
import type { ChannelConfig } from '@/campaign/CampaignContext'

interface Asset {
  url: string
  publicId: string
  type: 'image' | 'video'
}

interface LoadedCampaign {
  id: string
  title: string
  description: string | { original?: string; aiEnhanced?: string }
  channels: ChannelConfig
  toneOfVoice?: string
  assets?: Asset[]
  contactCount: number
  status: string
  csvStoragePath?: string
  aiDescription?: string
  previewText?: string
  transcript?: string
  contactsFile?: { url: string; publicId: string; name?: string }
  documents?: { url: string; publicId: string; name: string; extractedText: string; uploadedAt: string }[]
  channelContent?: {
    voice?: { transcript?: string }
    calls?: { transcript?: string }
  }
  audioUrls?: {
    voice?: string
    calls?: string
  }
  audioPublicIds?: {
    voice?: string
    calls?: string
  }
}

export default function CampaignDetailPage() {
  const router = useRouter()
  const params = useParams()
  const campaignId = params.campaignId as string

  const [loadedCampaign, setLoadedCampaign] = useState<LoadedCampaign | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [makingCalls, setMakingCalls] = useState(false)
  const [callSuccess, setCallSuccess] = useState('')

  useEffect(() => {
    const loadCampaign = async () => {
      try {
        if (!campaignId) {
          setError('No campaign ID found')
          setLoading(false)
          return
        }

        console.log('📡 Fetching campaign from API:', campaignId)

        // Use API endpoint instead of client SDK
        const response = await fetch(`/api/campaigns/${campaignId}`)
        const data = await response.json()

        if (response.ok) {
          console.log('✅ Campaign loaded from API:', {
            title: data.campaign.title,
            hasChannelContent: !!data.campaign.channelContent,
            channelContent: data.campaign.channelContent,
            audioUrls: data.campaign.audioUrls,
          })

          setLoadedCampaign(data.campaign)
        } else {
          setError(data.error || 'Failed to load campaign')
        }
      } catch (err) {
        console.error('❌ Error loading campaign:', err)
        setError(`Failed to load campaign: ${err instanceof Error ? err.message : String(err)}`)
      } finally {
        setLoading(false)
      }
    }

    loadCampaign()
  }, [campaignId])

  const handleMakeCalls = async () => {
    if (!campaignId) {
      setError('Campaign ID not found')
      return
    }

    try {
      setError('')
      setCallSuccess('')
      setMakingCalls(true)

      console.log('📞 Making calls for campaign:', campaignId)
      const response = await fetch(`/api/campaigns/${campaignId}/make-calls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to make calls')
      }

      console.log('✅ Calls initiated:', data.callResults)
      setCallSuccess(`📞 Calls initiated! Successful: ${data.callResults.successfulCalls}/${data.callResults.totalCalls}`)
    } catch (err) {
      console.error('Error making calls:', err)
      setError(err instanceof Error ? err.message : 'Failed to make calls')
    } finally {
      setMakingCalls(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
       
        <div className="max-w-6xl mx-auto px-4 py-12 flex items-center justify-center h-[60vh]">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <img 
                src="/favicon.svg" 
                alt="Loading" 
                className="w-12 h-12 animate-spin"
              />
            </div>
            <p className="text-white">Loading campaign...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error && !loadedCampaign) {
    return (
      <div className="min-h-screen bg-black">
       
        <div className="max-w-6xl mx-auto px-4 py-12 flex items-center justify-center h-[60vh]">
          <div className="text-center space-y-3">
            <p className="text-red-400">{error}</p>
            <button
              onClick={() => router.back()}
              className="px-6 py-2.5 rounded-lg bg-white hover:bg-white/95 text-black font-semibold"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!loadedCampaign) {
    return (
      <div className="min-h-screen bg-black">
      
        <div className="max-w-6xl mx-auto px-4 py-12 flex items-center justify-center h-[60vh]">
          <p className="text-white">No campaign data found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
     
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/yourcampaigns"
            className="text-white/60 hover:text-white transition flex items-center gap-2"
          >
            ← Back to Campaigns
          </Link>
          
          {loadedCampaign?.channels?.calls?.enabled && (
            <button
              onClick={handleMakeCalls}
              disabled={makingCalls}
              className="text-xl font-medium text-white px-2 py-1.5 border-2 border-white rounded-xl hover:bg-white/10 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {makingCalls ? (
                <>
                  <span className="inline-block animate-spin">⏳</span>
                  Making Calls...
                </>
              ) : (
                <>
                  <VscCallOutgoing className='text-green-400 text-xl' />
                  Make Call
                </>
              )}
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {callSuccess && (
          <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
            {callSuccess}
          </div>
        )}

        {/* Campaign Info */}
        <div className="bg-black/40 border border-white/10 rounded-2xl p-8 space-y-6">
          {/* Title */}
          <div>
            <p className="text-xs text-white/50 mb-2">Title</p>
            <h1 className="text-4xl font-bold text-white">{loadedCampaign.title}</h1>
          </div>

          {/* Original Description */}
          <div>
            <p className="text-xs text-white/50 mb-2">Original Description</p>
            <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">
              {(typeof loadedCampaign.description === 'object' 
                ? loadedCampaign.description?.original 
                : loadedCampaign.description) || 'No description provided'}
            </p>
          </div>

          {/* AI Description */}
          {(typeof loadedCampaign.description === 'object' 
            ? loadedCampaign.description?.aiEnhanced 
            : loadedCampaign.aiDescription) && (
            <div>
              <p className="text-xs text-white/50 mb-2">AI-Enhanced Description</p>
              <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">
                {(typeof loadedCampaign.description === 'object' 
                  ? loadedCampaign.description?.aiEnhanced 
                  : loadedCampaign.aiDescription)}
              </p>
            </div>
          )}

          {/* Channel Details */}
          <div>
            <p className="text-xs text-white/50 mb-3">Channels & Limits</p>
            <div className="space-y-2">
              {loadedCampaign.channels.text?.enabled && (
                <div className="flex justify-between items-center px-3 py-2 bg-black/30 rounded-lg border border-white/10">
                  <span className="text-white/80">📝 Text</span>
                  <span className="text-xs text-white/60">{loadedCampaign.channels.text.wordLimit} words max</span>
                </div>
              )}
              {loadedCampaign.channels.voice?.enabled && (
                <div className="flex justify-between items-center px-3 py-2 bg-black/30 rounded-lg border border-white/10">
                  <span className="text-white/80">🎙️ Voice</span>
                  <span className="text-xs text-white/60">{loadedCampaign.channels.voice.maxDurationSeconds}s max</span>
                </div>
              )}
              {loadedCampaign.channels.calls?.enabled && (
                <div className="flex justify-between items-center px-3 py-2 bg-black/30 rounded-lg border border-white/10">
                  <span className="text-white/80">☎️ Calls</span>
                  <span className="text-xs text-white/60">{loadedCampaign.channels.calls.maxCallDurationSeconds}s max</span>
                </div>
              )}
            </div>
          </div>

          {/* Voice Message Transcript */}
          {loadedCampaign.channels.voice?.enabled && loadedCampaign.channelContent?.voice?.transcript && (
            <div>
              <p className="text-xs text-white/50 mb-2">🎙️ Voice Message Script</p>
              <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap bg-black/30 border border-white/10 rounded-lg p-3">
                {loadedCampaign.channelContent.voice.transcript}
              </p>
              {loadedCampaign.audioUrls?.voice && (
                <div className="mt-3">
                  <p className="text-xs text-white/50 mb-2">🎵 Voice Audio</p>
                  <audio
                    controls
                    src={loadedCampaign.audioUrls.voice}
                    className="w-full bg-black/30 rounded-lg"
                  />
                </div>
              )}
            </div>
          )}

          {/* Call Script */}
          {loadedCampaign.channels.calls?.enabled && loadedCampaign.channelContent?.calls?.transcript && (
            <div>
              <p className="text-xs text-white/50 mb-2">☎️ Call Script</p>
              <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap bg-black/30 border border-white/10 rounded-lg p-3">
                {loadedCampaign.channelContent.calls.transcript}
              </p>
              {loadedCampaign.audioUrls?.calls && (
                <div className="mt-3">
                  <p className="text-xs text-white/50 mb-2">☎️ Call Audio</p>
                  <audio
                    controls
                    src={loadedCampaign.audioUrls.calls}
                    className="w-full bg-black/30 rounded-lg"
                  />
                </div>
              )}
            </div>
          )}

          {/* Preview Text */}
          {/* {loadedCampaign.previewText && (
            <div>
              <p className="text-xs text-white/50 mb-2">Preview Text</p>
              <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">{loadedCampaign.previewText}</p>
            </div>
          )} */}

          {/* Assets */}
          <div>
            <p className="text-xs text-white/50 mb-3">Assets ({loadedCampaign.assets?.length || 0})</p>
            {loadedCampaign.assets && loadedCampaign.assets.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {loadedCampaign.assets.map((asset, idx) => (
                  <div key={idx} className="rounded-lg overflow-hidden aspect-square bg-black/60 border border-white/10">
                    {asset.type === 'image' ? (
                      <img src={asset.url} alt={`Asset ${idx}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-2xl">🎬</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/40 text-sm">No assets</p>
            )}
          </div>

          {/* Documents */}
          {loadedCampaign.documents && loadedCampaign.documents.length > 0 && (
            <div>
              <p className="text-xs text-white/50 mb-2">📄 Documents</p>
              <div className="space-y-3">
                {loadedCampaign.documents.map((doc, idx) => (
                  <div key={idx} className="px-4 py-3 rounded-lg bg-black/30 border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-white/80 text-sm block">{doc.name}</span>
                      <span className="text-xs text-white/60">
                        {doc.extractedText.length} characters extracted
                      </span>
                    </div>
                    <a
                      href={doc.url}
                      download
                      className="px-4 py-2 rounded-lg bg-blue-500/30 hover:bg-blue-500/50 text-blue-300 text-sm font-medium transition cursor-pointer"
                    >
                      ⬇️ Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contacts File */}
          {loadedCampaign.contactsFile && (
            <div>
              <p className="text-xs text-white/50 mb-2">Contacts File</p>
              <div className="px-4 py-3 rounded-lg bg-black/30 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-white/80 text-sm block">📄 {loadedCampaign.contactsFile?.name || 'Contacts uploaded'}</span>
                  <span className="text-xs text-white/60">({loadedCampaign.contactCount} contacts)</span>
                </div>
                <a
                  href={`/api/campaigns/${campaignId}/contacts/download`}
                  download
                  className="px-4 py-2 rounded-lg bg-blue-500/30 hover:bg-blue-500/50 text-blue-300 text-sm font-medium transition cursor-pointer"
                >
                  ⬇️ Download
                </a>
              </div>
            </div>
          )}

          {/* Back Button */}
          <div className="flex items-center justify-start gap-3 pt-6 border-t border-white/10">
            <Link
              href="/yourcampaigns"
              className="px-6 py-2.5 rounded-lg bg-black/40 border border-white/20 hover:bg-black/50 text-white font-medium transition cursor-pointer"
            >
              Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
