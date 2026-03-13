import { neon } from "@neondatabase/serverless";

type NeonClient = ReturnType<typeof neon>;

let _client: NeonClient | null = null;

function getClient(): NeonClient {
  if (!_client) {
    _client = neon(process.env.DATABASE_URL!);
  }
  return _client;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function sql(strings: TemplateStringsArray, ...values: unknown[]): Promise<Record<string, any>[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return getClient()(strings, ...values) as Promise<Record<string, any>[]>;
}
