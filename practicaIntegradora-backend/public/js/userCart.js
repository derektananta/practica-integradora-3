document.addEventListener("DOMContentLoaded", async () => {
    const addToCartButtons = document.querySelectorAll(".product_AddCartButton");

    addToCartButtons.forEach((button) => {
        button.addEventListener("click", async () => {
            const productId = button.dataset.productId;

            try {
                const response = await fetch('/api/sessions/cartId');
                const data = await response.json();
                const userCartId = data.userCartId;

                const addToCartResponse = await fetch(`/api/carts/${userCartId}/products/${productId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (addToCartResponse.ok) {
                    alert("Product added to cart successfully");
                } if (addToCartResponse.status === 400) {
                    alert("You cannot add your own product to the cart.")
                } else {
                    alert("Failed add product to cart");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        });
    });
});
