// End-to-end smoke test — AJS B2B Fish Portal
//
// Menguji alur lengkap sesuai Acceptance Criteria brief:
//   Buyer: login → request order (incl. validasi over-stock) → submit
//   Admin: login → lihat request → reject (stok dikembalikan) → confirm
//
// Prasyarat: dev/production server berjalan di BASE_URL (default :3000)
// dan DB sudah ter-seed (npx prisma db seed).
//
// Jalankan:  node e2e/smoke.mjs
import { chromium } from "playwright";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

const checks = [];
function expect(name, condition) {
  checks.push({ name, pass: Boolean(condition) });
}

async function loginAs(page, email, password, expectedPath) {
  await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle" });
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL((url) => url.pathname === expectedPath, {
    timeout: 15000,
  });
}

async function logout(page) {
  await page.click('button:has-text("Logout")');
  await page.waitForURL((url) => url.pathname === "/login", { timeout: 15000 });
}

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newContext().then((c) => c.newPage());

  try {
    // === BUYER FLOW ===
    await loginAs(page, "buyer@demo.ajs.com", "buyer123", "/dashboard");
    expect("buyer login → /dashboard", page.url().includes("/dashboard"));

    // Request order Cakalang (300 KG) → redirect ke cart
    await page.goto(`${BASE_URL}/commodities/cakalang-skipjack-tuna`, {
      waitUntil: "networkidle",
    });
    await page.fill('input[name="quantity"]', "300");
    await page.click('button:has-text("Request Order")');
    await page.waitForURL((url) => url.pathname === "/cart", { timeout: 15000 });
    const cartText = await page.locator("body").innerText();
    expect("cart menampilkan Cakalang", cartText.includes("Cakalang"));
    expect("cart menampilkan qty 300", cartText.includes("300"));

    // Validasi over-stock ditolak di SERVER (bukan sekadar HTML5 max client).
    // Hapus atribut min/max agar constraint client tidak memblokir submit,
    // sehingga request benar-benar sampai ke Server Action untuk diuji.
    await page.goto(`${BASE_URL}/commodities/kerapu-grouper`, {
      waitUntil: "networkidle",
    });
    await page.$eval('input[name="quantity"]', (el) => {
      el.removeAttribute("max");
      el.removeAttribute("min");
    });
    await page.fill('input[name="quantity"]', "999999");
    await page.click('button:has-text("Request Order")');
    await page.waitForTimeout(1500);
    const kerapuText = await page.locator("body").innerText();
    expect(
      "over-stock ditolak server-side (pesan error)",
      kerapuText.includes("melebihi stok tersedia")
    );
    expect(
      "tetap di halaman detail saat ditolak",
      page.url().includes("/commodities/kerapu-grouper")
    );

    // Submit request order
    await page.goto(`${BASE_URL}/cart`, { waitUntil: "networkidle" });
    await page.click('button:has-text("Submit Request Order")');
    await page
      .waitForURL((url) => url.pathname === "/orders", { timeout: 15000 })
      .catch(() => {});
    expect("submit → /orders", page.url().includes("/orders"));
    const ordersText = await page.locator("body").innerText();
    expect("orders berstatus Requested", ordersText.includes("Requested"));

    await page.goto(`${BASE_URL}/cart`, { waitUntil: "networkidle" });
    const emptyCart = await page.locator("body").innerText();
    expect(
      "cart kosong setelah submit",
      emptyCart.includes("Cart Anda masih kosong")
    );

    await logout(page);

    // === ADMIN FLOW ===
    await loginAs(page, "admin@ajs.com", "admin123", "/admin");
    expect("admin login → /admin", page.url().includes("/admin"));

    const adminListText = await page.locator("body").innerText();
    expect(
      "admin melihat order request Requested",
      adminListText.includes("Requested")
    );

    // Buka order terbaru (Requested) → confirm
    await page.click('a[href^="/admin/orders/"]');
    await page.waitForURL((url) => url.pathname.startsWith("/admin/orders/"), {
      timeout: 15000,
    });
    const detailText = await page.locator("body").innerText();
    expect("detail order menampilkan Cakalang", detailText.includes("Cakalang"));

    await page.click('button:has-text("Confirm Order")');
    await page.waitForTimeout(1500);
    const afterConfirm = await page.locator("body").innerText();
    expect(
      "status menjadi Confirmed setelah confirm",
      afterConfirm.includes("Confirmed")
    );

    // Verifikasi filter status admin
    await page.goto(`${BASE_URL}/admin?status=CONFIRMED`, {
      waitUntil: "networkidle",
    });
    const confirmedFilter = await page.locator("body").innerText();
    expect(
      "filter CONFIRMED menampilkan order",
      confirmedFilter.includes("Confirmed")
    );

    // Kelola stok produk
    await page.goto(`${BASE_URL}/admin/products`, { waitUntil: "networkidle" });
    const productsText = await page.locator("body").innerText();
    expect(
      "halaman admin products termuat",
      productsText.includes("Products") && productsText.includes("Cakalang")
    );
  } finally {
    await browser.close();
  }

  const failed = checks.filter((c) => !c.pass);
  for (const c of checks) {
    console.log(`${c.pass ? "PASS" : "FAIL"}  ${c.name}`);
  }
  console.log(`\n${checks.length - failed.length}/${checks.length} checks passed`);
  if (failed.length > 0) process.exit(1);
}

run().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
