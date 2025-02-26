document.addEventListener("DOMContentLoaded", function () {
    const menuItems = document.querySelectorAll(".sidebar ul li > a");

    menuItems.forEach(item => {
        const submenu = item.nextElementSibling;

        if (submenu) {
            item.addEventListener("click", function (e) {
                e.preventDefault();
                
                // Menü aufklappen oder schließen
                this.parentElement.classList.toggle("active");

                // Andere offene Menüs schließen
                document.querySelectorAll(".sidebar ul li").forEach(li => {
                    if (li !== this.parentElement) {
                        li.classList.remove("active");
                    }
                });
            });
        }
    });
});
