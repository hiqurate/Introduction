// ============================================
// HawkSight — API client
// ============================================

(function (root) {
  class ApiError extends Error {
    constructor(status, message, details) {
      super(message);
      this.status = status;
      this.details = details || {};
      this.code = this.details.code;
    }
  }

  const listeners = { unauthorised: [], passwordChange: [] };

  async function request(method, url, body, options = {}) {
    const headers = { 'X-Requested-With': 'HawkSight', Accept: 'application/json' };
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    let res;
    try {
      res = await fetch(url, {
        method,
        headers,
        credentials: 'same-origin',
        body: body !== undefined ? JSON.stringify(body) : undefined
      });
    } catch (err) {
      throw new ApiError(0, 'Unable to reach HawkSight. Check your connection and try again.', { network: true });
    }
    if (options.blob) {
      if (!res.ok) throw new ApiError(res.status, 'Download failed');
      return { blob: await res.blob(), filename: (res.headers.get('Content-Disposition') || '').match(/filename="([^"]+)"/)?.[1] };
    }
    let data = null;
    const text = await res.text();
    if (text) {
      try { data = JSON.parse(text); } catch { data = null; }
    }
    if (!res.ok) {
      const message = (data && data.error) || `Request failed (${res.status})`;
      const err = new ApiError(res.status, message, data && (data.details || (data.code ? { code: data.code } : null)));
      if (data && data.code) err.code = data.code;
      if (res.status === 401 && !options.quiet) listeners.unauthorised.forEach(fn => fn());
      if (res.status === 403 && err.code === 'PASSWORD_CHANGE_REQUIRED') listeners.passwordChange.forEach(fn => fn());
      throw err;
    }
    return data;
  }

  const API = {
    ApiError,
    get: (url, opts) => request('GET', url, undefined, opts),
    post: (url, body, opts) => request('POST', url, body || {}, opts),
    put: (url, body, opts) => request('PUT', url, body || {}, opts),
    patch: (url, body, opts) => request('PATCH', url, body || {}, opts),
    del: (url, body, opts) => request('DELETE', url, body || {}, opts),
    blob: url => request('GET', url, undefined, { blob: true }),
    onUnauthorised: fn => listeners.unauthorised.push(fn),
    onPasswordChange: fn => listeners.passwordChange.push(fn),
    qs(params) {
      const p = Object.entries(params || {}).filter(([, v]) => v !== undefined && v !== null && v !== '');
      return p.length ? `?${p.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&')}` : '';
    }
  };

  root.API = API;
})(window);
