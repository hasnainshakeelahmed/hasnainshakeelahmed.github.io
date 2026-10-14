# Channel Posts Seed — Coverage & Recovery Notes

Source: WhatsApp side chat (`abe5ad9a-2874-4920-ac0c-b420499f7b05`), extracted 14 Oct 2026.
Method note: `chat.read_messages` was unavailable in the subagent environment, so the
same side-chat transcript was read through the read-only `muse.db` view of the
chat's stored messages (same content, same delivery records).

## Coverage

- The side-chat transcript reaches back to 28 Sep 2026, so the full requested
  window (29 Sep – 14 Oct 2026) is covered for that chat.
- Seed contains **23 posts**: 10 Scholarships & Internships + 13 Main channel.
- Deduplication: originals, retries and image resends were merged — one entry per
  date + channel, keeping the fullest caption version.

## Caption handling

- Captions start at the post's own headline (emoji + title). Agent lead-ins
  ("Tonight's main channel post:", "Today's opportunity post:", etc.), the image
  markdown line, trailing "Can you see the image?" prompts, and `<message_break/>`
  meta-chatter were stripped. The caption body is otherwise verbatim.
- The 29 Sep captions carry the bare `https://www.career-radar.space/` URL — the
  "Visit our website:" prefix rule was set later that day (29 Sep), so the
  delivered 29 Sep captions genuinely lack the prefix.

## Posts NOT in the seed (could not be fully recovered from the side chat)

- **Scholarships & Internships, 1–3 Oct**: no S&I post was delivered in the side
  chat on those dates. Verified: zero assistant messages in the ~4 PM PKT windows
  (15:30–17:30 PKT) on 1, 2, 3 Oct. They may have been generated in other runs
  but never reached the side chat (the delivery-failure period).
- **Both channels, 12–13 Oct**: channels paused by Hasnain's order — no posts.
- **Scholarships & Internships, 14 Oct** (University of Miami Stamps Scholarship):
  scheduled for 4 PM PKT on 14 Oct, not yet delivered at extraction time
  (~10:0x PKT). Add it after it posts.
- **Main channel, 14 Oct**: scheduled 8 PM PKT, not yet posted at extraction time.

## One-off extras deliberately excluded (not part of the daily series)

- **Food for Thought post, 29 Sep** (main channel, image `thought/2026-09-29.png`):
  "Will AI take your future job — or make you 10x more valuable?" — a separate
  Tue/Thu/Sat 6 PM series; only this one episode appears in the window.
- **Volunteer recruitment call, 2 Oct** (main channel,
  image `volunteer-website-2026-10-02-resend.jpg`): one-off volunteer drive post.

## Image-file quirks

- **29 Sep main**: delivered as `posts/main/2026-09-29.png` (subfolder; later posts
  sit directly in `posts/`). Recorded verbatim as `main/2026-09-29.png`.
- **1–3 Oct main**: the delivered versions referenced the `-resend.jpg` files
  (image delivery was failing for the originals at the time). Recorded as the
  resend filenames actually delivered.
- **8 Oct S&I** repeats the 29 Sep CBD Punjab topic with a new caption — kept as
  its own entry (different date, different caption).
