const {Router} = require("express")

const UserController = require("../controllers/UsersController")

const useRoutes = Router()



function myMiddleware(request, response, next){
    console.log("myddellware")

    if(!request.body.isAdmin){
        return response.json({message: "Not Não autorizado"})
    }

    next();
}



const usersController = new UserController();


useRoutes.post("/", myMiddleware,usersController.create);
useRoutes.put("/:id", usersController.update);

module.exports = useRoutes;