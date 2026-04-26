import { test, expect } from '@playwright/test';

test('default_yaml__load__animateMotion_elements_present', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  // .react-flow__edges เป็น SVG group ไม่มี bounding box ใช้ 'attached' แทน 'visible'
  await page.locator('.react-flow__edges').waitFor({ state: 'attached', timeout: 10000 });

  const motionCount = await page.locator('animateMotion').count();
  expect(motionCount).toBeGreaterThan(0);
});

test('coordinator_edge__load__circles_have_purple_fill', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  // .react-flow__edges เป็น SVG group ไม่มี bounding box ใช้ 'attached' แทน 'visible'
  await page.locator('.react-flow__edges').waitFor({ state: 'attached', timeout: 10000 });

  const circles = page.locator('circle[fill="#a78bfa"]');
  // SVG circle ไม่มี bounding box ปกติ ใช้ count แทน toBeVisible
  expect(await circles.count()).toBeGreaterThan(0);
});

test('edge_with_label__hover__tooltip_becomes_visible', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  // .react-flow__edges เป็น SVG group ไม่มี bounding box ใช้ 'attached' แทน 'visible'
  await page.locator('.react-flow__edges').waitFor({ state: 'attached', timeout: 10000 });

  const tooltips = page.locator('.nodrag span');
  const count = await tooltips.count();
  expect(count).toBeGreaterThan(0);

  const tooltipGroup = page.locator('.nodrag').first();
  // Check tooltip is initially not visible (opacity: 0)
  const initialOpacity = await tooltips.first().evaluate(el => getComputedStyle(el).opacity);
  expect(initialOpacity).toBe('0');

  // Hover and check opacity changes — force เพราะ XYFlow SVG layer อาจ intercept pointer-events
  await tooltipGroup.hover({ force: true });
  await page.waitForTimeout(300); // รอ CSS transition
  const hoverOpacity = await tooltips.first().evaluate(el => getComputedStyle(el).opacity);
  expect(parseFloat(hoverOpacity)).toBeGreaterThan(0);
});
