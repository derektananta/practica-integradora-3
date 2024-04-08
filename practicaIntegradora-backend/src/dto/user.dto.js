export default class UserDTO {
    constructor(user) {
        this.fullName = user.name,
        this.first_name = user.first_name,
        this.last_name = user.last_name,
        this.email = user.email,
        this.age = user.age,
        this.rol = user.rol
    }
}