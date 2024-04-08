export const createProductErrorInfo = (product) => {
    return `One or more properties were incompleted or not valid.
    List of required properties:
    * title: needs to be a String, received ${product.title}
    * description: needs to be a String, received ${product.description}
    * price: needs to be a Number, received ${product.price}
    * thumbnail: needs to be a String, received ${product.thumbnail}
    * code: needs to be a String, received ${product.code}
    * stock: needs to be a Number, received ${product.stock}
    * category: needs to be a String, received ${product.category}`
}

// export const addProductCartErrorInfo = (cid, pid) => {
//     return `One or more id are not valid or doesn´t exist
//     * CartId: needs to be a String, received ${cid}
//     * ProductId: needs to be a String, receivded ${pid}`
// }
