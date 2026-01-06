/**
 * @file CheckinPage Component
 * @description Page for daily check-in
 */

import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { Input } from '@/components/common/Input'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

/**
 * CheckinPage Component
 */
export function CheckinPage() {
  const { stakeId } = useParams<{ stakeId: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    content: '',
    location: { lat: 0, lng: 0 },
    images: [] as string[],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      alert('Check-in successful!')
      navigate('/')
    }, 1500)
  }

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          })
        },
        (error) => {
          alert('Failed to get location: ' + error.message)
        }
      )
    } else {
      alert('Geolocation is not supported by this browser')
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Daily Check-In</h1>
        <p className="text-text-muted">Share your travel moment</p>
      </div>

      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold text-white">Check-In Form</h2>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Content Input */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Share Your Experience *
              </label>
              <textarea
                className="w-full px-4 py-3 bg-background-dark border-2 border-border-dark rounded-lg text-white placeholder-text-muted focus:border-primary focus:outline-none"
                placeholder="Tell us about your day... (minimum 200 characters)"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
                minLength={200}
                required
              />
              <p className="text-xs text-text-muted mt-1">
                {formData.content.length} / 200 characters minimum
              </p>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Location</label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={
                    formData.location.lat && formData.location.lng
                      ? `${formData.location.lat.toFixed(6)}, ${formData.location.lng.toFixed(6)}`
                      : 'No location set'
                  }
                  readOnly
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={handleGetLocation}>
                  Get Location
                </Button>
              </div>
            </div>

            {/* Image Upload Placeholder */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Photos *</label>
              <div className="border-2 border-dashed border-border-dark rounded-lg p-8 text-center">
                <div className="text-4xl mb-2">📷</div>
                <p className="text-text-muted text-sm">Click to upload photos</p>
                <p className="text-text-muted text-xs mt-1">At least one photo required</p>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={() => navigate(`/calendar/${stakeId}`)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={loading}
                disabled={loading || formData.content.length < 200}
              >
                {loading ? 'Submitting...' : 'Submit Check-In'}
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>

      {/* Tips Card */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold text-white">Check-In Tips</h2>
        </Card.Header>
        <Card.Body>
          <div className="space-y-2 text-sm text-text-muted">
            <p>✓ Share genuine travel experiences</p>
            <p>✓ Include clear photos of your location</p>
            <p>✓ Write at least 200 characters</p>
            <p>✓ Check in within 24 hours to maintain streak</p>
            <p>✓ You have 3 makeup chances if you miss a day</p>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}
