export async function POST(request) {
  try {
    const { name, email, message } = await request.json()

    const data = new URLSearchParams()
    data.append('entry.2005620554', name)
    data.append('entry.1045781291', email)
    data.append('entry.472203668', message)

    const response = await fetch('https://docs.google.com/forms/d/e/1FAIpQLScsQAtXirGnK1y-79FZm20Xsy89Dj2ZYjVGATRjB7e1JajOzA/formResponse', {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    if (response.ok) {
      return new Response('Success', { status: 200 })
    } else {
      console.error('Google Form submission failed:', response.status)
      return new Response('Error submitting to form', { status: 500 })
    }
  } catch (error) {
    console.error('Error in API route:', error)
    return new Response('Internal server error', { status: 500 })
  }
}