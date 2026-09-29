$(".dark-mode > label > input[type=checkbox]").click((e) => {
    // dark mode
    if(e.target.checked == false){
        $("html").attr("web-theme", "dark");
        localStorage.setItem('web-theme', 'dark');
    }
    // light mode
    else if(e.target.checked == true){
        $("html").attr("web-theme", "light");
        localStorage.setItem('web-theme', 'light');
    }

    sendThemeData(e.target.checked);
})

function sendThemeData(check){
    const data = check ? "light" : "dark";

    fetch(`/api/theme?data=${data}`);
}