import app from "app";
import prisma from "config/database";
import supertest from "supertest";
import httpStatus from "http-status";
import { createNewConsole } from "../factories/consoles-factory";
import { createNewGame } from "../factories/games-factory";

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

describe("GET /games", ()=> {

    it("Should response 200", async()=>{
        const games = await api.get("/games");
        expect(games.status).toBe(httpStatus.OK)
    });

    it(" Should response 200 ", async() => {
        const console = await createNewConsole();

        const game = await createNewGame(console.id)
        
        const games = await api.get("/games")
        
        expect(games.body).toEqual([{
            id:game.id,
            title:game.title,
            consoleId:game.consoleId,
            Console:{
                id:console.id,
                name:console.name
            }
        }])
    
    });

    it(" Should response 404 if id no exist ", async () =>{

        const games = await api.get("/games/0")
        expect(games.status).toBe(httpStatus.NOT_FOUND)
    });

    it("Should response 200 if id exist", async()=>{

        const newConsole = await createNewConsole();
        
        const newGame = await createNewGame(newConsole.id);
        
        const findGame = await api.get(`/games/${newGame.id}`);

        expect(findGame.body).toEqual({
            id: newGame.id,
            title: newGame.title,
            consoleId: newGame.consoleId
        });
    
    });
});

describe("POST /games", ()=>{

    it("Should response 422 if send body without title", async () =>{
        const newGame = await api.post("/games").send({
            consoleId:1
        });
        expect(newGame.status).toBe(httpStatus.UNPROCESSABLE_ENTITY)
    });

    it("Should response 422 if send body without consoleId", async () =>{
        const newGame = await api.post("/games").send({
            title:"Horizon"
        });
        expect(newGame.status).toBe(httpStatus.UNPROCESSABLE_ENTITY)
    });

    it("Should response 422 if title is not a string", async () =>{

        const wrongGame = await api.post("/games").send({
            title: 0,
            consoleId:1
        });
        expect(wrongGame.status).toBe(httpStatus.UNPROCESSABLE_ENTITY)
    });

    it("Should response 422 if consoleId is not a number", async () =>{

        const wrongGame = await api.post("/games").send({
            title: "Horizon",
            consoleId:"string"
        });
        expect(wrongGame.status).toBe(httpStatus.UNPROCESSABLE_ENTITY)
    });

    it("Should response 409 if consoleId not exist", async () =>{

        const wrongGame = await api.post("/games").send({
            title: "Horizon",
            consoleId:0
        });
        expect(wrongGame.status).toBe(httpStatus.CONFLICT)
    });

    it("Should response 409 if title already exist", async () =>{

        const console = await createNewConsole();
        const game = await createNewGame(console.id);


        const wrongGame = await api.post("/games").send({
            title: game.title,
            consoleId:console.id
        });
        expect(wrongGame.status).toBe(httpStatus.CONFLICT)
    });

    it("Should response 201 if body is correct", async () => {

        const console = await createNewConsole();
        const newGame = await api.post("/games").send({
            title:"Horizon",
            consoleId: console.id
        });

        expect(newGame.status).toBe(httpStatus.CREATED);
    })



});