// 브라우저에서 API Routes를 부르는 헬퍼. 실패하면 null을 돌려주고, 호출한 쪽에서 로컬 계산으로 대체합니다.

export async function postJson<T>(url: string, body: unknown): Promise<T | null> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
