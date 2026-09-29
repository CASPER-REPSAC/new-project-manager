import { createPool } from 'mysql2/promise';
import secret from "../config/secret.json" with { type: "json" };

const mysql = secret.mysql;

const pool = createPool(
    {   
        host: mysql.host, 
        user: mysql.user,
        password: mysql.password,
        database: mysql.dbname,
        dateStrings: 'date'
    }
);

const getConnection = function() {
    return pool.getConnection();
};

const sendQuery = async function(query, values) {
    try {
        const connection = await getConnection();
        try {
            const [rows] = await connection.execute(query, values);
            connection.release();
            return rows;
        } catch(err) {
            connection.release();
            console.log("query error");
            console.log(err);
            console.log(query, values);
        }
    } catch(err) {
        console.log("db error");
        console.log(err);
    }
};

export default sendQuery
