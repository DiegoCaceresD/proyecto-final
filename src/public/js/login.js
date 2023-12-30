
const form = document.getElementById('loginForm');

form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    fetch('/api/sessions/login', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
        // if (result.status === 200) {
        //     window.location.replace('/users');
        // }
        if (result.status === 200) {
            result.json()
                .then(json => {
                    // cookie
                    console.log("JSON", json);
                    console.log("Cookies generadas:", document.cookie);
                    window.location.replace('/users');
                })
        } else if (result.status === 401) {
            console.warn(result);
            alert("Login invalido revisa tus credenciales!");
        }
    })
})