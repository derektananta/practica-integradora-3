document.addEventListener('DOMContentLoaded', () => {
    const createProductForm = document.getElementById('createProductForm');
    const deleteProductBtn = document.getElementById('deleteProductBtn');
    const productSelect = document.getElementById('productSelect');

    createProductForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(createProductForm);
        const productData = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });

            if (response.ok) {
                alert("Product created successfully")
                window.location.reload()
            } else {
                console.error('Error creating product:', response.statusText);
            }
        } catch (error) {
            console.error('Server Error:', error);
        }
    });

    deleteProductBtn.addEventListener('click', async () => {
        const productIdToDelete = productSelect.value;
  
        try {
          const response = await fetch(`/api/products/${productIdToDelete}`, {
            method: 'DELETE',
          });
  
          if (response.ok) {
            alert("Product deleted successfully");
            window.location.reload()
          } else {
            console.error('Error deleting product:', response.statusText);
          }
        } catch (error) {
          console.error('Server Error:', error);
        }
      });

});