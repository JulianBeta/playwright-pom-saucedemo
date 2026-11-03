/** Public demo accounts published on the saucedemo.com login page. */
export const USERS = {
  standard_user: 'Baseline user; everything works',
  locked_out_user: 'Cannot log in',
  problem_user: 'Broken images, sorting, cart and checkout',
  performance_glitch_user: 'Slow login',
  error_user: 'Errors on sorting, cart and finishing checkout',
  visual_user: 'Visual differences: prices, images, layout',
} as const;

export type Username = keyof typeof USERS;

export const PASSWORD = process.env.SAUCE_PASSWORD ?? 'secret_sauce';

export function assertUsername(name: string): Username {
  if (!(name in USERS)) throw new Error(`Unknown demo user "${name}". Known: ${Object.keys(USERS).join(', ')}`);
  return name as Username;
}
