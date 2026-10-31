// Quản lý bình luận — chỉ dành cho chủ website.
// Cần biến bí mật ADMIN_TOKEN (từ 32 ký tự) trong Cloudflare Pages. Chưa cấu hình thì từ chối mọi yêu cầu.
// GET  /api/admin/comments?status=pending|approved|rejected  → danh sách + số lượng theo trạng thái
// POST /api/admin/comments  {id, action: "approve" | "reject" | "delete"}
const json = (v, status = 200) =>
  Response.json(v, { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });

const encoder = new TextEncoder();
const digest = async (s) => new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(s)));
// So sánh qua SHA-256 để thời gian xử lý không phụ thuộc vào việc đoán đúng bao nhiêu ký tự.
const sameSecret = async (given, expected) => {
  const [a, b] = await Promise.all([digest(given), digest(expected)]);
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
};

const STATUSES = ["pending", "approved", "rejected"];
const NEW_STATUS = { approve: "approved", reject: "rejected" };
const isId = (s) => /^[0-9a-f-]{36}$/i.test(s);

export const onRequest = async ({ request, env }) => {
  if (!env.DB) return json({ error: "Chưa cấu hình lưu trữ" }, 503);
  if (!env.ADMIN_TOKEN || String(env.ADMIN_TOKEN).length < 32) {
    return json({ error: "Chưa cấu hình mật khẩu quản trị" }, 503);
  }

  const auth = request.headers.get("Authorization") || "";
  const given = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!given || !(await sameSecret(given, String(env.ADMIN_TOKEN)))) {
    return json({ error: "Sai mật khẩu quản trị" }, 401);
  }

  if (request.method === "GET") {
    const status = new URL(request.url).searchParams.get("status") || "pending";
    if (!STATUSES.includes(status)) return json({ error: "Trạng thái không hợp lệ" }, 400);
    const rows = await env.DB
      .prepare("SELECT id,slug,name,email,phone,body,status,created_at FROM comments WHERE status=? ORDER BY created_at DESC LIMIT 100")
      .bind(status)
      .all();
    const totals = await env.DB.prepare("SELECT status,COUNT(*) AS n FROM comments GROUP BY status").all();
    const counts = Object.fromEntries((totals.results || []).map((r) => [r.status, r.n]));
    return json({ comments: rows.results || [], counts });
  }

  if (request.method === "POST") {
    let v;
    try {
      v = await request.json();
    } catch {
      return json({ error: "Dữ liệu không hợp lệ" }, 400);
    }
    const id = String(v?.id || "");
    const action = String(v?.action || "");
    if (!isId(id)) return json({ error: "Mã bình luận không hợp lệ" }, 400);
    if (action !== "delete" && !NEW_STATUS[action]) return json({ error: "Thao tác không hợp lệ" }, 400);

    const result =
      action === "delete"
        ? await env.DB.prepare("DELETE FROM comments WHERE id=?").bind(id).run()
        : await env.DB.prepare("UPDATE comments SET status=? WHERE id=?").bind(NEW_STATUS[action], id).run();
    if (!result?.meta?.changes) return json({ error: "Không tìm thấy bình luận" }, 404);
    return json({ ok: true });
  }

  return json({ error: "Phương thức không hỗ trợ" }, 405);
};
