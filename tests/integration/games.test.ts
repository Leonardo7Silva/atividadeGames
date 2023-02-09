import app from "app";
import prisma from "config/database";
import supertest from "supertest";
import httpStatus from "http-status";
import { createNewConsole } from "../factories/games-factory";

const api = supertest(app);


beforeAll(async () => {
    await prisma.console.deleteMany();
    await prisma.game.deleteMany();

});


afterAll(async () => {
    await prisma.console.deleteMany();
    await prisma.game.deleteMany();
});

beforeEach(async () => {
    await prisma.console.deleteMany();
    await prisma.game.deleteMany();
});

describe("GET /console", ()=>{

    it(" should response 200 ", async() => {

        const consoles = await api.get("/consoles")
        expect(consoles.status).toBe(httpStatus.OK)

    });

    it(" shold response 404 if id no exist ", async () =>{

        const consoles = await api.get("/consoles/0")
        expect(consoles.status).toBe(httpStatus.NOT_FOUND)
    });

    it(" shold response 200 if id exist", async () => {

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

    it("shold response 422 if send body without name", async () =>{
        const newConsole = await api.post("/consoles").send({});
        expect(newConsole.status).toBe(httpStatus.UNPROCESSABLE_ENTITY)
    });

    it("shold response 409 if name already exist", async () =>{
        const newConsole = await createNewConsole();
        const consoleRepetido = await api.post("/consoles").send({
            name: newConsole.name
        });
        expect(consoleRepetido.status).toBe(httpStatus.CONFLICT)
    });

    it("shold response 201 if body is correct", async () => {
        const newconsole = await api.post("/consoles").send({
            name:"PS4"
        });

        expect(newconsole.status).toBe(httpStatus.CREATED)
    })
})