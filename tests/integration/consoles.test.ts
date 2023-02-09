import app from "app";
import prisma from "config/database";
import supertest from "supertest";
import httpStatus from "http-status";
import { createNewConsole } from "../factories/consoles-factory";

const api = supertest(app);


beforeAll(async () => {
    await prisma.game.deleteMany();
    await prisma.console.deleteMany();
    

});


afterAll(async () => {
    await prisma.game.deleteMany();
    await prisma.console.deleteMany();
    
});

beforeEach(async () => {
    await prisma.game.deleteMany();
    await prisma.console.deleteMany();
    
});

describe("GET /console", ()=>{

    it(" Should response 200 ", async() => {

        const consoles = await api.get("/consoles")
        expect(consoles.status).toBe(httpStatus.OK)

    });

    it(" Should response 200 ", async() => {
        const console = await createNewConsole();
        
        const consoles = await api.get("/consoles")
        expect(consoles.body).toEqual([{
            id:console.id,
            name:console.name
        }])
        
    });

    it(" Should response 404 if id no exist ", async () =>{

        const consoles = await api.get("/consoles/0")
        expect(consoles.status).toBe(httpStatus.NOT_FOUND)
    });

    it(" Should response 200 if id exist", async () => {

        const newConsole = await createNewConsole();

        const videogame = await api.get(`/consoles/${newConsole.id}`);

        expect(videogame.body).toEqual({
            id:newConsole.id,
            name:newConsole.name
        });

        expect(videogame.status).toBe(httpStatus.OK)
    }) 


})

describe("POST /consoles", ()=>{

    it("Should response 422 if send body without name", async () =>{
        const newConsole = await api.post("/consoles").send({});
        expect(newConsole.status).toBe(httpStatus.UNPROCESSABLE_ENTITY)
    });

    it("Should response 422 if name is not a string", async () =>{

        const wrongConsole = await api.post("/consoles").send({
            name: 0
        });

        expect(wrongConsole.status).toBe(httpStatus.UNPROCESSABLE_ENTITY)
    })

    it("Should response 409 if name already exist", async () =>{
        const newConsole = await createNewConsole();
        const consoleRepetido = await api.post("/consoles").send({
            name: newConsole.name
        });
        expect(consoleRepetido.status).toBe(httpStatus.CONFLICT)
    });

    it("Should response 201 if body is correct", async () => {
        const newconsole = await api.post("/consoles").send({
            name:"PS4"
        });

        expect(newconsole.status).toBe(httpStatus.CREATED)
    })
})