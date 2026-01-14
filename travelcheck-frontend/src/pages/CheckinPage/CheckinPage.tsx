/**
 * @file CheckinPage Component
 * @description Page for daily check-in
 */

import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { Input } from '@/components/common/Input'
import { type FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

/**
 * CheckinPage Component
 */
export function CheckinPage() {
  const { t } = useTranslation()
  const { stakeId } = useParams<{ stakeId: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    content: '',
    location: { lat: 0, lng: 0 },
    images: [] as string[],
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      alert(t('checkinPage.alerts.success'))
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
          alert(t('checkinPage.alerts.locationFailed', { message: error.message }))
        }
      )
    } else {
      alert(t('checkinPage.alerts.geolocationUnsupported'))
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{t('checkinPage.title')}</h1>
        <p className="text-text-muted">{t('checkinPage.subtitle')}</p>
      </div>

      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold text-white">{t('checkinPage.formTitle')}</h2>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Content Input */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-white mb-2">
                {t('checkinPage.shareExperienceLabel')} *
              </label>
              <textarea
                id="content"
                className="w-full px-4 py-3 bg-background-dark border-2 border-border-dark rounded-lg text-white placeholder-text-muted focus:border-primary focus:outline-none"
                placeholder={t('checkinPage.shareExperiencePlaceholder', { count: 200 })}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
                minLength={200}
                required
              />
              <p className="text-xs text-text-muted mt-1">
                {t('checkinPage.contentMinHint', {
                  current: formData.content.length,
                  count: 200,
                })}
              </p>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location-input" className="block text-sm font-medium text-white mb-2">
                {t('checkinPage.locationLabel')}
              </label>
              <div className="flex gap-2">
                <Input
                  id="location-input"
                  type="text"
                  value={
                    formData.location.lat && formData.location.lng
                      ? `${formData.location.lat.toFixed(6)}, ${formData.location.lng.toFixed(6)}`
                      : t('checkinPage.noLocation')
                  }
                  readOnly
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={handleGetLocation}>
                  {t('checkinPage.getLocation')}
                </Button>
              </div>
            </div>

            {/* Image Upload Placeholder */}
            <div>
              <div className="block text-sm font-medium text-white mb-2">
                {t('checkinPage.photosLabel')} *
              </div>
              <div className="border-2 border-dashed border-border-dark rounded-lg p-8 text-center">
                <div className="text-4xl mb-2">📷</div>
                <p className="text-text-muted text-sm">{t('checkinPage.uploadPrompt')}</p>
                <p className="text-text-muted text-xs mt-1">{t('checkinPage.photoRequirement')}</p>
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
                {t('common.cancel')}
              </Button>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={loading}
                disabled={loading || formData.content.length < 200}
              >
                {loading ? t('checkinPage.submitting') : t('checkinPage.submit')}
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>

      {/* Tips Card */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold text-white">{t('checkinPage.tips.title')}</h2>
        </Card.Header>
        <Card.Body>
          <div className="space-y-2 text-sm text-text-muted">
            <p>✓ {t('checkinPage.tips.item1')}</p>
            <p>✓ {t('checkinPage.tips.item2')}</p>
            <p>✓ {t('checkinPage.tips.item3')}</p>
            <p>✓ {t('checkinPage.tips.item4')}</p>
            <p>✓ {t('checkinPage.tips.item5')}</p>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}
