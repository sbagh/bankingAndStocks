import { Pool, QueryResult } from "pg";

interface User {
   userID: number;
   username?: string;
   password?: string;
   firstName?: string;
   lastName?: string;
}

// connect to db:
const pool = new Pool({
   user: "postgres",
   password: "password",
   database: "user_accounts",
   host: "localhost",
   port: 5432,
});

// get all users:
const getAllUsers = async (): Promise<User[]> => {
   try {
      const queryString = "SELECT * FROM users";
      const results: QueryResult = await pool.query(queryString);
      // console.log(results.rows);

      // changing to camel case
      const camelCaseResults = results.rows.map((user) => {
         return {
            userID: user.user_id,
            firstName: user.first_name,
            lastName: user.last_name,
         };
      });
      return camelCaseResults;
   } catch (error) {
      console.log("error in Getting All Users", error);
      throw error;
   }
};

//create a user in db
const createUser = async (
   username,
   password,
   firstName,
   lastName
): Promise<void> => {
   try {
      const queryString =
         "INSERT INTO users (username, password, first_name, last_name) VALUES ($1, $2, $3, $4)";
      const queryParameters = [username, password, firstName, lastName];
      await pool.query(queryString, queryParameters);
   } catch (error) {
      console.log("error in creating user in DB", error);
      throw error;
   }
};

// get user by their username
const getUserByUsername = async (username: string): Promise<User | null> => {
   try {
      const queryString = "SELECT * FROM users WHERE username = $1";
      const queryParameters = [username];
      const result: QueryResult = await pool.query(
         queryString,
         queryParameters
      );
      //convert result to camel case
      const camelCaseResult = result.rows.map((user) => {
         return {
            userID: user.user_id,
            username: user.username,
            password: user.password,
            firstName: user.first_name,
            lastName: user.last_name,
         };
      });
      return camelCaseResult[0] || null;
   } catch (error) {
      console.log("error in getting user", error);
      throw error;
   }
};

export { User, getAllUsers, createUser, getUserByUsername };
