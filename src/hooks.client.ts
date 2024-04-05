import type { HandleClientError } from "@sveltejs/kit"

export const handleError = (async ({ error, event, status, message }) => {
  const errorId = crypto.randomUUID()
  console.log(status, error)

  return {
    message,
    errorId,
  }
}) satisfies HandleClientError
