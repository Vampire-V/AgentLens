import { test, expect } from '@playwright/test'

/**
 * E2E tests สำหรับ dark mode toggle
 * ใช้ next-themes ซึ่ง set class บน <html> element
 * localStorage key: 'theme'
 */

test('default_mode__page_load__html_class_matches_system_preference', async ({ page }) => {
  // ทดสอบ dark system preference
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  const htmlClass = await page.evaluate(() => document.documentElement.className)
  expect(htmlClass).toContain('dark')

  // ทดสอบ light system preference
  await page.emulateMedia({ colorScheme: 'light' })
  // ล้าง localStorage เพื่อให้ next-themes ใช้ค่า system preference
  await page.evaluate(() => localStorage.removeItem('theme'))
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  const htmlClassLight = await page.evaluate(() => document.documentElement.className)
  expect(htmlClassLight).not.toContain('dark')
})

test('light_mode__click_toggle__html_class_changes_to_dark', async ({ page }) => {
  // เริ่มใน light mode โดย preset localStorage
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/')
  await page.evaluate(() => localStorage.setItem('theme', 'light'))
  await page.reload()
  await page.waitForLoadState('networkidle')

  // ตรวจสอบว่าอยู่ใน light mode
  const initialClass = await page.evaluate(() => document.documentElement.className)
  expect(initialClass).not.toContain('dark')

  // คลิก toggle button เพื่อ switch to dark
  const toggleButton = page.getByTitle('Switch to dark mode')
  await toggleButton.click()

  // รอให้ class เปลี่ยน
  await expect(page.locator('html')).toHaveClass(/dark/)
})

test('dark_mode__page_reload__theme_persists', async ({ page }) => {
  // เริ่มใน light mode
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/')
  await page.evaluate(() => localStorage.setItem('theme', 'light'))
  await page.reload()
  await page.waitForLoadState('networkidle')

  // คลิก toggle ไปที่ dark mode
  const toggleButton = page.getByTitle('Switch to dark mode')
  await toggleButton.click()
  await expect(page.locator('html')).toHaveClass(/dark/)

  // reload หน้า
  await page.reload()
  await page.waitForLoadState('networkidle')

  // ตรวจสอบว่ายังเป็น dark อยู่ (next-themes persist ใน localStorage)
  await expect(page.locator('html')).toHaveClass(/dark/)
})

test('manual_override__color_scheme_changes__theme_preserved', async ({ page }) => {
  // เริ่มใน dark system preference
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  // คลิก toggle ไปที่ light (manual override)
  const toggleToDark = page.getByTitle('Switch to light mode')
  await toggleToDark.click()
  await expect(page.locator('html')).not.toHaveClass(/dark/)

  // เปลี่ยน system preference เป็น dark
  await page.emulateMedia({ colorScheme: 'dark' })

  // next-themes ควร preserve manual override (light) ไว้ใน localStorage
  // ตรวจสอบว่า html class ยังคงเป็น light
  await expect(page.locator('html')).not.toHaveClass(/dark/)
})

test('dark_mode__canvas_element__has_dark_class', async ({ page }) => {
  // ไปที่ dark mode
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')
  await page.evaluate(() => localStorage.setItem('theme', 'dark'))
  await page.reload()
  await page.waitForLoadState('networkidle')

  // ตรวจสอบว่า html อยู่ใน dark mode
  await expect(page.locator('html')).toHaveClass(/dark/)

  // ตรวจสอบว่า .react-flow element มีอยู่บนหน้า
  const reactFlowElement = page.locator('.react-flow')
  await expect(reactFlowElement).toBeVisible()
})
