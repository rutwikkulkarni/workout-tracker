export const API = {
  async get(url){const r=await fetch(`/api${url}`);return r.json();},
  async post(url,body){const r=await fetch(`/api${url}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});return r.json();},
  async put(url,body){const r=await fetch(`/api${url}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});return r.json();},
  async del(url){const r=await fetch(`/api${url}`,{method:'DELETE'});return r.json();},
};
