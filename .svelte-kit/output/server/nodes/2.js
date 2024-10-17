

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.CadZMZBc.js","_app/immutable/chunks/scheduler.BvLojk_z.js","_app/immutable/chunks/index.BmMF69ck.js"];
export const stylesheets = ["_app/immutable/assets/2.Cp0g84Wa.css"];
export const fonts = [];
