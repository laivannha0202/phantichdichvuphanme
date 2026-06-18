// Access token chỉ lưu trong memory - KHÔNG lưu localStorage/sessionStorage
let accessToken: string | null = null;

export const tokenStorage = {
  get: () => accessToken,
  set: (token: string) => {
    accessToken = token;
  },
  clear: () => {
    accessToken = null;
  },
};
