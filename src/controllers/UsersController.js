const AppError = require("../utils/appError")
const { hash, compare } = require('bcryptjs')

const sqliteConnection = require('../database/sqlite')

class UserController {

    async create(request, response){
        const { name, email, password} = request.body;
        const database = await sqliteConnection()
        const checkUserExists = await database.get('select * from users where email = (?)', [email])

        if(checkUserExists){
            throw new AppError('Este email ja esta em uso')
        }

        const hashedPassword = await hash(password, 8)

        await database.run("insert into users (name, email, password) values (?,?,?)",[name, email, hashedPassword])

        return response.status(201).json()

    }


    async update(request, response){
        const {name, email, password, old_password} = request.body
        const { id } = request.params

        const database = await sqliteConnection();
        const user = await database.get("select * from users where id = (?)", [id])

        if(!user){
            throw new AppError('Usuario não existe')
        }

        const userWithUpdatedEmail = await database.get('select * from users where email = (?)',[email])

        if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id){
            throw new AppError("Email ja registrado! tente outro email")
        }

        user.name = name ?? user.name
        user.email = email ?? user.email

        if(password && !old_password){
            throw new AppError("você precisa informar a senha antiga para definir a nova senha")
        }

        if(password && old_password){
            const checkOldPassword = await compare(old_password, user.password)

            if(!checkOldPassword){
                throw new AppError("Senha não confere")
            }

            user.password = await hash(password, 8)
        }

        await database.run(`update users set name = ?, email = ?, password = ?, updated_at = DATETIME('now') where id = ?`, [name, email, user.password, new Date(), id])

        return response.status(200).json()
    }

}

module.exports = UserController