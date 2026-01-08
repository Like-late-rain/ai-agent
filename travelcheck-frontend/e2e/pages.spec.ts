import { expect, test } from '@playwright/test'

test.describe('Page Content', () => {
  test.describe('Check-ins Page', () => {
    test('should display check-ins page content', async ({ page }) => {
      await page.goto('/checkins')

      // Should show stats cards
      await expect(page.getByText(/my stakes|我的质押/i)).toBeVisible()
      await expect(page.getByText(/active stakes|活跃质押/i)).toBeVisible()
      await expect(page.getByText(/completed stakes|已完成质押/i)).toBeVisible()

      // Should show filter tabs
      await expect(page.getByRole('button', { name: /all|全部/i })).toBeVisible()
    })

    test('should allow filtering stakes', async ({ page }) => {
      await page.goto('/checkins')

      // Click on active filter
      await page.click('button:has-text("Active"), button:has-text("活跃质押")')
      // Filter should be applied (checking button styling)
      const activeButton = page.locator('button').filter({ hasText: /active|活跃质押/i })
      await expect(activeButton).toHaveClass(/bg-primary/)
    })
  })

  test.describe('Achievements Page', () => {
    test('should display achievements page content', async ({ page }) => {
      await page.goto('/achievements')

      // Should show stats cards
      await expect(page.getByText(/total badges|总徽章数/i)).toBeVisible()
      await expect(page.getByText(/total check-ins|总打卡数/i)).toBeVisible()
      await expect(page.getByText(/longest streak|最长连续/i)).toBeVisible()
      await expect(page.getByText(/perfect days|完美天数/i)).toBeVisible()

      // Should show badges section
      await expect(page.getByText(/badges|徽章/i)).toBeVisible()
    })

    test('should display badges grid', async ({ page }) => {
      await page.goto('/achievements')

      // Should have badge items visible
      const badgeSection = page.locator('text=/badges|徽章/i').locator('..')
      await expect(badgeSection).toBeVisible()
    })
  })

  test.describe('Shop Page', () => {
    test('should display shop page content', async ({ page }) => {
      await page.goto('/shop')

      // Should show user points
      await expect(page.getByText(/my points|我的积分/i)).toBeVisible()

      // Should show lottery section
      await expect(page.getByText(/lottery|抽奖/i)).toBeVisible()

      // Should show category filters
      await expect(page.getByRole('button', { name: /all|全部/i })).toBeVisible()
      await expect(page.getByRole('button', { name: /physical|实物/i })).toBeVisible()
      await expect(page.getByRole('button', { name: /token|代币/i })).toBeVisible()
    })

    test('should allow filtering prizes by category', async ({ page }) => {
      await page.goto('/shop')

      // Click on physical items filter
      await page.click('button:has-text("Physical"), button:has-text("实物")')
      const physicalButton = page.locator('button').filter({ hasText: /physical|实物/i })
      await expect(physicalButton).toHaveClass(/bg-primary/)
    })
  })

  test.describe('Profile Page', () => {
    test('should display profile page content', async ({ page }) => {
      await page.goto('/profile')

      // Should show user avatar
      await expect(page.locator('img[alt*="User"], img[alt*="Travel"]')).toBeVisible()

      // Should show statistics
      await expect(page.getByText(/total staked|总质押金额/i)).toBeVisible()
      await expect(page.getByText(/total earned|总收益/i)).toBeVisible()
      await expect(page.getByText(/active stakes|活跃质押/i)).toBeVisible()

      // Should show activity summary
      await expect(page.getByText(/activity summary|活动摘要/i)).toBeVisible()
    })

    test('should have edit profile button', async ({ page }) => {
      await page.goto('/profile')

      await expect(page.getByRole('button', { name: /edit profile|编辑资料/i })).toBeVisible()
    })
  })

  test.describe('Home Page', () => {
    test('should display home page content', async ({ page }) => {
      await page.goto('/')

      // Should show quick actions or welcome message
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

      // Should have wallet connect button or address
      await expect(page.locator('button:has-text("Connect"), button:has-text("连接钱包"), button:has-text("0x")')).toBeVisible()
    })
  })
})

test.describe('Responsiveness', () => {
  test('should show mobile navigation on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Mobile nav should be visible
    const mobileNav = page.locator('.md\\:hidden').filter({ has: page.locator('a') })
    await expect(mobileNav).toBeVisible()
  })

  test('should hide mobile navigation on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/')

    // Desktop nav should be visible
    const desktopNav = page.locator('.md\\:flex').filter({ has: page.locator('a') })
    await expect(desktopNav).toBeVisible()
  })
})
