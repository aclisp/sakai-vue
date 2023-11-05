import { authentication, createDirectus, rest } from '@directus/sdk';

export const directusHost = 'http://192.168.0.109:8055';

export const directusClient = createDirectus(directusHost)
    .with(authentication('json', { autoRefresh: false }))
    .with(rest());
