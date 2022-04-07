import { getTokenMetadata } from '$lib/services/ApiService';

export function get({ params }) {
  const metadata = getTokenMetadata(params.id);

  return {
      body: metadata
  };
}