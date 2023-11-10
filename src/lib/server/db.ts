import { createClient, type Config } from '@libsql/client/web'
import { TURSO_AUTH } from '$env/static/private'

const config: Config = {
  url: 'libsql://marketdata-themixednuts.turso.io',
  authToken: TURSO_AUTH,
}

export const db = createClient(config)
