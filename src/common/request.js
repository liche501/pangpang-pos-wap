export function getAccount() {
  const account = sessionStorage.getItem('account');
  if (account === undefined) {
    return null;
  }
  return JSON.parse(account);
}

export function getRequestHeader() {
  let header = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  const account = getAccount();
  if (account !== null) {
    header.Authorization = `Bearer ${account.token}`;
  }
  return header;
}

export function logout() {
  sessionStorage.clear();
  window.location.href = "/#";
}