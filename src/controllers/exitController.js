import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

mongoClient.connect().then(() => {
	db = mongoClient.db(process.env.MONGO_DATABASE);
});


export async function getExit (req, res) {
	
}

export async function newExit (req, res) {

};

export async function editExit (req, res) {

};

export async function deleteExit (req, res) {

};