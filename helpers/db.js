const mysql = require('mysql2/promise');

const createConnection = async () => {
	return await mysql.createConnection({
		host: '185.212.70.1',
		user: 'u694941157_noova44984984_',
		password: 'Empresario744121',
		database: 'u694941157_n4588221518_'
	});
}

const getUser = async (user) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('SELECT user FROM user WHERE user = ?', [user]);
	if (rows.length > 0) return rows[0].message;
	return false;
}

const setUser = async (user) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('INSERT INTO user SET user = ?', [user]);
	if (rows.length > 0) return rows[0].message;
	return false;
}

const setUnidade = async (unidade, user) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('UPDATE user SET unidade = ? WHERE user = ?', [unidade, user]);
	if (rows.length > 0) return rows[0].message;
	return false;
	}
	
const setProfessor = async (professor, user) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('UPDATE user SET professor = ? WHERE user = ?', [professor, user]);
	if (rows.length > 0) return rows[0].message;
	return false;
	}
	
const setAula = async (aula, user) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('UPDATE user SET aula = ? WHERE user = ?', [aula, user]);
	if (rows.length > 0) return rows[0].message;
	return false;
	}
	
const setNota = async (nota, user) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('UPDATE user SET nota = ? WHERE user = ?', [nota, user]);
	if (rows.length > 0) return rows[0].message;
	return false;
	}

module.exports = {
	createConnection,
	setUser,
	getUser,
	setUnidade,
	setProfessor,
	setAula,
	setNota
}