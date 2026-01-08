import { expect, test } from '@playwright/test'

test.describe('Navigation', () => {
  test('should have all 5 navigation items in header', async ({ page }) => {
    await page.goto('/')

    // Check for all navigation items
    await expect(page.getByRole('link', { name: /home|首页/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /check-ins|打卡/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /achievements|成就/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /shop|商品/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /profile|个人中心/i })).toBeVisible()
  })

  test('should navigate to Home page', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveURL('/')
    // Check for Home page content
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('should navigate to Check-ins page', async ({ page }) => {
    await page.goto('/')

    await page.click('text=/check-ins|打卡/i')
    await expect(page).toHaveURL('/checkins')
    // Check for Check-ins page heading
    await expect(
      page.getByRole('heading', { name: /my check-ins|我的打卡/i })
    ).toBeVisible()
  })

  test('should navigate to Achievements page', async ({ page }) => {
    await page.goto('/')

    await page.click('text=/achievements|成就/i')
    await expect(page).toHaveURL('/achievements')
    // Check for Achievements page heading
    await expect(
      page.getByRole('heading', { name: /my achievements|我的成就/i })
    ).toBeVisible()
  })

  test('should navigate to Shop page', async ({ page }) => {
    await page.goto('/')

    await page.click('text=/shop|商品/i')
    await expect(page).toHaveURL('/shop')
    // Check for Shop page heading
    await expect(
      page.getByRole('heading', { name: /prize shop|奖品商店/i })
    ).toBeVisible()
  })

  test('should navigate to Profile page', async ({ page }) => {
    await page.goto('/')

    await page.click('text=/profile|个人中心/i')
    await expect(page).toHaveURL('/profile')
    // Check for Profile page heading
    await expect(page.getByRole('heading', { name: /profile|个人中心/i })).toBeVisible()
  })

  test('should highlight active navigation item', async ({ page }) => {
    await page.goto('/checkins')

    // The check-ins nav link should have active styling
    const checkinsLink = page.getByRole('link', { name: /check-ins|打卡/i })
    await expect(checkinsLink).toHaveClass(/text-white/)
  })

  test('should navigate between pages using nav links', async ({ page }) => {
    await page.goto('/')

    // Navigate through all pages
    await page.click('text=/check-ins|打卡/i')
    await expect(page).toHaveURL('/checkins')

    await page.click('text=/achievements|成就/i')
    await expect(page).toHaveURL('/achievements')

    await page.click('text=/shop|商品/i')
    await expect(page).toHaveURL('/shop')

    await page.click('text=/profile|个人中心/i')
    await expect(page).toHaveURL('/profile')

    await page.click('text=/home|首页/i')
    await expect(page).toHaveURL('/')
  })
})
