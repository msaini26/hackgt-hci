// lib/snowflakeApi.js
export async function callSnowflakeLLM(messages, personalAccessToken, accountIdentifier) {
  const endpoint = `https://${accountIdentifier}.snowflakecomputing.com/api/v2/cortex/inference:complete`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${personalAccessToken}`,
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet', // or mistral-large2, etc.
      messages,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Snowflake API error: ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
