/**
 * The homepage checks under the name FINAL-SPEC §10 gives them. The checks
 * live in verify-home.mjs; this file only runs it, with the same arguments.
 *
 *   node scripts/verify-landing.mjs [--quick] [--vp …] [--only …]
 */
await import("./verify-home.mjs");
