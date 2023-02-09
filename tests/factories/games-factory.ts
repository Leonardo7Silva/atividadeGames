import prisma from "config/database";
import {faker} from "@faker-js/faker";

export async function createNewGame(consoleId:number){

    return await prisma.game.create({
        data:{
            title: faker.name.firstName(),
            consoleId,
        }
    });
}