$(".btn-auth").click(() => {
    const token = $("input[name='auth-token']").val();
    
    fetch('/api/auth',{
        method : "POST",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"token" : token})
    }).then(res => res.json())
    .then(res => {
        alert(res.message);
        if(res.result == "success") location.href = res.redirect;  
    })
})