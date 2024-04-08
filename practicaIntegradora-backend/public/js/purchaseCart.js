document.addEventListener("DOMContentLoaded", async () => {
    const purchaseButton = document.getElementById("purchaseButton");

    if (purchaseButton) {
        purchaseButton.addEventListener("click", async () => {
            try {
                const response = await fetch('/api/sessions/cartId');
                const data = await response.json();
                const cartId = data.userCartId;

                const purchaseCartResponse = await fetch(`/api/carts/${cartId}/purchase`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (purchaseCartResponse.ok) {
                    console.log("OK");

                    const generateTicketResponse = await fetch('/api/tickets/generate', {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });

                    if (generateTicketResponse.ok) {
                        try {

                            const generateTicketData = await generateTicketResponse.json();
                            const ticketId = generateTicketData.ticketId;

                            console.log("Ticket generated successfully");
                            return window.location.replace(`/tickets/${ticketId}`);
                        } catch (jsonError) {

                            console.error("Failed to parse JSON response for generate ticket", jsonError);
                            alert("Failed to generate ticket");
                        }
                    } else {

                        console.error("Failed to generate ticket", generateTicketResponse.statusText);
                        alert(`Failed to generate ticket: ${generateTicketResponse.statusText}`);
                    }

                } else {

                    const errorData = await purchaseCartResponse.json();
                    console.error("Failed to process purchase", errorData);
                    alert(`Failed to process purchase: ${errorData.message}`);
                }
            } catch (error) {
                console.error("Error:", error);
                alert("An unexpected error occurred");
            }
        });
    }
});
