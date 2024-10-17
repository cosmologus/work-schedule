

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.CawMrY3Z.js","_app/immutable/chunks/scheduler.BvLojk_z.js","_app/immutable/chunks/index.BmMF69ck.js","_app/immutable/chunks/entry.DxZbiqL5.js"];
export const stylesheets = [];
export const fonts = [];
