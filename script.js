document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ script.js loaded successfully!");

    // ----------------- LOGIN/SIGNUP TOGGLE -----------------
    const signInForm = document.getElementById("signIn");
    const signUpForm = document.getElementById("signUp");

    if (signInForm && signUpForm) {
        signInForm.style.display = "block";
        signUpForm.style.display = "none";

        document.getElementById("signUpButton")?.addEventListener("click", function () {
            signInForm.style.display = "none";
            signUpForm.style.display = "block";
        });

        document.getElementById("signInButton")?.addEventListener("click", function () {
            signUpForm.style.display = "none";
            signInForm.style.display = "block";
        });
    } else {
        console.warn("⚠️ Sign In or Sign Up form not found.");
    }

    document.getElementById("guestButton")?.addEventListener("click", function () {
        window.location.href = "homepage.php";
    });

    // ----------------- BUY BUTTON FUNCTIONALITY -----------------
    document.querySelectorAll(".buy-button").forEach(button => {
        button.addEventListener("click", function () {
            console.log("🛒 Buy button clicked!");

            const productCard = button.closest(".product-card");
            if (!productCard) {
                console.error("❌ Product card not found!");
                return;
            }

            const productName = productCard.querySelector("h3")?.innerText.trim() || "Unknown Product";
            let productPrice = productCard.querySelector(".product-price")?.innerText.trim() || "0";
            productPrice = productPrice.replace(/[^\d.]/g, ''); // Remove non-numeric characters
            const productImage = productCard.querySelector("img")?.src || "";

            if (!productName || !productPrice || !productImage) {
                alert("⚠️ Error: Product details are missing!");
                console.error("❌ Missing product details:", { productName, productPrice, productImage });
                return;
            }

            console.log(`🛍️ Selected: ${productName} - $${productPrice}`);
            window.location.href = `checkout.php?name=${encodeURIComponent(productName)}&price=${encodeURIComponent(productPrice)}&image=${encodeURIComponent(productImage)}`;
        });
    });
});
