import request from "supertest";
import { type Express } from "express";
import { prisma } from "../db"; // assuming you have a connection pool exported from db.ts
import { faker } from "@faker-js/faker";

const TEAM_CATEGORY_OPTIONS = [
  "Basketball",
  "Badminton",
  "Volleball",
  "Soccer",
  "Baseball",
  "Football",
  "Hockey",
  "Tennis",
  "Ping Pong",
  "Golf",
  "Cricket",
  "Rugby",
  "Swimming",
  "Other",
] as const;

interface Team {
  teamCategories: (typeof TEAM_CATEGORY_OPTIONS)[number];
  teamName: string;
  teamDescription: string;
  teamCreator: string;
}

const DEV_HOST = "http://localhost:8080";

function generateTeam(): Team {
  return {
    teamCategories: faker.helpers.arrayElement(TEAM_CATEGORY_OPTIONS), // assuming you have an array of categories called 'categories
    teamName: faker.commerce.productName(),
    teamDescription: faker.commerce.productDescription(),
    teamCreator: faker.string.uuid(),
  };
}

function generateUser() {
  return {
    username: faker.internet.userName(),
    useremail: faker.internet.email(),
    userpassword: faker.internet.password(),
    userbirthday: faker.date.past().toISOString(),
    userfirstname: faker.person.firstName(),
    userlastname: faker.person.lastName(),
  };
}

describe("Teams Routes", () => {
  let app: Express;

  afterAll(() => {
    // Close the database pool after tests
  });

  beforeAll(() => {
    // app = express();
    // app.use(express.json());
    // app.use("/", require("../routers/teams"));
  });

  describe("POST /create", () => {
    it("should successfully create a new team", async () => {
      const userItem = generateUser();
      const newTeam = generateTeam();

      const u = await prisma.tbl_user.create({
        data: userItem,
      });

      newTeam.teamCreator = u.userid;

      const response = await request(DEV_HOST)
        .post("/teams/create")
        .set("Accept", "application/json")
        .send(newTeam);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("teamId");

      console.log(response.body);

      await prisma.tbl_user.delete({
        where: {
          userid: u.userid,
        },
      });
    });
  });
});
