const knex = require("../database/knex")
const AppError = require("../utils/appError")



class NotesController{
    async create(request, response){
        const {title, description, tags, links} = request.body;
        const { user_id } = request.params;

        const  [note_id] = await knex("notes").insert({
            title,
            description,
            user_id
        });

        console.log(note_id)

        const linksInsert = links.map(link => {
            return {
                note_id,
                url: link
            }
        });

        await knex("links").insert(linksInsert);


        const tagsInsert = tags.map(name => {
            return {
                note_id,
                name,
                user_id                
            };
        });

        await knex("tags").insert(tagsInsert);

        response.json();

    }

    async show(request, response){
        const { id } = request.params
        const note = await knex("notes").where({id}).first();
        const tags = await knex("tags").where({note_id: id}).orderBy("name");
        const links = await knex("links").where({note_id: id}).orderBy("created_at");

        return response.json({
            ...note,
            tags,
            links
        })
    }

    async delete(request, response){
        const { id } = request.params
        const IfExistNote = await knex("notes").where({id}).first();
        console.log(IfExistNote)

        if(!IfExistNote){
            throw new AppError("note not found")
        }

        await knex("notes").where({id}).delete();

        return response.json()
    }

    async index(request, response){
        const { title ,user_id } = request.query;

        console.log(user_id)
        const notes = await knex("notes").where({user_id}).whereLike("title", `%${title}%`).orderBy("title");
        
        const IfExistUser = await knex("notes").where({user_id}).first()

        if(!IfExistUser){
            throw new AppError("User not found notes")
        }

        return response.json(notes)
    }
}

module.exports = NotesController;