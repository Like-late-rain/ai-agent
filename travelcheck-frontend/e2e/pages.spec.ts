import { expect, test } from '@playwright/test'

test.describe('Page Content', () => {
  test.describe('Home Page', () => {
    test('should display home page with design mockup content', async ({ page }) => {
      await page.goto('/')

      // Should show "LIVE ON MAINNET" badge
      await expect(page.getByText(/live on mainnet|主网运行中/i)).toBeVisible()

      // Should show main title
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

      // Should show Daily Task Check-in and Attraction Hunt cards
      await expect(page.getByText(/daily task check-in|每日任务打卡/i)).toBeVisible()
      await expect(page.getByText(/attraction hunt|景点探索/i)).toBeVisible()

      // Should show global stats
      await expect(page.getByText(/global participants|全球参与者/i)).toBeVisible()
      await expect(page.getByText(/tasks completed|任务完成数/i)).toBeVisible()
      await expect(page.getByText(/active today|今日活跃/i)).toBeVisible()
    })

    test('should navigate to stake page from daily task card', async ({ page }) => {
      await page.goto('/')

      // Click on Daily Task Check-in card
      await page.getByText(/start check-in|开始打卡/i).click()

      // Should navigate to stake page
      await expect(page).toHaveURL('/stake')
    })
  })

  test.describe('Stake Page', () => {
    test('should display stake creation form', async ({ page }) => {
      await page.goto('/stake')

      // Should show form elements
      await expect(page.getByText(/stake type|质押类型/i)).toBeVisible()
      await expect(page.getByText(/daily task|每日任务/i)).toBeVisible()
      await expect(page.getByText(/attraction|景点/i)).toBeVisible()
      await expect(page.getByText(/stake amount|质押金额/i)).toBeVisible()
      await expect(page.getByText(/milestone|里程碑/i)).toBeVisible()
      await expect(page.getByText(/lock mode|锁定模式/i)).toBeVisible()
    })
  })

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

  test.describe('Attractions Page', () => {
    test('should display attractions page', async ({ page }) => {
      await page.goto('/attractions')

      // Page should load without errors
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    })
  })

  test.describe('Rewards Page', () => {
    test('should display rewards page', async ({ page }) => {
      await page.goto('/rewards')

      // Page should load without errors
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
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
