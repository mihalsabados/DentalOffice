

export function logout(){
    localStorage.clear();
  }
  
  export function getCurrentUser(){
    let user = localStorage.getItem('user');
    if (user !== null)
        return JSON.parse(user);    
    return null;
  }

  export function tokenIsPresent() {
    let accessToken = getToken();
    return accessToken !== null;
}

export function getToken() {
    return localStorage.getItem('jwt');
}