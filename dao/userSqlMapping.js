// CRUD SQL语句
var user = {
	insert: 'INSERT INTO user(name, age) VALUES(?,?)',
	insertbooklist: 'INSERT INTO booklist(name, creat_time, update_time) VALUES(?,?,?)',
	insertcontent: 'INSERT INTO book_content(book_id, title, content, source, creat_time, update_time) VALUES(?,?,?,?,?,?)',
	update: 'update user set name=?, age=? where id=?',
	updateContent: 'update book_content set content=?, update_time=? where id=?',
	delete: 'delete from user where id=?',
	queryById: 'select * from user where id=?',
	getContentById: 'select * from book_content where book_id=? limit ?,?',
	queryAll: 'select * from user',
	queryAllbooklist: 'select * from booklist'
};

module.exports = user;