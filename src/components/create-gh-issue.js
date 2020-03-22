export let createGHIssue = async (payload) => {
  let response = await fetch(`/.netlify/functions/create-gh-issue`, {
    method: 'post',
    body: JSON.stringify(payload),
  })

  if (response.status >= 400) {
    throw new Error(response.text())
  }

  return response.json()
}
