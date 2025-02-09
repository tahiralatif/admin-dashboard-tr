export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-02-07'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

export const token = assertValue(
  'skKKWVQLmnRLvaSBoQHwE9RFUQ0fu2aUM74B6yG8uMNlYc8ZBYNeRwwk6EP3HoPanUS2Zw27yfsFoJKWkTgTeKJx8FTdyFidYaJpNepM1GCzyuBPJfMzRSicz0QqFdIGqP6VIlcqbq0fqArcz5EbIchckVFx9BLwSFI3uqlVcXqsp0wLC0Od',
  'Missing environment variable: NEXT_API_TOKEN'
)


function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
