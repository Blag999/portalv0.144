/* assets/js/sidebar.js */
document.addEventListener("DOMContentLoaded", function () {
    const menuItems = document.querySelectorAll(".sidebar ul li");

    menuItems.forEach(item => {
        const submenu = item.querySelector(".submenu");

        item.addEventListener("mouseenter", function () {
            if (submenu) submenu.style.maxHeight = submenu.scrollHeight + "px";
        });

        item.addEventListener("mouseleave", function () {
            if (submenu) submenu.style.maxHeight = "0";
        });
    });
});
