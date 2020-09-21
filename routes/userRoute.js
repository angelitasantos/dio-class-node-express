const fs = require('fs')
const { join } = require('path')

const filePath = join(__dirname, 'users.json')

const getUsers = () => {
    const data = fs.existsSync(filePath)
    ? fs.readFileSync(filePath)
    : []

    try {
        return JSON.parse(data)
    } catch (error) {
        return []
    }
}

const saveUser = (users)=> fs.writeFileSync(filePath, JSON.stringify(users, null, '\t'))

const userRoute = (app) => {
    app.route('/users/:id?')
        // Módulo para listar usuários
        .get((req, res) => {
            const users = getUsers()

            res.send({ users })
        })
        // Módulo para criar novo usuários
        .post((req, res) => {
            const users = getUsers()

            users.push(req.body)
            saveUser(users)

            res.status(201).send('Usuário criado com sucesso!')
        })
        // Módulo para alterar dados do usuário
        .put((req, res) => {
            const users = getUsers()

            saveUser(users.map(user => {
                if (user.id === req.params.id) {
                    return {
                        ...user,
                        ...req.body
                    }
                }

                return user
            }))

            res.status(200).send('Usuário alterado com sucesso!')
        })
        // Módulo para excluir um usuário
        .delete((req, res) => {
            const users = getUsers()

            saveUser(users.filter(user => user.id !== req.params.id))

            res.status(200).send('Usuário excluído com sucesso!')
        })

}

module.exports = userRoute